<!--## Bug Tracking Spreadsheet

Please fill in any malfunctions you found. Describe the symptom and brief steps to reproduce.

https://docs.google.com/spreadsheets/d/1xOOllvncZH0vhdhhlKFBqEEBx9Zmt1bM1VK8_m45fak/edit?gid=0#gid=0

# RemindMe: An Intelligent Face Reminder for Dementia Patients

Pain Point: The people having dementia often could not recognize their family members, friends, etc.
Functionality:
Create an app(could be web/mobile). When the user takes a picture of a person, and clicks the button “Remind Me!”, the app could remind him/her the stored information of the person. (for example: your daughter. She is living with you and taking care of you. Her name is …)
When a user takes a picture of a person, and then clicks the button “Input info”, he/she could input the information related to the photo with text/audio. The text/audio will be recorded in the backend of the app. When later the user clicks “Remind Me!”, the person’s information will display.
Pros:
We could keep the front end very concise to improve usability.
Utilize chatGPT API or other image recognition models to identify the person’s face and retrieve the information to the front end.
Unique idea, without needing to use the current public data.
Cons:
More efforts on back end (user authentication, database, models, etc, API designs)
Need to enhance safety measures since user’s info is put on cloud.
The usability of the app depends on the pre-loaded image library and manually input info.
Tools:
Frontend: React, or flutter (for mobile app development)
Backend: flask with Fast API, user information (postgreSQL/Domeno?, and Amazon s3 for images), OpenAI API?
AWS: EC2, s3, PostgreSQL
Fit project requirement with AWS components (why do we need to use cloud to do this App)
Models: image recognition model, OpenAI API (images, summarize the information about, give prompt, optional) (Brina, JunZhou)
Front end: Jin Xiang,
backend : fast API Yao Qin -->

# RemindMe: An Intelligent Face Reminder for Dementia Patients

