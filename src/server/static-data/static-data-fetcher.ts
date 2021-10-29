import { publicDataSrc } from "../../env";
import fs from "fs/promises";
import extractZip from "extract-zip";
import fetch from "node-fetch-commonjs";
import path from "path";

async function fetchZip(url:string):Promise<Blob> {
    return await (await fetch(url,{headers:{"accept":"application/zip text/*"}})).blob();
}

async function getLatestReleaseOf(owner:string,repo:string):Promise<Blob> {
    const releaseInfo = await (await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)).json() as never;
    console.log(releaseInfo);
    if (releaseInfo && releaseInfo["zipball_url"])
        return fetchZip(releaseInfo["zipball_url"]);
    else
        throw new Error(`Could not fetch latest github release for '${owner}/${repo}'`);
}

export async function loadPublicData():Promise<void> {
    const {type,src} = publicDataSrc;
    
    let zip:Blob;
    if (type === "url")
        zip = await fetchZip(src);
    else if (type === "github") {
        const [user,repo] = src.split("/");
        zip = await getLatestReleaseOf(user,repo);
    } else
        throw new Error("env variable PUBLIC_DATA_SRC type was invalid, must be one of ['url','github']");

    const zipPath = path.join(process.cwd(),"./downloaded-public-data.zip");
    await fs.writeFile(zipPath, zip.stream() as never);
    await extractZip(zipPath,{dir:path.join(process.cwd(),"/public")});
    // TODO unzip
} 
