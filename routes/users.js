const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController')

router.post("/createUser", UserController.createUser )
router.post("/login", UserController.login )
router.get("/getUsers", UserController.getUsers )
router.get("/getUserById/:id", UserController.getUserById )
router.get("/getOneUserByName/:name", UserController.getOneUserByName )
router.delete("/deleteUser/:id", UserController.deleteUser )
router.put("/updateUser/:id", UserController.updateUser )
module.exports = router;