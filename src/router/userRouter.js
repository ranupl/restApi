const express = require("express");
const router = express.Router();
const userController = require("../controlller/userController");

router.post("/create", userController.createUser);
router.get("/users", userController.getAllUser);
router.get("/user/:id", userController.getById);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);
router.get("/filter", userController.filterResult);

module.exports = router;
