const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authentication, isAdmin } = require('../middlewares/authentication');

router.post("/createUser", UserController.createUser )
router.post("/login", UserController.login )
router.delete("/logout",authentication, UserController.logout )

router.get("/getUsers", UserController.getUsers )
router.get('/confirm/:email',UserController.confirm)
router.get("/getUserById/:id", UserController.getUserById )
router.get("/getOneUserByName/:name", UserController.getOneUserByName )
router.delete("/deleteUser/:id", authentication, isAdmin, UserController.deleteUser )
router.put("/updateUser/:id", authentication, UserController.updateUser )
module.exports = router;