import { Router } from "express";
import { ERROR, resError } from "../errors";
import requiresAuth from "../requiresAuth";

export const appRoute = Router();

// Get all apps.
appRoute.get("", (req,res)=>{
    // TODO
    resError(res,ERROR.notImplemented);
});

// Get an app by id.
appRoute.get("/:id", (req,res)=>{
    // TODO
    resError(res,ERROR.notImplemented);
});

// Add a new app. (Requires authentication)
appRoute.post("", requiresAuth("edit"), (req,res)=>{
    // TODO
    resError(res,ERROR.notImplemented);
});

// Delete an app by id. (Requires authentication)
appRoute.delete("/:id", requiresAuth("edit"), (req,res)=>{
    // TODO
    resError(res,ERROR.notImplemented);
});
