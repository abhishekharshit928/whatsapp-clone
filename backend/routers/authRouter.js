import express from "express"
import { login, logout, RefreshToken,  signup } from "../controllers/authController.js";
import { loginValidtor, signupValidator } from "../validator/Validator.js";
import { validate  } from "../middlewares/validate.js";
import protect from "../middlewares/protect.js";
const authRouter = express.Router();

authRouter.post("/signup",signupValidator ,validate,signup)
authRouter.post("/login",loginValidtor,validate,login)
authRouter.post("/logout", protect ,logout)
authRouter.post("/refresh",RefreshToken)

export default authRouter;