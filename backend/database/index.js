const mongoose = require("mongoose");  
// {MONGODB_CONNECTION_STRING} -> Destructure of MONGODB_CONNECTION_STRING because 
// we exports the objects from .env file:

const {MONGODB_CONNECTION_STRING} = require("../config/index")

const dbConnection = async ()=>{
    try {
        const conn = await mongoose.connect(MONGODB_CONNECTION_STRING)
        console.log(`Database is connected to host ${conn.connection.host}`)
    } catch (error) { 
        console.log(`Error: ${error}`)
    }
}

module.exports =dbConnection