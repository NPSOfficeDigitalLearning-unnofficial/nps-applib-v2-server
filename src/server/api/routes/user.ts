import { Router } from "express";
import UserData from "../../../data/user/UserData";
import { login } from "../../session";
import { ERROR, errorCatcher, resError } from "../errors";
import requiresAuth from "../requiresAuth";
import { dataRes } from "../resBuilder";

export const userRoute = Router();


/* Return a user by id
RESPONSE:
    {id:string, email:string, canEdit:boolean, isAdmin} | undefined */
userRoute.get("/:id", errorCatcher<{id:string},unknown,unknown,never,{[key:string]:string}>(async (req,res)=>{
    const user = await UserData.getById(req.params.id);
    const { id, email, canEdit, isAdmin } = user ?? {};
    const data = user ? {id,email,canEdit,isAdmin} : undefined;
    res.status(200).json(dataRes(data));
}));


/* Sign up.
BODY:
    {email:string, password:string}
RESPONSE:
    {id:string, email:string, canEdit:boolean} */
userRoute.post("", requiresAuth("loggedOut"), errorCatcher(async (req,res)=>{
    const {email,password} = req.body as {email:string,password:string};
    if (typeof(email)!=="string" || typeof(password)!=="string") {
        resError(res,ERROR.requestBodyInvalid);
        return;
    }
    const user = await UserData.createUser(email,password);
    login(req,user.id);
    const { id, canEdit } = user;
    res.status(200).json(dataRes({id,email,canEdit}));
}));


/* Modify another user.
BODY:
    {email?:string, canEdit?:boolean}
RESPONSE:
    {id:string, email:string, canEdit:boolean} */
userRoute.patch("/:id", requiresAuth("admin"), errorCatcher(async (req,res)=>{
    const { id } = req.params;
    const { email, canEdit } = req.body as {email?:string|null,canEdit?:boolean|null};
    if (typeof(email ?? "")!=="string" || typeof(canEdit ?? false)!=="boolean") {
        resError(res,ERROR.requestBodyInvalid);
        return;
    }
    // `??undefined` is added to make it so null|undefined gets crushed down to undefined.
    const user = await UserData.patchUser(id,email??undefined,canEdit??undefined);
    res.status(200).json(dataRes({id,email:user.email,canEdit:user.canEdit}));
}));
