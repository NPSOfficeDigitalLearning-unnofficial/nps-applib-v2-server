import { Router } from "express";
import { ERROR, resError } from "../errors";
import requiresAuth from "../requiresAuth";

export const userRoute = Router();

// Get the currently logged in admin
userRoute.get("", (req,res)=>{
    // TODO
    resError(res,ERROR.notImplemented);
});

// Sign up.
userRoute.post("", (req,res)=>{
    // TODO
    resError(res,ERROR.notImplemented);
});

// Sign up.
userRoute.post("/:id/grantEditor", requiresAuth("admin"), (req,res)=>{
    // TODO
    resError(res,ERROR.notImplemented);
});
