const express = require("express");
const { createUser, loginUser, getUser, updateUser, getUsers, getBalance, transfer } = require("./controller");
const { authCheck } = require("./auth");

const router = express.Router();
router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/").get(authCheck, getUser);
router.route("/bulk").get(authCheck,getUsers);
router.route("/balance").get(authCheck,getBalance);
router.route("/account/transfer").post(authCheck,transfer)
router.route("/:id").put(authCheck,updateUser);

module.exports = router;
