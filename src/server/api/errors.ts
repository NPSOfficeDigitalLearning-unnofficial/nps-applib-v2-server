import { Response } from "express";
import { errorRes } from "./resBuilder";

/** Id of different errors which can occur. */
type ErrorId = "notImplemented"|"unauthorized"|"notFound";

type ErrorEnt<T extends ErrorId> = [number, T];
/** Error datas which have the error code and reason string. */
export const ERROR:{[key in ErrorId]:ErrorEnt<key>} = {
    notImplemented: [501,"notImplemented"],
    unauthorized: [401,"unauthorized"],
    notFound: [404,"notFound"]
};

/** Respond to a request with an error object. */
export function resError(res:Response,err:ErrorEnt<ErrorId>):void {
    res.status(err[0]).json(errorRes(err[1]));
}
