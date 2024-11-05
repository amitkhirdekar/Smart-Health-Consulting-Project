# Smart Health Consulting Project

This is a web based application which helps in scheduling appointments, rescheduling appointments, cancel appointments and consulting doctors online by chat or video call. NodeJS was used as backend language and mongoDB as database. HTML, CSS, JS along with tailwindCSS framework was used in UI.

## Screenshots
Currently unavailable. Coming Soon...

## Database Setup

This app uses mongoDB database and you will need a database ready in order to run this app. 
One way is to create a free account on mongoDB Atlas followed by creating M0 cluster for this app.

Follow process to create cluster in Atlas. When prompted which creating a user, use `smart-health` username and copy the password. Once the cluster is up and running, create collection `Smart_Health` in the cluster.

Replace the `<dbPassword>` text in [config/keys.js](/config/keys.js) with the password copied earlier(if password contains @, replace it with %40).

## Installation

This app runs on web. 

First clone this repo in your system. Use [Git Bash]() to run following command. 

```git bash
git clone https://github.com/amitkhirdekar/Smart-Health-Consulting-Project.git 
```

Open Project folder in any Code Editer (preferrably VS Code). In command prompt of VS Code run following command (make sure you have [NodeJS](https://nodejs.org/en/download/) installed):

```git bash
npm install all
```

Now you have all packages required for app to run. Run the project using following node command:

```git bash
node app.js
```

Now app is running on port 5000 on localhost. Open Browser and use URL:

```bash
http://localhost:5000/
```

## Usage

At first, register yourself using "Register" button. Then, Log in with your credentials.
For patients, UI will be similar to this:

<img src="https://github.com/amitkhirdekar/Smart-Health-Consulting-Project/blob/main/Screenshots/patientDashboard.png?raw=true" width="90%" alt="Patient UI"> </img>

Now you are free to search Doctors, Book Appointments, Reschedule Appointments, Cancel Appointments, Update Medical Records, Consult with doctor and many more things. 

You should create an admin user in DB first that can in-turn add doctors to the application.

## Support
For any other help, you can contact:

Amit Khirdekar : amitkhirdekar.business@gmail.com

## Contributing
Currently, Pull requests are not welcome. You will be updated when they will be available.

## Authors and acknowledgment
Authors also include:

[Luis Cherian](https://github.com/luischerian)

[Chirag Kriplani](https://github.com/chirag-10)

[Ashish Kulkarni](https://github.com/Ashish-A-Kulkarni)

## License
[Smart Health Consulting Team](https://github.com/amitkhirdekar)
