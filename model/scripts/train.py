import subprocess
import sys
# install facenet_pytorch before imports
subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip==25.0.1"])
subprocess.check_call([sys.executable, "-m", "pip", "install", "facenet_pytorch==2.5.2"])

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split

from torch import optim
from torchvision import datasets, transforms
import numpy as np
import boto3
import os
from PIL import Image
import argparse
from torchvision.datasets import ImageFolder
from facenet_pytorch import MTCNN, InceptionResnetV1, fixed_image_standardization, training
import tarfile

model_bucket_name = 'remind-me-deep-learning-model'
image_bucket_name = 'remind-me-image-storage'
S3_ACCESS_KEY_ID = "" #'replace with the S3 access key id'
S3_SECRET_ACCESS_KEY = "" #"replace with the S3 secret access key"
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

s3_client = boto3.client('s3', aws_access_key_id = S3_ACCESS_KEY_ID,
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


def load_s3_images(bucket_name, data_dir, user_id):    
    response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=user_id)
    if 'Contents' not in response:
        return False
    else:
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)

        for obj in response['Contents']:
            file_key = obj['Key']
            if not file_key.endswith('/'):
                local_file_path = os.path.join(data_dir, os.path.relpath(file_key, user_id))
                dir_path = os.path.dirname(local_file_path)
                if dir_path:
                    os.makedirs(dir_path, exist_ok=True)
                s3_client.download_file(bucket_name, file_key, local_file_path)
                print(f"Downloaded: {file_key} to {local_file_path}")
                
    return True


def load_and_process_detection_dataset(data_dir, batch_size):
    
    # Load dataset without filtering (no transform needed yet)
    raw_dataset = ImageFolder(root=data_dir)

    # Initialize MTCNN
    mtcnn = MTCNN(
    image_size=160, margin=0, min_face_size=20,
    thresholds=[0.6, 0.7, 0.7], factor=0.709, post_process=True)

    # Loop through the dataset and keep only images with at least one face
    print("Filtering images using MTCNN...")
    for i in range(len(raw_dataset)):
        img_path, _ = raw_dataset.samples[i]
        try:
            img = Image.open(img_path).convert('RGB')
            faces = mtcnn(img)
            if faces is None:
                print("invalid image file: ", img_path)
            else:
                mtcnn(img, save_path = img_path.replace(data_dir, data_dir + "_cropped"))
        except Exception as e:
            print(f"Skipping {img_path}: {e}")
        
    
    dataset = datasets.ImageFolder(data_dir, transform=transforms.Resize((512, 512)))
    dataset.samples = [
        (p, p.replace(data_dir, data_dir + '_cropped'))
            for p, _ in dataset.samples
    ]

    loader = DataLoader(
        dataset,
        batch_size=batch_size,
        collate_fn=training.collate_pil,
        drop_last=True
    )

    print(dataset.classes, len(dataset))
    return loader, len(dataset.classes), dataset.classes


def load_recognition_dataset(data_cropped_dir, batch_size):
    trans = transforms.Compose([
        np.float32,
        transforms.ToTensor(),
        fixed_image_standardization
    ])

    dataset = datasets.ImageFolder(data_cropped_dir, transform=trans)
    # 80% training and 20% validation
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size

    # if validation set is empty (or only one), ensure at least one sample in validation and in training
    if val_size == 0:
        train_size = len(dataset) - 1
        val_size = 1

    train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
    train_loader = DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=True
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False
    )

    return train_loader, val_loader
    
def main():
    user_id = args.user_id
    if not user_id:
        print("Error: user_id is not set.") 
        sys.exit("Error: user_id is not set.") 

    # name the directory with user_id
    data_dir = user_id    
    success = load_s3_images(image_bucket_name, data_dir, user_id)
    if not success:
        print(f"Error: No images found for user {user_id}, so could not train the model.")
        sys.exit(f"Error: No images found for user {user_id}.")

    batch_size = 16
    loader, num_classes, class_names = load_and_process_detection_dataset(data_dir, batch_size)
    print(f"There are {num_classes}, and their names are {class_names}")

    # load original face recognition model and fine tune model
    resnet = InceptionResnetV1(classify=True, pretrained='vggface2').to(device)
    model = FinetunedInceptionResnetV1(resnet, num_classes=num_classes).to(device)

    # prepare recognition dataset
    train_loader, val_loader = load_recognition_dataset(data_dir + "_cropped", batch_size)

    # train model
    epochs = 20
    patience = 5  # num of epochs to wait for improvement
    best_val_loss = float('inf')
    patience_counter = 0  # track the number of epochs without improvement

    criterion = torch.nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct_predictions = 0
        total_predictions = 0

        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)

            loss.backward()
            optimizer.step()
            running_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            correct_predictions += (predicted == labels).sum().item()
            total_predictions += labels.size(0)

        epoch_loss = running_loss / len(train_loader)
        epoch_accuracy = 100 * correct_predictions / total_predictions
        
        print(f'Epoch {epoch+1}/{epochs}, Loss: {epoch_loss:.4f}, Accuracy: {epoch_accuracy:.2f}%')
        
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)

                outputs = model(inputs)
                loss = criterion(outputs, labels)
                val_loss += loss.item()

                _, predicted = torch.max(outputs, 1)
                val_correct += (predicted == labels).sum().item()
                val_total += labels.size(0)

        val_loss /= len(val_loader)
        val_accuracy = 100 * val_correct / val_total
        print(f'Validation Loss: {val_loss:.4f}, Validation Accuracy: {val_accuracy:.2f}%')

        if (best_val_loss - val_loss) > 0.01:
            best_val_loss = val_loss
            patience_counter = 0
        else:
            patience_counter += 1

        if patience_counter >= patience:
            print(f"Early stopping on epoch {epoch+1} due to no improvement in validation loss.")
            break

    print("Saving model...")
    local_model_path = "/opt/ml/model/model.pth"
    torch.save({'state_dict': model.state_dict(),
                'num_classes': num_classes,
                'class_names': class_names},
                local_model_path)
    
    model_s3_path = f"{user_id}/model.pth"
    try:
        s3_client.upload_file(local_model_path, model_bucket_name, model_s3_path)
        print(f"Model saved to S3: s3://{model_bucket_name}/{model_s3_path}")
    except Exception as e:
        sys.exit(f"Error uploading model to S3: {e}")
    
    

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--user_id', type=str) # no default user_id "user_id": "097a558c-5001-70c9-19e0-284519f32472"
    args = parser.parse_args()

    try:
        main()
    except Exception as e:
        print("❌ Error occurred in training:", e)
        import traceback
        traceback.print_exc()
        raise
