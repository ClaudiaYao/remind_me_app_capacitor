import React from "react";

const About: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the About Page</h1>
      <div>
        Pain Point: The people having dementia often could not recognize their
        family members, friends, etc. Functionality: Create an app(could be
        web/mobile). When the user takes a picture of a person, and clicks the
        button “Remind Me!”, the app could remind him/her the stored information
        of the person. (for example: your daughter. She is living with you and
        taking care of you. Her name is …) When a user takes a picture of a
        person, and then clicks the button “Input info”, he/she could input the
        information related to the photo with text/audio. The text/audio will be
        recorded in the backend of the app. When later the user clicks “Remind
        Me!”, the person’s information will display. Pros: We could keep the
        front end very concise to improve usability. Utilize chatGPT API or
        other image recognition models to identify the person’s face and
        retrieve the information to the front end. Unique idea, without needing
        to use the current public data. Cons: More efforts on back end (user
        authentication, database, models, etc, API designs) Need to enhance
        safety measures since user’s info is put on cloud.
      </div>
    </div>
  );
};

export default About;
