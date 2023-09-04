## Jaeung Kim - IS24R - FULL STACK COMPEITITION - REQ95370

## Table of Contents

- [Purpose](#purpose)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)

## Purpose

The objective of this written exercise is to create a Single-Page Application (SPA) that visualizes and manages relationships among people. The application aims to make it easy to add, edit, and delete people and their relationships. The user interface is designed to be intuitive and responsive, catering to a wide array of technical skills.

## Technologies Used

The following technologies were used in building this web application:

- Backend: Node.js, Express.js
- Frontend: React, Tailwind CSS, Headless UI
- Database: MongoDB
- Containerization: Docker

## Installation and Setup

To run this application on your local development machine, follow these steps:

1. Open Terminal and Clone the repository on the directoy of your choice.

```bash
git clone https://github.com/jaeungkim/moti-is24-written-assessment-jaeung_kim.git
```

2. Install Node.js if it is not already installed on your machine. Node.js is required to run this application.

3. Install MongoDB if it is not already installed on your machine. You can refer to https://www.mongodb.com/docs/manual/installation/

4. Install Docker if it is not already installed on your machine. 

## Usage

To run the application, please follow the steps below:

1. Open a terminal and navigate to the project directory.

```bash
cd moti-is24-written-assessment-jaeung_kim
```

## Project

1. Open Terminal and install dependencies. This will install both frontend and backend dependencies

```bash
npm run init
```

2. Run the application. This will run `docker compose up -d`.
`
```bash
npm run up
```

Now, you should be able to see the front end application at http://localhost:3000/
And, you can also see the back end at http://localhost:3030/

## Docker

While docker is initializing at backend process,

It will display the following upon successful docker compose.

It might take couple minutes to fully propagate.

```bash
[nodemon] 2.0.20
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
Listening on port 3030
Successfully connected to MongoDB
Database seeded successfully
```

