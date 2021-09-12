import { NextFunction, Request, Response } from "express";
import session from "express-session";
import { never } from "../const";
import UserData from "../data/user/UserData";
import User from "../db/models/User";
import { devOverridePermissions, isDevMode, SESSION_SECRET } from "../env";

const sessionCookieName = "adminSession";

const loggedInUsers:{[id:string]:{data:UserData,expires:number}} = {};
const lastCleared = Date.now(), CLEAR_TIMEOUT = 60000, USERDATA_LIFETIME = 300000;
function clearStaleUserData():void {
    const now = Date.now();
    if (now - lastCleared > CLEAR_TIMEOUT) {
        for (const [key,user] of Object.entries(loggedInUsers)) {
            if (now > user.expires)
                delete loggedInUsers[key];
        }
    }
}
async function tryUpdateUserData(req:Request, id:string):Promise<void> {
    // Get the loggedInUser by id, and set it to a default if it is missing.
    const loginEntry = loggedInUsers[id] ??= {data:never, expires:NaN};
    if (!loginEntry.data) {
        // Init the user data if it is not already there.
        const dbUser = await User.findByPk(id);
        if (dbUser)
            loginEntry.data = new UserData(dbUser);
        else // If the session is for an account which doesn't exist, log out.
            logout(req);
    }
    // Update expire time to be the maximum user data lifetime value.
    loginEntry.expires = Date.now() + USERDATA_LIFETIME;
}

/** The session middleware used by the server to handle session stuff. */
export const sessionMiddleware = [
    session({
        name: sessionCookieName,
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 172800000
        }
    }),
    // Handle changes to `loggedInUsers` map, by adding new user datas, and clearing old ones.
    async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        const userId = getUserId(req);
        if (userId)
            await tryUpdateUserData(req,userId);
        clearStaleUserData();
        next();
    }
];

// Modified types for using `req.session`
interface SessionData {
    userId?: string;
}
type SessionObj = session.Session & SessionData & Partial<session.SessionData>;

/** Get a type altered version of `req.session`. */
export function getSession(req:Request):SessionObj {
    return req.session;
}

/** Log the user in with a certain. */
export function login(req:Request, userId:string):void {
    const sessData = getSession(req);
    sessData.userId = userId; 
}

/** Log the user out. */
export function logout(req:Request):void {
    const sessData = getSession(req);
    delete sessData.userId;
}

/** Get the id of the logged in user (or undefined if logged out). */
export function getUserId(req:Request):string|undefined {
    return getSession(req).userId;
}
/** Get the id of the logged in user (or undefined if logged out). */
export function getUser(req:Request):UserData|undefined {
    const id = getUserId(req);
    return (id===undefined) ? undefined : loggedInUsers[id].data;
}

/** If developer settings say authentication should be skipped for debugging. */
const shouldSkipAuth = isDevMode && devOverridePermissions;

/** Get the id of the logged in user (or undefined if logged out). */
export function isEditor(req:Request):boolean {
    if (shouldSkipAuth) return true;
    const user = getUser(req);
    if (user === undefined) return false;
    // Get permission data from db. (if the user is an admin, they can always edit)
    return user.isEditor || user.isAdmin;
}
/** Get the id of the logged in user (or undefined if logged out). */
export function isAdmin(req:Request):boolean {
    if (shouldSkipAuth) return true;
    const user = getUser(req);
    if (user === undefined) return false;
    // Check if email is in ADMIN_EMAILS.
    return user.isAdmin;
}
