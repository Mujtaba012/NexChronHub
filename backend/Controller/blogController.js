const Joi = require('joi')
const fs = require('fs');
const Blog = require('../models/blog');
const { BACKEND_SERVER_PATH } = require('../config');
const blogDTO = require('../dto/blog');
const blogDetailDTO = require('../dto/blog-details');
const Comment = require('../models/comment');
// const { join } = require('path');
// const blog = require('../models/blog')'
// const { title } = require('process');
// const blog = require('../models/blog');

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;
const blogController = {

    async create(req,res,next) {

        // 1- Validate User Input
        const blogCreateSchema = Joi.object({
            title: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            content: Joi.string().required(),
            photo: Joi.string().required(),
    
        })

        // Error Checking:
        const {error} = blogCreateSchema.validate(req.body);
        if(error)
        {
            return next(error);
        }

        // 2- Handle Photo Storage , naming

        // ------- Handle picture ----------

        const {title, author, content, photo } = req.body
        // 1- Read as buffer 
        // Buffer is used to handle binary stream data
        const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/,''), 'base64')

        // 2- Alot a Random name
        const imagePath = `${Date.now()}-${author}.png`

        // 3- Save locally

        try {
                fs.writeFileSync(`storage/${imagePath}`, buffer)
        } catch (error) {
            return next(error)
        }

        // Client Side -> base64 encoded string -> decode -> Store -> save photo's path in db 

        // 3- add to db

        let newBlog;

        try {

            newBlog = new Blog({
                title: title,
                author: author ,
                content: content , 
                photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`
            })

            await newBlog.save();

        } catch (error) {
            return next(error)
        }

        // 4- Return Response
        const blogdto = new blogDTO(newBlog);
        return res.status(201).json({blog:blogdto})

    },

    async getAll(req,res,next) {
        try {
            const blogs = await Blog.find({});

            const blogsDTO = [];

            for(let i=0 ;i<blogs.length;i++)
            {
                const dto = new blogDTO(blogs[i]);
                blogsDTO.push(dto);
            }

            return res.status(200).json({blogs:blogsDTO})


        } catch (error) {
            return next(error);
        }
    },

    async getById(req,res,next) {
        // 1- Validate ID

        const blogByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        })

        const {error} = blogByIdSchema.validate(req.params)
        if(error)
        {
            return next(error);
        }

        const {id} = req.params;
        let blog
        try {

            blog = await Blog.findOne({_id:id}).populate('author')

        } catch (error) {
            return next(error);
        }

        const dto = new blogDetailDTO(blog);   
        // Response Send
        return res.status(200).json({blog :dto })
    },

    async update(req,res,next) {

        // 1- Validate: 
        const updateBlogSchema = Joi.object({
            title  : Joi.string(),
            content:Joi.string(),
            author : Joi.string().regex(mongodbIdPattern).required(),
            blogId : Joi.string().regex(mongodbIdPattern).required(),
            photo  : Joi.string()
        })

        // Check Error
        const {error} = updateBlogSchema.validate(req.body);
        if(error)
        {
            return next(error)
        }
        // 2- If their is need to update only picture we only update picture
        // if their is need to update title etc only we only update it not picture
        const {title, content, author, blogId, photo} = req.body;

        // delete previous photo
        // then save new photo

        let blog;
        try {
            blog = await Blog.findOne({_id:blogId})

        } catch (error) {
            return next(error)
        }

        if(photo)
        {
            let previousPhoto = blog.photoPath;
            previousPhoto = previousPhoto.split('/').at(-1)
        

        // delete photo
        fs.unlinkSync(`storage/${previousPhoto}`);


        // ------Save new photo--------

        // 1- Read as buffer 
        // Buffer is used to handle binary stream data
        const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/,''), 'base64')

        // 2- Alot a Random name
        const imagePath = `${Date.now()}-${author}.png`

        // 3- Save locally

        try {
                fs.writeFileSync(`storage/${imagePath}`, buffer)
        } catch (error) {
            return next(error)
        }

        await Blog.updateOne({_id:blogId}, {title,content, photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`});
    }
    else {
        await Blog.updateOne({_id:blogId},{title,content});
    }
        return res.status(200).json({message:'blog updated'})
    },

    async delete(req,res,next) {

        // 1- Validate Blog Data: 
        const deleteblogSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required(),
        })

        const {error} = deleteblogSchema.validate(req.params);
        if(error)
        {
            return next(error);
        }

        const {id} = req.params;

        try {
            // let blog;
            // 2- Delete Blog
    
             await Blog.deleteOne({_id:id});
    
            // 3- Delete Comments
    
            await Comment.deleteMany({blog:id})
    
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({message:'Blog Deleted Successfully'})



    },

}

module.exports = blogController;