Website domain: [http://remind-me-frontend.s3-website-ap-southeast-1.amazonaws.com](http://remind-me-frontend.s3-website-ap-southeast-1.amazonaws.com)

RemindMe is a web-based SaaS application designed to support individuals living with dementia by helping them
recognize and remember the people in their lives. Dementia often leads to memory loss and social disconnection,
placing emotional strain on patients and caregivers alike. Our solution addresses this through a personalized
memory assistant powered by facial recognition and large language models (LLMs), enabling users to identify
familiar faces and recall shared memories.

The application allows users or caregivers to build a digital memory bank by uploading photos, names and
relationship details. When faced with uncertainty, users can upload a photo for identification and receive a
personalized memory summary to reinforce recognition. Designed with accessibility in mind, the application features
a simple user interface and supports remote management by caregivers.

Built on AWS cloud infrastructure, the system ensures scalability and real-time performance by leveraging
services such as Amazon SageMaker for model training and inference, and Amazon S3 for managing a large image
database. The core application is offered free, supported by potential public health sponsorships, with optional
premium features available for advanced capabilities. RemindMe aims to promote connection, independence and an
improved quality of life for dementia patients and their caregivers.

## UI Demo

### Login

<img src="/Demo/login.png" alt="login" width="350" />

### Home Page (remindee list)

<img src="/Demo/remindee_list.png" alt="remindee_list" width="450" />

### Remindee Edit Page

<img src="/Demo/remindee_detail_edit.png" alt="remindee_details" width="450" />

### Identify Page

<img src="/Demo/identify.png" alt="identify" width="450" />

### Train AI Assistant

<img src="/Demo/train.png" alt="train" width="450" />

### Upload Images for the Remindees

<img src="/Demo/upload_images.png" alt="upload_images" width="450" />

### Session Timeout Dialog

<img src="/Demo/session_timeout_dialog.png" alt="session_timeout_dialog" width="450" />

### Unsaved Changes Warning Dialog

<img src="/Demo/prompt_dialog.png" alt="prompt_dialog" width="450" />

## Installation

```
pip install -r requirements.txt
```

<!-- ## Directory Structure
1. [frontend](./frontend)

2. [backend](./backend)

3. [model](./model): contains the training and inference scripts for the face recognition model. -->

## Demo Video

📽️ Watch the demo here: [link](https://drive.google.com/file/d/1xduC3qHTouGTMJ7kzN9ncP8deRuBUSR9/view?usp=sharing)

## Dummy User Account

```
Email: brinashong@gmail.com
Password: RemindMe_2025
```

## Frontend

The frontend uses React + TypeScript + Vite with a combination of basic CSS and Tailwind CSS for styling.

### Local Development and Testing

**Prerequisites:** Ensure that you have Node.JS and NPM installed.

**Start:** Run the commands to start locally.

```sh
npm install
npm run dev
```

The default local development URL is [http://localhost:5173/](http://localhost:5173/).

**Testing Functionalities:**
While the frontend will load, you will require the backend server to be running for the endpoints to work. Depending on whether the endpoints are using localhost as a domain or if it is calling the backend server running on EC2 directly (if it is deployed and used, see the URLs used in `/frontend/src/services` folder), you may need to start the backend server locally (see [backend](./backend) folder).

You will first be required to login. Use the dummy user account provided to login. Upon logging in, you will be free to explore the functionalities locally!

### Folder Structure

As this is a react project, the standard node packages and config files are found in the root `/frontend`. The public assets comprises of static and publicly available images from `/frontend/public`. The main source code is found in `/frontend/src`.

**Source Code (`/frontend/src`):**

- `/assets`: Contains all the CSS files used in this project.
- `/components`: Stores reusable components used in this project.
- `/contexts`: Stores react contexts used in this project.
- `/hooks`: Stores custom react hooks created in this project.
- `/lib`: Stores utils used in this project.
- `/pages`: Stores the pages used in this project. Each page leverages on reusable components and contains the functionalities defined in this project. More details on what functionality each page performed will be explained in the next section.
- `/services`: Stores service logic where the interaction with backend API endpoints are made.

## Backend

### Local Development and Testing

1. Switch current folder to project root folder.
2. Type "python install -r requirements.txt" to intall required packages.
3. Switch current folder to backend
4. Type "python install -r requirements.txt" to intall required packages for backend.
5. **In a new terminal, type "redis-server"**
6. Go to AWS management console, and make the RDS instance `remind-me-instance` running (it is stopped for cost saving in development phase)
7. In a new terminal, type "python app/main.py"

If everything runs correctly, now you could:<br>

- Visit the website at http://localhost:8000<br>
- Visit API documentation at: http://127.0.0.1:8000/docs (_not working now_)

### FastAPI Endpoints:

- Get `/user/login`: the front end informs backend the user login event. This endpoint is used to set Redis expiration state.
- Get `/user/signout`: the front end informs backend the user sign out event. This endpoint is used to update Redis expiration state.
- Get `/user/user-profile`: get current user's information<br>
- Get `/user/profile`: get randomly chosen remindees' information (max. 5 remindees)<br>
- Post `/user/update-profile`: update current user's information, such as nick-name, avatar-image, phone number, etc.<br>
- Post `/operation/upload`: upload one or multiple images related to one remindee<br>
- Post `operation/identify`: trigger inference task
- Post `/operaion/check-inference-status`: check inference task to see if it completed/failed/stopped, etc.
- Post `/operation/get-inference-result`: get inference result from SageMaker job.
- Post `/operation/train`: trigger training task
- Post `/operation/check-train-status`: check training status of the specified SageMaker work

### Folder Structure

- `/mock_data`: The scripts in this folder are used to fill in the initial data of PostgreSQL tables and AWS S3 image bucket.
- `/routers`: The folder contains the API endpoints.
- `/services`: The folder contain the logic and database related operation, configuration, etc.
- `/test`: The folder contains postman query file which could be imported to test endpoints.

## Model

The Facial Recognition model is fine-tuned based on [FaceNet-PyTorch](https://github.com/timesler/facenet-pytorch/tree/master), while the LLM used for summarization is [Meta-Llama-3.1-8B-Instruct-Turbo](https://deepinfra.com/meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo).

### Folder Structure

- `/notebooks`: Contains the Jupyter notebooks used for local training and testing.
- `/scripts`: Contains the Python scripts to be triggered for training and inference.
