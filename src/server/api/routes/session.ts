import { Router } from "express";
import UserData from "../../../data/user/UserData";
import { getUser, login, logout } from "../../session";
import { ERROR, errorCatcher, resError } from "../errors";
import requiresAuth from "../requiresAuth";
import { dataRes, succesRes } from "../resBuilder";

export const sessionRoute = Router();

/* Return the current user session
RESPONSE:
    {loggedIn:true, id:string, email:string, isEditor:boolean, isAdmin:boolean} | {loggedIn:false} */
sessionRoute.get("", errorCatcher<never,unknown,unknown,never,{[key:string]:string}>((req,res)=>{
    const user = getUser(req);
    const { id, email, isEditor, isAdmin } = user ?? {};
    const data = user ? {id,email,isEditor,isAdmin,loggedIn:true} : {loggedIn:false};
    res.status(200).json(dataRes(data));
}));

/* Log in.
BODY:
    {email:string, password:string}
RESPONSE:
    {id:string, email:string, isEditor:boolean, isAdmin:boolean} */
sessionRoute.post("", requiresAuth("loggedOut"), errorCatcher(async (req,res)=>{
    const {email,password} = req.body as {email:string,password:string};
    if (typeof(email)!=="string" || typeof(password)!=="string") {
        resError(res,ERROR.requestBodyInvalid);
        return;
    }
    const user = await UserData.getByEmail(email);
    if (user === undefined || !(await user.checkPassword(password)))
        resError(res,ERROR.wrongCredentials);
    else {
        login(req,user.id);
        const { id, isEditor, isAdmin } = user;
        res.status(200).json(dataRes({id,email,isEditor,isAdmin}));
    }
}));

/* Log out. */
sessionRoute.delete("", requiresAuth("loggedIn"), errorCatcher((req,res)=>{
    logout(req);
    res.send(succesRes());
}));
