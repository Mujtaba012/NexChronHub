const Joi = require("joi")
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const UserDTO = require("../dto/user")
const JWTService = require('../services/JWTService')
const RefreshToken = require('../models/token')


const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const authController = {
    async register(req,res,next) {
        // 1. Validate user input:
        const userRegisterSchema = Joi.object({
            name: Joi.string().max(30).required(),
            username: Joi.string().min(5).max(30).required(),
            email: Joi.string().email().required(), 
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password'),
        })
        

        // 2. If error occur in the validation return through Middleware
        const {error} = userRegisterSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        // 3. If email or username already exit -> return error:    

        const {name, username,email,password} = req.body;
        try {
            
            const emailInUse = await User.exists({email})
            const usernameInUse  = await User.exists({username})

            if(emailInUse)
            {
                const error = {
                    // Conflict error, data already present in database
                    status: 409,
                    message: "Email is already registered",
                }
                return next(error)
            }
            if(usernameInUse)
            {
                const error = {
                    // Conflict error, data already available/present in database
                    status: 409,    
                    message: "Username is not available, choose another username",
                }
                return next(error)
            }

        } catch (error) {
            return next(error)
        }

        // 4. Password hash 
        // Hashing means if Password = 232453d => dfsgl4t#@%###Dds5

        const HashedPassword = await bcrypt.hash(password,10)

        // 5. Store user data in db

        let user;
        let accessToken;
        let refreshToken;

        try {
            const UserToRegister = new User({
                // if the name of key and value is same then we 
                // can use only username instead of username:username
                name:name,
                username: username,
                email: email,
                password:HashedPassword,
    
            })
            user =  await UserToRegister.save();

            accessToken = JWTService.signAccessToken({_id:user._id}, '30m');
            refreshToken= JWTService.signRefreshToken({_id:user._id},'60m');


        } catch (error) {
            return next(error)
        }

        // Store Refresh Token in db
        await JWTService.storeRefreshToken(refreshToken,user._id)


        // Sending token in cookies

        // httpOnly means on client side browser will not access token it is only access at the server side
        // httpOnly also decrease the vulnerability of XSS Attacts
        res.cookie('accessToken',accessToken , {MaxAge: 1000*60*60*24, httpOnly: true})

        res.cookie('refreshToken',refreshToken, {MaxAge: 1000*60*60*24 , httpOnly: true})

        // 6. Response Send

        // status(201) is used when we create resource
        // return res.status(201).json({user:user}) 
        //Both are same
        // return res.status(201).json({user}) 

        const userRegisterDTO = new UserDTO(user)
        return res.status(201).json({user:userRegisterDTO, auth:true})
    },

    async login(req,res,next) {

        // 1- Validation User Input

        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattern).required(),
        })

        // 2- If Validation error occur, return error
        const {error} = userLoginSchema.validate(req.body)

        if(error)
        {
            return next(error);
        }
        //3- Match Username and Password
        const {username, password} = req.body;
        //const {username, password} = req.body; it is same as 
        //const username = req.body.username;
        let user
        try {
            // match username:
            user = await User.findOne({username:username})
            if(!user)
            {
                const error= {
                status :  401,
                message : "Username is not found"
            }
                // Unautherized Access OR User data not found
                return next(error)
            }

            // Match Password:
            const match = await bcrypt.compare(password, user.password)
            if(!match)
            {
                const error= {
                status : 401,
                message: "Password is invalid"
            }
                return next(error);
            }




        } catch (error) {
            return next(error)
        }

        const accessToken = JWTService.signAccessToken({_id:user._id},'30m');
        const refreshToken= JWTService.signRefreshToken({_id:user._id},'60m');

        // Update Refresh Tokden in the database:

        try {
             await RefreshToken.updateOne(
            {
                _id: user._id
            },
            {
                token: refreshToken
            },
            // upsert means if he found a matching record then it will update it
            // if he did not found the matching record then he will insert new record
            {

                upsert:true
            }

            )

        } catch (error) {
            return next(error)
        }


        // Send Token to Cookies
        res.cookie('accessToken', accessToken,{maxAge: 100*60*60*24, httpOnly:true})

        res.cookie('refreshToken', refreshToken, {maxAge:1000*60*60*24, httpOnly: true})



        // Status(200) means record found

        // 4- Response Send     

        const userDTO = new UserDTO(user)
        return res.status(200).json({user:userDTO, auth:true})

    },

    async logout(req,res,next) {
        // 1- Delete Refresh Token from database:

        const {refreshToken} = req.cookies;
        try {
            await RefreshToken.deleteOne({token:  refreshToken});

        } catch (error) {
            return next(error)
        }

        // 2- Delete token from Cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        // 3- Response send
        res.status(200).json({user:null, auth: false})

    },

    async refresh(req,res,next) {
        // 1- Get Token from the Cookie
        const orignalRefreshToken = req.cookies.refreshToken;

        // 2- Verify the Token 

        let id;
        try {
            id  = JWTService.verifyRefreshToken(orignalRefreshToken)._id; 
        } catch (e) {
            const error = {
                status: 401,
                message: 'Unautherized'
            }
            return next(error); 
        }

        try {
            const match = RefreshToken.findOne({_id: id, token: orignalRefreshToken})

            if(!match)
            {
                const error = {
                    // Unautherized:
                    status: 401,
                    message: 'Unautherized',
                }
                return next(error); 
            }
            
        } catch (e) {
            return next(e);
        }

       
        
        try {
             // 3- Genernate new Token
            const accessToken = JWTService.signAccessToken({_id:id}, '30m');
            const refreshToken= JWTService.signRefreshToken({_id:id},'60m');

            // 4- update New Token in db
            await RefreshToken.updateOne({_id:id}, {token: refreshToken})

            
            res.cookie('accessToken',  accessToken,  {maxAge: 1000*60*60*24, httpOnly: true});
            res.cookie('refreshToken', refreshToken, {maxAge: 1000*60*60*24, httpOnly: true});

        } catch (e) {
            return next(e)
        }
        

        // 5- Response Send
        const user = await User.findOne({_id:id})
        const userdto = new UserDTO(user);
        // status(200) -> Ok Response
        return  res.status(200).json({user: userdto, auth: true});
    },
}


module.exports = authController;