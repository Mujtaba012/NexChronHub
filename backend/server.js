const express = require('express');
const dbConnection = require("./database/index");
const {PORT} = require('./config/index');
const router = require("./routes/index");
const errorHander = require("./middleware/errorHandler");
const cookieParser = require('cookie-parser')
const app = express();
dbConnection()

// Allow application to communicate application in json format
// and can send data in json format and can accept data in json format



// To Host / Access our Images on browser
app.use('/storage', express.static('storage'))
app.use(cookieParser())
app.use(express.json())
app.use(router);

// we register error handler in the last bcz middleware run sequentionaly 
// and we do error handling request in the last     
app.use(errorHander);
app.listen(PORT, console.log(`Server is running on the port ${PORT}`));  