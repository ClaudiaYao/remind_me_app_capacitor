# Frontend
The frontend uses React + TypeScript + Vite with a combination of basic CSS and Tailwind CSS for styling.
## Local Development and Testing

### Prerequisites
Ensure that you have Node.JS and NPM installed.
### Start
Run the commands to start the locally. 
```sh
npm install
npm run dev
```
The default local development URL is http://localhost:5173/.
### Testing Functionalities
While the frontend will load, you will require the backend server to be running for the endpoints to work. Depending on whether the endpoints are using localhost as a domain or if it is calling the backend server running on EC2 directly (if it is deployed and used, see the URLs used in `/frontend/src/services` folder), you may need to start the backend server locally (see [backend](./backend) folder).

You will first be required to login. Use the dummy user account provided to login. Upon logging in, you will be free to explore the functionalities locally!

## Folder Structure
As this is a react project, the standard node packages and config files are found in the root `/frontend`. The public assets comprises of static and publicly available images from `/frontend/public`. The main source code is found in `/frontend/src`.

### Source Code (`/frontend/src`)
#### `/assets`
Contains all the CSS files used in this project.

#### `/components`
Stores reusable components used in this project.

#### `/contexts`
Stores react contexts used in this project.

#### `/hooks`
Stores custom react hooks created in this project.

#### `/lib`
Stores utils used in this project

#### `/pages`
Stores the pages used in this project. Each page leverages on reusable components and contains the functionalities defined in this project. More details on what functionality each page performed will be explained in the next section.

#### `/services`
Stores service logic where the interaction with backend API endpoints are made.

## Functionalities

### User Authentication
Users must login in order to use this webapp. The user authentication feature in this project is fully functional. For first time users, they may register, which would require email verification (an OTP will be sent to the registered email) before logging in. User authentication leverages AWS Cognito. Subsequent calls to the backend will require the access token provided from authenticating with Cognito.

### My Connections (Home Page)
This is the main landing page when users log in. It shows a welcome message with a list of people the users know. These people are profiles that users have specifically uploaded. They are connections/ties/friends/family members that the user wants to be reminded. Each profile consists of the name of the person, the picture of a person, a generated summary of the person based on all the pictures and descriptions uploaded by the person. There is also a show more button that expands to show more information about the person if the user filled it in when uploading.

For a newly registered user, this page will not be populated with profiles and instead, users will be prompted to 1) Update their personal profile (My Profile) and 2) Upload images of their connections. This landing page will only be populated after step 2.

### Identify
This page allows a user to upload an image of a person they wish to identify. This is the main functionality of this project, where a user may have forgotten who this particular person is. The user may snap a photo and drop the image into this page. Once the user clicks on identify, the backend will perform the heavylifting and perform an inference call to the facial recognition model, returning the result (details about the person and the image).

For a newly registered user, users will be prompted to 1) Update their personal profile (My Profile) and 2) Upload images of their connections. This landing page will only be populated after step 2.

### Upload
This page allows a user to upload multiple images and multiple people they wish to keep reminded of in future. On clicking the Add Person button, user can enter the name of the person, the relationship of the person, and upload multiple images for each person. For each image, they can also write a description about this person and perhaps what they remember from the specific image. Once user clicks upload, these information will be sent to the backend for processing and storage. These descriptions will be used to generate a summary of the person seen in the Home Page mentioned above.

Once a user is done uploading, a Finish Uploading button will appear, where users may click on to complete their upload. This will prompt the backend to start training the facial recognition model in the backend. For new users, the model will be trained on the newly uploaded images. For existing users, retraining will be done based on new uploads and the existing images uploaded previously.

### My Profile
On the right side of the navigation bar, there is a rounded image which you can click on. A dropdown menu will appear with the My Profile option. Users may go to their profile to edit some of their personal details, allowing them to remember their own details in future should they forget. They can even edit their profile picture and their name so that they can see their picture on the navigation bar and their name on the Home page!
