import { Router } from "express";
import AppData from "../../../data/app/AppData";
import { APPROVAL_STATUSES, GRADE_LEVELS, PLATFORMS, PRIVACY_STATUSES, SUBJECTS } from "../../../data/app/appdata-enums";
import AppDataInit from "../../../data/app/AppDataInit";
import { allAreFromArray } from "../../../util/array";
import { ERROR, errorCatcher, resError } from "../errors";
import requiresAuth from "../requiresAuth";
import { dataRes, succesRes } from "../resBuilder";

export const appRoute = Router();


/* Get all apps.
RESPONSE:
    AppDataInit[] */
appRoute.get("", errorCatcher(async (req,res)=>{
    const apps = await AppData.getAllJSON();
    res.status(200).json(dataRes(apps));
}));


/* Get an app by id.
RESPONSE:
    AppDataInit | undefined */
appRoute.get("/:id", errorCatcher<{id:string},unknown,unknown,never,{[key:string]:string}>(async (req,res)=>{
    const app = await AppData.getByIdJSON(req.params.id);
    if (app)
        res.status(200).json(dataRes(app));
    else resError(res,ERROR.appNotFound);
}));


/* Add a new app. (Requires authentication)
BODY:
    Required<Omit<AppDataInit,"id">>
RESPONSE:
    AppDataInit */
appRoute.post("", requiresAuth("edit"), errorCatcher(async (req,res)=>{
    const {name,url,approval,privacy,platforms,grades,subjects} = req.body as Required<Omit<AppDataInit,"id">>;
    if (typeof(name) !== "string" ||
        typeof(url)  !== "string" ||
        !allAreFromArray(APPROVAL_STATUSES,[approval ]) ||
        !allAreFromArray(PRIVACY_STATUSES, [privacy  ]) ||
        !allAreFromArray(PLATFORMS,         platforms ) ||
        !allAreFromArray(GRADE_LEVELS,      grades    ) ||
        !allAreFromArray(SUBJECTS,          subjects  )
    ) {
        resError(res,ERROR.requestBodyInvalid);
        return;
    }
    const createdApp = (await AppData.createApp({name,url,approval,platforms,grades,privacy,subjects})).toJSON();
    res.status(200).json(dataRes(createdApp));
}));


/* Add a new app. (Requires authentication)
BODY:
    Partial<Omit<AppDataInit,"id">> */
appRoute.patch("/:id", requiresAuth("edit"), errorCatcher(async (req,res)=>{
    const { id } = req.params;
    const {name,url,approval,privacy,platforms,grades,subjects} = req.body as Partial<Omit<AppDataInit,"id">>;
    if (typeof(name ?? "") !== "string" ||
        typeof(url  ?? "") !== "string" ||
        !allAreFromArray(APPROVAL_STATUSES,[approval  ?? "UNK"]) ||
        !allAreFromArray(PRIVACY_STATUSES, [privacy   ?? "UNK"]) ||
        !allAreFromArray(PLATFORMS,         platforms ?? []    ) ||
        !allAreFromArray(GRADE_LEVELS,      grades    ?? []    ) ||
        !allAreFromArray(SUBJECTS,          subjects  ?? []    )
    ) {
        resError(res,ERROR.requestBodyInvalid);
        return;
    }
    const patchedApp = (await AppData.patchApp(id,{name,url,approval,privacy,grades,platforms,subjects})).toJSON();
    res.status(200).json(dataRes(patchedApp));
}));


/* Delete an app by id. (Requires authentication) 
RESPONSE:
    *success* */
appRoute.delete("/:id", requiresAuth("edit"), errorCatcher(async (req,res)=>{
    await AppData.deleteApp(req.params.id);
    res.send(200).json(succesRes());
}));
