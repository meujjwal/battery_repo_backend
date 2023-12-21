import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import router from "./routes/batteries";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT= 80;
const {DEV_MONGO_URL,PROD_MONGO_URL,NODE_ENV}=  process.env;

app.use(cors());
console.log("NODE_ENV",NODE_ENV);
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

app.use('/', router);

// MongoDB Connection
// mongoose.connect('mongodb+srv://ujjwalpaudel22:LXHTXZRdrFj8q0UI@battery.ykej5ij.mongodb.net/?retryWrites=true&w=majority').then(() => {
mongoose.connect(NODE_ENV==="development"?DEV_MONGO_URL!:PROD_MONGO_URL!).then(() => {
    console.log('Database connected');
})
    .catch((err) => {
        console.log(err);
    });;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
