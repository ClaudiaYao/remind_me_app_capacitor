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

# Introduction

This repo is an update from the original repo (https://github.com/ClaudiaYao/remindme_app_newstyle)<br>
The major difference is:

1. Use capacitor to create native ios and android application.
2. Update the introduction page content.
3. Adjust the width of some components to better suit for the width of mobile devices

# Usage

1. Type command "redis-server" to start redis.
2. Switch to backend folder, and type "uvicorn main:app --reload"
3. Switch to frontend folder type "npx cap run ios", and choose one iPhone simulator. Wait for the openning of xcode and test the app in the simulator.

## Reference:

Other info, check the capacitor documentation:<br>
https://capacitorjs.com/docs/getting-started
