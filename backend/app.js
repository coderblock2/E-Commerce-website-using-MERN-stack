const express = require('express');
const cors = require('cors');
const app = express();
const errormiddleware = require('./middleware/error');
const cookieparser = require('cookie-parser');
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const dotenv = require('dotenv');


//config

dotenv.config({path:"backend/config/config.env"});

app.use(cors({
    origin: 'http://localhost:3000', // replace with your frontend URL
    credentials: true,
  }));
app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//Routes Imports
const products = require('./routes/productRoutes');
const user = require('./routes/userRoute');
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");


app.use('/api/vi', products);
app.use('/api/v1', user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

//middleware for Errors
app.use(errormiddleware);


module.exports = app;