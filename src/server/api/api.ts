import { Router } from "express";
import { appRoute } from "./routes/app";
import { ERROR, resError } from "./errors";
import { userRoute } from "./routes/user";
import { sessionRoute } from "./routes/session";
import { verifyRoute } from "./routes/verify";

// API response data types.
export type APIDataResponse<T> = { type: "data", data: T };
export type APIErrorResponse = { type: "error", error: string, moreInfo?:string };
export type APISuccessResponse = { type: "success", moreInfo?:string };
export type APIResponse<T> = APIDataResponse<T> | APIErrorResponse | APISuccessResponse;


/** The sub-instance of express responsible for api routing. */
export const apiRoute = Router();

// ----- Sub-routes ----- //
apiRoute.use("/app", appRoute);
apiRoute.use("/user", userRoute);
apiRoute.use("/session", sessionRoute);
apiRoute.use("/verify", verifyRoute);

// 404 Route, any request which is not handled by the api will end up here where it will be rejected.
apiRoute.use((req,res)=>{
    resError(res,ERROR.notFound);
});
