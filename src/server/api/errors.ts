import { Response } from "express";
import { errorRes } from "./resBuilder";

/** Id of different errors which can occur. */
type ErrorId = "notImplemented"|"unauthorized"|"notFound"|"signupEmailTaken"|"requestBodyInvalid"|"modifyNonexistent"|"serverError"|"appNotFound";

type ErrorEnt<T extends ErrorId> = [number, T];
/** Error datas which have the error code and reason string. */
export const ERROR:{[key in ErrorId]:ErrorEnt<key>} = {
    notImplemented: [501,"notImplemented"],
    unauthorized: [401,"unauthorized"],
    notFound: [404,"notFound"],
    signupEmailTaken: [500,"signupEmailTaken"],
    requestBodyInvalid: [400,"requestBodyInvalid"],
    modifyNonexistent: [404,"modifyNonexistent"],
    serverError: [500,"serverError"],
    appNotFound: [404,"appNotFound"]
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
