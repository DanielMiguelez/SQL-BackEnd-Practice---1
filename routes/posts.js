const express = require('express');
const router = express.Router();

const PostController = require('../controllers/PostController')

router.post("/createPost", PostController.createPost )
router.get("/getPosts", PostController.getPosts )
router.get("/getPostById/:id", PostController.getPostById )
router.get('/getOnePostByName/:title', PostController.getOnePostByName)
router.delete('/deletePost/:id', PostController.deletePost)
router.put('/updatePost/:id', PostController.updatePost)

module.exports = router;