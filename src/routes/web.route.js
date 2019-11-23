import express from "express";
import { home, auth } from "./../controllers/controller";
import { authValid } from "../validation/validation";
let router = express.Router();

router.get("/", home.index);

router.get("/login-register", auth.loginRegister);

router.get('/test-database', home.testDatabase);

router.post('/register', authValid.register, auth.postRegister);

module.exports = router;