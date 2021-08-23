import { Request } from "express";
import session from "express-session";
import { SESSION_SECRET } from "../env";

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
