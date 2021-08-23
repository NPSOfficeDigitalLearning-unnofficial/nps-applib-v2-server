import { Request } from "express";
import session from "express-session";
import { devOverridePermissions, isDevMode, SESSION_SECRET } from "../env";

const sessionCookieName = "adminSession";

/** The session middleware used by the server to handle session stuff. */
export const sessionMiddleware = session({
    name: sessionCookieName,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 172800000
    }
});

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
export function getUser(req:Request):string|undefined {
    return getSession(req).userId;
}

/** If developer settings say authentication should be skipped for debugging. */
const shouldSkipAuth = isDevMode && devOverridePermissions;

/** Get the id of the logged in user (or undefined if logged out). */
export function isEditor(req:Request):boolean {
    if (shouldSkipAuth) return true;
    return getUser(req) !== undefined; // TODO make it so some accounts are editors and some aren't.
}
/** Get the id of the logged in user (or undefined if logged out). */
export function isAdmin(req:Request):boolean {
    if (shouldSkipAuth) return true;
    return getUser(req) !== undefined; // TODO make it so some accounts are admins and some aren't.
}
