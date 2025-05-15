import subprocess
import sys
# install facenet_pytorch before imports
subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip==25.0.1"])
subprocess.check_call([sys.executable, "-m", "pip", "install", "facenet_pytorch"])

import numpy as np
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import boto3
from PIL import Image
from facenet_pytorch import MTCNN, InceptionResnetV1, fixed_image_standardization
from openai import OpenAI
from sqlalchemy import create_engine, Column, Integer, String, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import argparse
import os

model_bucket_name = 'remind-me-deep-learning-model'
image_bucket_name = 'remind-me-image-storage'
S3_ACCESS_KEY_ID = "" #'replace with the S3 access key id'
S3_SECRET_ACCESS_KEY = "" #"replace with the S3 secret access key"
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')


s3_client = boto3.client('s3', aws_access_key_id= S3_ACCESS_KEY_ID,
    aws_secret_access_key= S3_SECRET_ACCESS_KEY,
    region_name="ap-southeast-1")

class FinetunedInceptionResnetV1(nn.Module):
    def __init__(self, model, num_classes):
        super(FinetunedInceptionResnetV1, self).__init__()
        self.backbone = model
        self.backbone.logits = nn.Linear(self.backbone.last_linear.out_features, num_classes)

        # Freeze all layers except the last fully connected layer
        for param in self.backbone.parameters():
            param.requires_grad = False
        for param in self.backbone.last_linear.parameters():
            param.requires_grad = True
        for param in self.backbone.last_bn.parameters():
            param.requires_grad = True
        for param in self.backbone.logits.parameters():
            param.requires_grad = True

    def forward(self, x):
        x = self.backbone(x)
        return x

Base = declarative_base()
class UserRemindee(Base):
    __tablename__ = 'user_remindee'

    remindee_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    image_object_key = Column(String, nullable=False)
    person_name = Column(String, nullable=False)
    summary = Column(String, nullable=True)
    relationship = Column(String, nullable=False)
        
def face_detection(device, image, image_key):
    # Define MTCNN model for facial detection
    mtcnn = MTCNN(
        image_size=160, margin=0, min_face_size=20,
        thresholds=[0.6, 0.7, 0.7], factor=0.709, post_process=True,
        device=device
    )
    
    transform = transforms.Resize((512, 512))
    img_resized = transform(image)
    save_path = f"cropped_{image_key}"
    mtcnn(img_resized, save_path=save_path)
    del mtcnn
    return img_resized

def load_model(user_id, device):
    s3_path = user_id + '/model.pth'
    local_model_path = 'model.pth'  # Local path to download the model
    
    try:
        s3_client.download_file(model_bucket_name, s3_path, local_model_path)
        print(f"Model downloaded from S3 to {local_model_path}")
    except Exception as e:
        print(f"Error downloading model from S3: {e}")
        sys.exit(f"Error downloading model from S3: {e}")
    
    checkpoint = torch.load(local_model_path, map_location=device)
    num_classes = checkpoint['num_classes']
    class_names = checkpoint['class_names']
    model = FinetunedInceptionResnetV1(InceptionResnetV1(classify=True, pretrained='vggface2'), num_classes=num_classes)
    model.load_state_dict(checkpoint['state_dict'])
    model.to(device)
    model.eval()
    return model, num_classes, class_names

def get_summary(person):
    DATABASE_ADMIN_NAME="RemindMe"
    DATABASE_PASSWORD ="RemindMe_2025"
    DB_INSTANCE ="remind-me-instance.czsmms6yqdmh.ap-southeast-1.rds.amazonaws.com"
    DATABASE_NAME="remind_me_data_db"
    DATABASE_URL = f"postgresql://{DATABASE_ADMIN_NAME}:{DATABASE_PASSWORD}@{DB_INSTANCE}:5432/{DATABASE_NAME}"

    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    
    try:
        db = SessionLocal()
        results = db.query(UserRemindee.summary).filter(UserRemindee.person_name == person).all()
    except Exception as e:
        sys.exit(f"An error occurred: {e}")
    finally:
        db.close()
    concatenated_string = ', '.join(item[0] for item in results)
    print("concatenated string:", concatenated_string)

    api_key = "re0DitCgTtefdDgvHRslGbCCQY6yQRdD"
    client = OpenAI(api_key=api_key, base_url="https://api.deepinfra.com/v1/openai")
    
    prompt = f"I have a list of memories with {person}: \
               \n\n{concatenated_string} \
               Provide a concise summary in a paragraph for me."
    
    response = client.chat.completions.create(
        model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
    
    
    
def main():
    user_id = args.user_id
    image_key = args.image_key
    if not user_id or not image_key:
        print("Error: user_id or image_key is missing.")
        sys.exit("Error: user_id or image_key is missing.")
    
    
    if "/" in image_key:
        local_path = image_key.rsplit("/", 1)[1]
    else:
        local_path = image_key

    # print(image_key)
    s3_client.download_file(model_bucket_name, image_key, local_path)
    print(f"Downloaded image to: {local_path}")
    image = Image.open(local_path).convert("RGB")

    # use gpu if available
    device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    image = face_detection(device, image, image_key)
    model, num_classes, class_names = load_model(user_id, device)

    # inference
    trans = transforms.Compose([
        np.float32,
        transforms.ToTensor(),
        fixed_image_standardization
    ])
    
    image = Image.open(local_path).convert("RGB")
    # Apply transformations to the image
    image_tensor = trans(image) #.unsqueeze(0)  # Add batch dimension
    image_tensor = image_tensor.unsqueeze(0).to(device)
    
    with torch.no_grad():
        output = model(image_tensor)
        probs = torch.softmax(output, dim=1)  # Convert logits to probabilities
        print(probs)
        confidence, predicted_class = torch.max(probs, 1) # Get predicted class
        print("predicted_class:", predicted_class)

        print("confidence:", confidence)
        
        if confidence >= .5:
            print(f"Predicted Class: {predicted_class.item()}")
            person = class_names[predicted_class.item()]
            print(f"Predicted Person: {person}")
        else:
            person = "NA"
            print("unable to identify person!")
            sys.exit("Unable to identify person!")
        
        

    # get summary of predicted person
    summary = get_summary(person)
    print(summary)
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--user_id', type=str) 
    parser.add_argument('--image_key', type=str) 
    args = parser.parse_args()
    main()
