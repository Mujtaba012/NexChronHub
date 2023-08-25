// Server.js

const { JsonWebTokenError } = require("jsonwebtoken");

// const express = require('express');
// const { PORT, MONGODB_CONNECTION_STRING } = require('./config');
// const dbConnection = require('./database/index');
// const router = require('./routes/index')
// const app = express();
// dbConnection();

// app.use(express.json());
// app.use(router);
// app.listen(PORT, console.log(`Server is running on the port ${PORT}`));





// env: 
// PORT = 5000 ;
// MONGODB_CONNECTION_STRING = sdfksdjfldjf;




// config > index.js

// const dotenv = require('dotenv').config();
// const PORT = process.env.PORT;
// const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
// module.exports = {
//     PORT,
//     MONGODB_CONNECTION_STRING,
// }



// database > index.js

// const mongoose = require('mongoose');
// const {MONGODB_CONNECTION_STRING} = require('./config/index');
// const dbConnection = async ()=>{
//     try {
//         const conn = await mongoose.connect(MONGODB_CONNECTION_STRING)
//         console.log(`Server is host at ${conn.connection.host}`)
//     } catch (error) {
//         console.log(`${error} error occur`);
//     }
// }
// module.exports = dbConnection;





// dto > user.js

// class UserDTO {
//     constructor(user)
//     {
//         this._id = user._id;
//         this.username = user.username;
//         this.email = user.email;
//     }
// }
// module.exports = UserDTO;





// Model > User.js:

// const mongoose = require('mongoose');

// const {Schema} = mongoose;

// const userSchema = new Schema({
//     name:{type: String, require:true},
//     username: {type: String, require: true},
//     email:{type: String, require: true},
//     password: {type:String, require: true},
//     blog: {type: mongoose.SchemaTypes.ObjectId , ref:'users'}
// },
//     {timestamps: true}
// )

// module.exports = mongoose.model('User', userSchema,'users')



// Routes > index.js

// const express = require('express');
// const authController = require('./Controller/authController')
// const auth = require('./middleware/auth')
// const router = express.Router();


// router.get('/register', auth, authController.register);
// module.exports = router;





// Services > JWTService.js : 

// const jwt = require(JsonWebTokenError)
// const RefreshToken = require('./models/token')
// const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('./config/index')
// class JWTService{


// // 1- Method to Sign Access Token
//     static signAcessToken(payload, expiryTime)
//     {
//         return jwt.sign(payload,ACCESS_TOKEN_SECRET, {expiryIn:expiryTime});
//     }

// // 2- Method to sign Refresh Token
//     static signRefreshToken(payload, expiryTime)
//     {
//         return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiryIn:expiryTime})
//     }

// // 3- Verify Access Token 
//     static verifyAccessToken(token)
//     {
//         return jwt.verify(token,ACCESS_TOKEN_SECRET);
//     }
// // 4- Verify Refresh Token
//     static verifyRefreshToken(token)
//     {
//         return jwt.verify(token,REFRESH_TOKEN_SECRET)
//     }

// // 5- Store Refresh Token in db 
//     async storeRefreshToken(token,userId)
// {
//     try {
//         const refreshToken = new RefreshToken({
//             token : token,
//             id: userId
//         })
//        await  refreshToken.save();
//     } catch (error) {
//         return next(error)
//     }
// }
// }
// module.exports = JWTService;



