import { Router } from "express";
import { appRoute } from "./routes/app";
import { ERROR, resError } from "./errors";
import { userRoute } from "./routes/user";

// API response data types.
export type APIDataResponse<T> = { type: "data", data: T };
export type APIErrorResponse = { type: "error", error: string };
export type APIResponse<T> = APIDataResponse<T> | APIErrorResponse;


/** The sub-instance of express responsible for api routing. */
export const apiRoute = Router();

// ----- Sub-routes ----- //
apiRoute.use("/app", appRoute);
apiRoute.use("/user", userRoute);

// 404 Route, any request which is not handled by the api will end up here where it will be rejected.
apiRoute.use((req,res)=>{
    resError(res,ERROR.notFound);
});
