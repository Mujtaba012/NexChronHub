const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/token')
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('../config/index')

// const ACCESS_TOKEN_SECRET = "bfa6346d239b348c73c3f4471c92f3cda6c4e84e53938286568caeb991d9d5f8433ac6177ef5d3a447a90971abc3012ecf3523ce8a843562bf280a5f7d79696b";

// const REFRESH_TOKEN_SECRET = "dde9447d6efa78fb82805f2bdf75675db8dfd740c70dae8e41f9ec6653666058622dd5191b60d91a40c87afae5849c98fcdc5f2aa264468b43f8595c9a68b72f";

class JWTService{

// 1-  Method to sign access token

// we can make the method static so that when we import then we cannot make the object for it.

    static signAccessToken(payload, expiryTime)
    {
        return jwt.sign(payload,ACCESS_TOKEN_SECRET, {expiresIn:expiryTime})
    }


// 2- Method to sign refresh token:
    static signRefreshToken(payload, expiryTime)
    {
        return jwt.sign(payload,REFRESH_TOKEN_SECRET, {expiresIn:expiryTime})
    }


// 3- Verify access token
    static verifyAccessToken(token)
    {
        return jwt.verify(token,ACCESS_TOKEN_SECRET);
    }

// 4- Verify refresh token
    static verifyRefreshToken(token)
    {
        return jwt.verify(token,REFRESH_TOKEN_SECRET)
    }

// 5- Store Refresh Token
    static async storeRefreshToken(token,userId)
    {
        try {
            const newToken = new RefreshToken({
                token: token,
                userId:userId
            })
        
        // Store in Database
            await newToken.save()

        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = JWTService;
