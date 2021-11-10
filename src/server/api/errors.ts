import { RequestHandler, Response } from "express";
import { errorRes } from "./resBuilder";

/** Id of different errors which can occur. */
type ErrorId = "notImplemented"|"unauthorized"|"notFound"|"signupEmailTaken"|"emailInvalid"|"passwordInvalid"|"emailDomainNotAllowed"|"requestBodyInvalid"|"modifyNonexistent"|"serverError"|"appNotFound"|"wrongCredentials"|"invalidEmailVerify";

type ErrorEnt<T extends ErrorId> = [number, T];
/** Error datas which have the error code and reason string. */
export const ERROR:{[key in ErrorId]:ErrorEnt<key>} = {
    notImplemented: [501,"notImplemented"],
    unauthorized: [401,"unauthorized"],
    notFound: [404,"notFound"],
    signupEmailTaken: [500,"signupEmailTaken"],
    emailInvalid: [422,"emailInvalid"],
    passwordInvalid: [422,"passwordInvalid"],
    emailDomainNotAllowed: [401,"emailDomainNotAllowed"],
    requestBodyInvalid: [422,"requestBodyInvalid"],
    modifyNonexistent: [404,"modifyNonexistent"],
    serverError: [500,"serverError"],
    appNotFound: [404,"appNotFound"],
    wrongCredentials: [401,"wrongCredentials"],
    invalidEmailVerify: [404,"invalidEmailVerify"]
};
const ERROR_IDS = Object.keys(ERROR) as ErrorId[];

/** Respond to a request with an error object. */
export function resError(res:Response,err:ErrorEnt<ErrorId>,moreInfo?:string):void {
    res.status(err[0]).json(errorRes(err[1],moreInfo));
}

/** Respond to a request with an error object. */
export function resErrorObj(res:Response,err:Error):void {
    const errId = err.message;
    if (ERROR_IDS.includes(errId as ErrorId))
        resError(res,ERROR[errId as ErrorId]);
    else
        resError(res,ERROR.serverError,err.stack);
}

/** Catch errors that occur inside an express endpoint. */
export function errorCatcher<A,B,C,D,E>(fn:RequestHandler<A, B, C, D, E>):RequestHandler<A, B, C, D, E> {
    return async (req,res,next) => {
        try {
            return await fn(req,res,next);
        } catch (e) {
            if (e instanceof Error)
                resErrorObj(res,e);
            else resErrorObj(res,new Error(new String(e) as string));
        }
    };
}
