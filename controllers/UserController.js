const { User, Post, Token, Sequelize } = require("../models/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];
const { Op } = Sequelize;
const transporter = require("../config/nodemailer");

const UserController = {
  async createUser(req, res, next) {
    try {
      let password;
      if (req.body.password) {
        password = await bcrypt.hash(req.body.password, 10);
      }
      const user = await User.create({
        ...req.body,
        password: password,
        role: "user",
        confirmed: false,
      });
      const emailToken = jwt.sign({ email: req.body.email }, jwt_secret, {
        expiresIn: "48h",
      });
      const url =
        "http://localhost:3000/users/confirm/"  + emailToken;
      await transporter.sendMail({
        to: req.body.email,
        subject: "Confirme su registro",
        html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
        <a href="${url}"> Click para confirmar tu registro</a> 
        `,
      });

      res.status(201).send({
        message: "Check your inbox and confirm",
        user,
      });
    } catch (error) {
      console.error(error);
      //res.status(500).send({msg:"error creating user", error})
      next(error);
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        return res.status(400).send("incorrect user or password");
      }
      if (!user.confirmed) {
        res.status(400).send({ msg: "Confirma el correo" });
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send("Incorrect user or password");
      }

      const token = jwt.sign({ id: user.id }, jwt_secret);
      Token.create({ token, UserId: user.id });

      res.send({ msg: "Welcome " + user.name, user, token });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async confirm(req, res) {
    try {
      
      const token = req.params.email;
      const payload = jwt.verify(token,jwt_secret);

      await User.update(
        { confirmed: true },
        {
          where: {
            email: payload.email,
          },
        }
      );

      res.status(201).send("Usuario confirmado con éxito");
    } catch (error) {
      console.error(error);
    }
  },

  async logout(req, res) {
    try {
      await Token.destroy({
        where: {
          [Op.and]: [
            { UserId: req.user.id },
            { token: req.headers.authorization },
          ],
        },
      });

      res.send({ message: "Desconectado con éxito" });
    } catch (error) {
      console.log(error);

      res
        .status(500)
        .send({ message: "hubo un problema al tratar de desconectarte" });
    }
  },

  async getUsers(req, res, next) {
    try {
      const user = await User.findAll({
        include: [Post],
      });
      res.status(201).send({
        message: "All your users",
        user,
      });
    } catch (err) {
      next(err);
    }
  },

  async getUserById(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{ model: Post, attributes: ["Title", "content"] }],
      });
      res.send(user);
    } catch (err) {
      next(err);
    }
  },
  async getOneUserByName(req, res) {
    try {
      const user = await User.findOne({
        where: {
          name: req.params.name,
        },
        include: [Post],
      });
      res.send(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ msg: "There was a problem finding it by name", error });
    }
  },
  async deleteUser(req, res) {
    try {
      await User.destroy({
        where: {
          id: req.params.id,
        },
      });
      await Post.destroy({
        where: {
          UserId: req.params.id,
        },
      });
      res.send({ msg: "User and its posts were deleted" });
    } catch (error) {
      console.error(err);
      res.status(500).send({ msg: "problem deleting user and its posts", err });
    }
  },
  async updateUser(req, res) {
    try {
      await User.update(
        { ...req.body },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.send({ msg: "User updated" });
    } catch (error) {
      console.error(err);
      res.status(500).send({ msg: "problem updating user", err });
    }
  },
};

module.exports = UserController;
