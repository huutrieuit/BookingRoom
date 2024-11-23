# BookingRoom
# Getting Started with Create React App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Create DB postgresql
config connection 
models\index.js
const sequelize = new Sequelize('postgres://<user>:<password>@localhost:5432/<database name>');

### reate room
INSERT INTO public."Rooms" (
name, "createdAt", "updatedAt") VALUES (
'Room 14'::character varying, '2024-11-16 13:48:03.3+07'::timestamp with time zone, '2024-11-16 13:48:03.3+07'::timestamp with time zone)
 returning id;

INSERT INTO public."Rooms" (
name, "createdAt", "updatedAt") VALUES (
'Room 15'::character varying, '2024-11-16 13:48:03.3+07'::timestamp with time zone, '2024-11-16 13:48:03.3+07'::timestamp with time zone)
 returning id;

### `node server.js`

Start server API
port: 3001