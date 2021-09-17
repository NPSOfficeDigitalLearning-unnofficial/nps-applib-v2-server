import { Router } from "express";
import UserData from "../../../data/user/UserData";
import { login } from "../../session";
import { ERROR, errorCatcher, resError } from "../errors";
import requiresAuth from "../requiresAuth";
import { dataRes } from "../resBuilder";

export const userRoute = Router();


/* Return a user by id
RESPONSE:
    {id:string, email:string, isEditor:boolean, isAdmin} | undefined */
userRoute.get("/:id", errorCatcher<{id:string},unknown,unknown,never,{[key:string]:string}>(async (req,res)=>{
    const user = await UserData.getById(req.params.id);
    const { id, email, isEditor, isAdmin } = user ?? {};
    const data = user ? {id,email,isEditor,isAdmin} : undefined;
    res.status(200).json(dataRes(data));
}));


/* Sign up.
BODY:
    {email:string, password:string}
RESPONSE:
    {id:string, email:string, isEditor:boolean, isAdmin:boolean} */
userRoute.post("", requiresAuth("loggedOut"), errorCatcher(async (req,res)=>{
    const {email,password} = req.body as {email:string,password:string};
    if (typeof(email)!=="string" || typeof(password)!=="string") {
        resError(res,ERROR.requestBodyInvalid);
        return;
    }
    const user = await UserData.createUser(email,password);
    login(req,user.id);
    const { id, isEditor, isAdmin } = user;
    res.status(200).json(dataRes({id,email,isEditor, isAdmin}));
}));


/* Modify another user.
BODY:
    {email?:string, isEditor?:boolean}
RESPONSE:
    {id:string, email:string, isEditor:boolean} */
userRoute.patch("/:id", requiresAuth("admin"), errorCatcher(async (req,res)=>{
    const { id } = req.params;
    const { email, isEditor } = req.body as {email?:string|null,isEditor?:boolean|null};
    if (typeof(email ?? "")!=="string" || typeof(isEditor ?? false)!=="boolean") {
        resError(res,ERROR.requestBodyInvalid);
        return;
    }
    // `??undefined` is added to make it so null|undefined gets crushed down to undefined.
    const user = await UserData.patchUser(id,email??undefined,isEditor??undefined);
    res.status(200).json(dataRes({id,email:user.email,isEditor:user.isEditor}));
}));
