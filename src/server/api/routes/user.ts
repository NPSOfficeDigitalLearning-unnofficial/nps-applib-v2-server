import { Router } from "express";
import UserData from "../../../data/user/UserData";
import { ALLOWED_EMAIL_DOMAINS } from "../../../env";
import { formatPassword, validateEmail, validatePasswordFormat } from "../../../util/auth";
import { login } from "../../session";
// import { login } from "../../session";
import { ERROR, errorCatcher, resError } from "../errors";
import requiresAuth from "../requiresAuth";
import { dataRes } from "../resBuilder";

export const userRoute = Router();

/* Return all users.
RESPONSE:
    {id:string, email:string, isEditor:boolean, isAdmin}[] */
userRoute.get("/", requiresAuth("admin"), errorCatcher<never,unknown,unknown,never,{[key:string]:string}>(async (req,res)=>{
    const user = await UserData.getAll();
    const converted = user.map(({id,email,isEditor,isAdmin})=>({id,email,isEditor,isAdmin}));
    res.status(200).json(dataRes(converted));
}));

/* Return a user by id
RESPONSE:
    {id:string, email:string, isEditor:boolean, isAdmin} | undefined */
userRoute.get("/:id", requiresAuth("admin"), errorCatcher<{id:string},unknown,unknown,never,{[key:string]:string}>(async (req,res)=>{
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
    if (!validateEmail(email)) {
        resError(res,ERROR.emailInvalid);
        return;
    }
    if (!validatePasswordFormat(password)) {
        resError(res,ERROR.passwordInvalid);
        return;
    }
    if (!ALLOWED_EMAIL_DOMAINS.includes(email.split("@")[1].toLowerCase())) {
        resError(res,ERROR.emailDomainNotAllowed);
        return;
    }
    const user = await UserData.createUser(email,formatPassword(password));
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
    if (typeof(email ?? "") !== "string" || typeof(isEditor ?? false) !== "boolean") {
        resError(res,ERROR.requestBodyInvalid);
        return;
    }
    // `??undefined` is added to make it so null|undefined gets crushed down to undefined.
    const user = await UserData.patchUser(id,email??undefined,isEditor??undefined);
    res.status(200).json(dataRes({id,email:user.email,isEditor:user.isEditor}));
}));
