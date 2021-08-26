import { Router } from "express";
import UserData from "../../../data/user/UserData";
import { getUser, login } from "../../session";
import { ERROR, resError, resErrorObj } from "../errors";
import requiresAuth from "../requiresAuth";
import { dataRes } from "../resBuilder";

export const userRoute = Router();

/* Return the current user
RESPONSE:
    {id:string, email:string, canEdit:boolean} | undefined */
userRoute.get("", (req,res)=>{
    const user = getUser(req);
    const { id, email, canEdit } = user ?? {};
    const data = user ? {id,email,canEdit} : undefined;
    res.status(200).json(dataRes(data));
});

/* Sign up.
BODY:
    {email:string, password:string}
RESPONSE:
    {id:string, email:string, canEdit:boolean} */
userRoute.post("", requiresAuth("loggedOut"), async (req,res)=>{
    const {email,password} = req.body as {email:string,password:string};
    if (typeof(email)!=="string" || typeof(password)!=="string") {
        resError(res,ERROR.requestBodyInvalid);
        return;
    }
    try {
        const user = await UserData.createUser(email,password);
        login(req,user.id);
        const { id, canEdit } = user;
        res.status(200).json(dataRes({id,email,canEdit}));
    } catch (e) {
        if (e instanceof Error)
            resErrorObj(res,e);
        else resErrorObj(res,new Error(e));
    }
});

/* Modify another user.
BODY:
    {email?:string, canEdit?:boolean}
RESPONSE:
    {id:string, email:string, canEdit:boolean} */
userRoute.patch("/:id", requiresAuth("admin"), async (req,res)=>{
    const { id } = req.params;
    const { email, canEdit } = req.body as {email?:string|null,canEdit?:boolean|null};
    if (typeof(email ?? "")!=="string" || typeof(canEdit ?? false)!=="boolean") {
        resError(res,ERROR.requestBodyInvalid);
        return;
    }
    try { // `??undefined` is added to make it so null|undefined gets crushed down to undefined.
        const user = await UserData.patchUser(id,email??undefined,canEdit??undefined);
        res.status(200).json(dataRes({id,email:user.email,canEdit:user.canEdit}));
    } catch (e) {
        if (e instanceof Error)
            resErrorObj(res,e);
        else resErrorObj(res,new Error(e));
    }
    resError(res,ERROR.notImplemented);
});
