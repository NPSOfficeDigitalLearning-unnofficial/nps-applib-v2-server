import { createTransport } from "nodemailer";
import { HOSTING_URL, verificationEmailCredentials } from "../../env";

const EXPIRY_CHECK_DELAY = 60000, VERIFICATION_EXPIRE_TIME = 300000;

let expiryCheckT = Date.now();
const verificationRequests:{[key:string]:{res:(verified:boolean)=>void,expires:number}} = {};


console.log(verificationEmailCredentials);

const emailTransport = createTransport({
    service: "gmail",
    secure: true,
    auth: verificationEmailCredentials
});


function checkRequestsExpired() {
    const now = Date.now();
    if (now < expiryCheckT) return;
    expiryCheckT = now + EXPIRY_CHECK_DELAY;

    const expired = Object.entries(verificationRequests).filter(([,{expires}]) => now > expires);
    for (const [key] of expired)
        expireRequest(key);
}
function checkOneRequestExpired(key:string) {
    const req = verificationRequests[key];
    if (req && req.expires > Date.now())
        expireRequest(key);
}
function expireRequest(key:string) {
    verificationRequests[key].res(false);
    delete verificationRequests[key];
}

function genKey() {
    return Math.random().toString(16).substr(2);
}


async function sendEmail(recipient:string,subject:string,html:string) {
    try {
        const k = await emailTransport.sendMail({
            to:recipient,
            subject: "TEST",
            html
        });
        console.log(k);
    } catch (e) {
        console.error((e as {stack:string}).stack);
    }
}



export function resEmail(key:string):boolean {
    checkRequestsExpired();
    checkOneRequestExpired(key);
    const req = verificationRequests[key];
    if (req) {
        req.res(true);
        delete verificationRequests[key];
        return true;
    } else
        return false;
}
export function verifyEmail(email:string):Promise<boolean> {
    let res:(verified:boolean)=>void = ()=>void 0;
    const promise = new Promise<boolean>(res_=>res=res_), key = genKey();
    verificationRequests[key] = { res, expires:Date.now()+VERIFICATION_EXPIRE_TIME };

    sendEmail(email,"NPS-AppLib Email Verification",`<h1>Verify your email address</h1><p>You have recently used the email address ${email} to sign up on ${HOSTING_URL}. To verify your email, please click <a href="${HOSTING_URL}/verify-link/${key}">this link</a>.</p>`);

    return promise;
}