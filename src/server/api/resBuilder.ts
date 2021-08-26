import { APIDataResponse, APIErrorResponse, APISuccessResponse } from "./api";

/** Make an APIResponse json object with an error `errorKey` */
export function errorRes(errorKey:string,moreInfo?:string):APIErrorResponse {
    return {type:"error",error:errorKey,moreInfo};
}
/** Make an APIResponse json object with json data `data` */
export function dataRes<T>(data:T):APIDataResponse<T> {
    return {type:"data",data};
}
/** Make an APIResponse json object with no data signifying a successful operation. */
export function succesRes():APISuccessResponse {
    return {type:"success"};
}
