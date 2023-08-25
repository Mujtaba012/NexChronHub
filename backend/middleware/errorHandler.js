const {ValidationError} = require("joi")


const errorHandler = (error, req,res,next) =>{
    //A 500 internal server error is, as the name implies, a general problem with the website's server.
    // More than likely, this means there's an issue or temporary glitch with the website's programming.
    let status = 500;
    let data = {
        message : "Internal Server Error"
    }

    if(error instanceof ValidationError)
    {
        // (HTTP) 401 Unauthorized response status code indicates that the client request 
        // has not been completed because it lacks valid authentication credentials for the 
        // requested resource.
        status = 401;
        data.message = error.message;

        return res.status(status).json(data)
    }

    if (error.status)
    {
        status = error.status  
    }
    if (error.message)
    {
        data.message = error.message
    }

    return res.status(status).json(data);

}





module.exports = errorHandler;