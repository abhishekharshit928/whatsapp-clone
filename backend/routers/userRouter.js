import {fetchUser , fetchAllUser , fetchOnlineUser} from "../controllers/userController.js";
import express from "express";
import protect from "../middlewares/protect.js";
const userRouter = express.Router();

userRouter.get("/fetchuser" , protect , fetchUser);
userRouter.get("/fetchalluser" , protect , fetchAllUser);
userRouter.get("/online" , protect , fetchOnlineUser);

export default userRouter;