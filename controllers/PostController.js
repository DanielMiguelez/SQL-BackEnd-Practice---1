const { Post, User, sequelize } = require("../models/index");

const PostController = {
  async createPost(req, res, next) {
    try {
      const post = await Post.create({
        ...req.body, UserId:req.user.id
      });

      res.status(201).send({
        message: "You created a post",
        post,
      });
    } catch (err) {
      next(err);
    }
  },
  async getPosts(req, res, next) {
    try {
      const post = await Post.findAll({
        include: [{ model: User, attributes: ["name"] }],
      });
      res.status(201).send({
        message: "All posts, with the owner",
        post,
      });
    } catch (err) {
      next(err);
    }
  },
  async getPostById(req, res, next) {
    try {
      const post = await Post.findByPk(req.params.id, {
        include: [{ model: User, attributes: ["name"] }],
      });
      res.send(post);
    } catch (err) {
      next(err);
    }
  },
  async getOnePostByName(req, res) {
    try {
      const post = await Post.findOne({
        where: {
            title: req.params.title,
          },
        include:[User]
      });
      res.send(post)
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({msg:"There was a problem", error})
    }
  },

  async deletePost(req,res){
    try {
      const post = await Post.destroy({
        where: {
          id: req.params.id
          },
      });
      res.send({ msg: "Post deleted" });
    } catch (error) {
      console.error(err);
      res.status(500).send({ msg: "problem deleting user", err });
    }
  },
 
  async updatePost(req, res) {
    try {
      const post = await Post.update(
        { title:req.body.title, content:req.body.content },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.send({msg:"Post updated", post})
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "problem updating post", error });
    }
  },
};

module.exports = PostController;
