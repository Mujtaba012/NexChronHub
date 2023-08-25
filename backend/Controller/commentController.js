const Joi = require('joi');
const Comment = require('../models/comment');
const commentDTO = require('../dto/comment')


const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const commentController =  {
    async create(req,res,next) {

        // 1- Validate 
        const createCommentSchema = Joi.object({
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            blog: Joi.string().regex(mongodbIdPattern).required(),
        })

        // 2- Error Check 

        const {error} = createCommentSchema.validate(req.body);
        if(error)
        {
            return next(error);
        }

        // 3- Store in database

        const {content,author,blog} = req.body;
        try {
            const comment = new Comment({
                content: content,
                author: author,
                blog: blog,
            })

            await comment.save();
        } catch (error) {
            return next(error);
        }
        // status(201) -> Means Created
            return res.status(201).json({message: 'comment is created'});

        // 4- Response Send
    },
    async getById (req,res,next) {
        
        // 1- Validate 
        const getCommentById = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required(),
        })

        // 2- Error Check
        const {error} = getCommentById.validate(req.params);
        if(error)
        {
            return next(error);
        }

        // 3- Destructure: 
        const {id} = req.params;

        // 4- Get data from database:

        let comment;
        try {
            comment = await Comment.find({blog:id}).populate('author');
        } catch (error) {
            return next(error);
        }
    // Successful Response Return 


    const commentdto = [];
        for (let i=0; i<comment.length;i++)
        {
            const obj = new commentDTO(comment[i]);
            commentdto.push(obj);
        }


        return res.status(200).json({data: commentdto});



        // Response Send:

    },
}


module.exports = commentController;