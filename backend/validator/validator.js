import {body} from "express-validator";

export const signupValidator = [

  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters")

];

export const loginValidtor = [

body("userName").trim().notEmpty().withMessage("User Name required"),
body("password").trim().notEmpty().withMessage("password required")


]