import { NextFunction, Request, RequestHandler, Response } from "express";
import { getUserId, isAdmin, isEditor } from "../session";
import { ERROR, resError } from "./errors";

type AuthKind = "edit"|"admin"|"loggedOut"|"loggedIn";

/** The implementation of the middleware. */
function requiresAuthFunction(kind:AuthKind,req:Request, res:Response, next:NextFunction):void {
    // Figure out if the user is authorized based on `kind`
    let isAuthorized = false;
    switch(kind) {
    case "edit": // Good if is editor.
        isAuthorized = isEditor(req); break;
    case "admin": // Good if is admin (can edit others).
        isAuthorized = isAdmin(req); break;
    case "loggedOut": // Good if user is logged out.
        isAuthorized = getUserId(req) === undefined; break;
    case "loggedIn": // Good if user is logged in.
        isAuthorized = getUserId(req) !== undefined; break;
    default:
        isAuthorized = false; break;
    }
    
    if (isAuthorized)
        // Continue if is editor.
        next();
    else
        // Otherwise, tell the user they are unauthorized
        resError(res,ERROR.unauthorized);
}

/** Middleware that, when added, requires the request sender to be logged in as an editor. */
export default function requiresAuth(kind:AuthKind):RequestHandler {
    return requiresAuthFunction.bind(undefined,kind);
}
