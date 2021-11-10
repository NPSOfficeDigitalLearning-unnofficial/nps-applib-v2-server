import { Router } from "express";
import { resEmail } from "../../emailverify/emailVerifier";
import { ERROR, resError } from "../errors";

export const verifyRoute = Router();

// Resolver for email verification.
verifyRoute.post("/:key",(req,res)=>{
    const success = resEmail(req.params["key"],req,res);
    if (!success) {
        // If the handling was not successful, (success is not handled here
        // as the callback should resolve the http request in that case).

        resError(res,ERROR.invalidEmailVerify);
    }
});