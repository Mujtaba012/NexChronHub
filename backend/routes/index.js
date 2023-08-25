const express = require("express");
const authController = require("../Controller/authController");
const blogController = require('../Controller/blogController');
const commentController = require('../Controller/commentController')
const auth = require('../middleware/auth');


const router = express.Router();

// Testing Route
// /test -> is the end point of the router
router.get('/test', (req,resp)=>{
    resp.json("Hello World");
})

// User:

// Register:
    router.post('/register', authController.register)

// Login:
    router.post('/login', authController.login)

// Logout:
    router.post('/logout' , auth, authController.logout);

// Refresh:
    router.get('/refresh', authController.refresh);



// ---------------Blog endPoints---------------------------

// Create: 
router.post('/blog', auth, blogController.create);

// Get All Blog
router.get('/get/all', auth , blogController.getAll);

// Get blog by id:
router.get('/blog/:id', auth, blogController.getById);

// Update blog
router.put('/update', auth, blogController.update);

// Delete Blog:
router.delete('/delete/:id', auth, blogController.delete);




// -----------Comment Endpoints-------------

// Create Comment
router.post('/comment',commentController.create);

// GetbyId Comment
router.get('/comment/:id', commentController.getById);




module.exports = router;