import express from "express";
import { home, auth } from "./../controllers/controller";

let router = express.Router();

router.get("/", home.index);

router.get("/login-register", auth.loginRegister);

router.get('/test-database', home.testDatabase);

module.exports = router;