import express from "express";
import { CORS_LENIENCE_DEBUG, PORT } from "../env";
import helmet from "helmet";
import { sessionMiddleware } from "./session";
import { apiRoute } from "./api/api";
import path from "path";

// ----- Construct app router ----- //
const app = express();


// ----- Set up the middleware and configure ----- //

// Trust first redirect (by server).
app.set("trust proxy", 1);

// Use Helmetjs for security stuff..
app.use(helmet({contentSecurityPolicy:{
    directives: {
        "script-src": ["'self'","'unsafe-inline'"] // Add 'unsafe-inline' so React works.
    },
    useDefaults:true
}}));
if (CORS_LENIENCE_DEBUG) {
    app.use((req,res,next)=>{
        res.header("Access-Control-Allow-Origin","*");
        next();
    });
}

// Parser middlewares, parsin
app.use(express.json());

// Import session middleware which is built in `./session`.
app.use(...sessionMiddleware);
  
// ----- ENDPOINTS ----- //

// Route containing api enpoints.
app.use("/api",apiRoute);


const PUBLIC_FOLDER = path.join(process.cwd(),"/public/");

// Public folder contains react app.
app.use(express.static(PUBLIC_FOLDER));

// Return react app index for page requests.
app.use((req,res,next)=>{
    if (req.method !== "GET" || !req.accepts(["html","text/html"]))
        return void next();
    res.sendFile(path.join(PUBLIC_FOLDER,"index.html"));
});


// ----- Start the http server and export it. ----- //
export const server = app.listen(PORT,()=>{
    console.log(`>> SERVER STARTED [port: ${PORT}]`);
});
