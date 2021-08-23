import express from "express";
import { PORT } from "../env";
import helmet from "helmet";
import { getUser, login, logout, sessionMiddleware } from "./session";

// ----- Construct app router ----- //
const app = express();


// ----- Set up the middleware and configure ----- //

// Trust first redirect (by server).
app.set("trust proxy", 1);

// Use Helmetjs for security stuff..
app.use(helmet());

// Parser middlewares, parsin
app.use(express.json());

// Import session middleware which is built in `./session`.
app.use(sessionMiddleware);
  

// ----- TEST ENDPOINTS ----- //

app.get("/",(req,res)=>{
    res.send("It works.");
});

app.get("/login/:id",(req,res)=>{
    const { id } = req.params;
    login(req,id);
    res.send(`Logged In: ${id}`);
});

app.get("/logout",(req,res)=>{
    logout(req);
    res.send("Logged out");
});

app.get("/check",(req,res)=>{
    res.send(`Logged In: ${getUser(req)}`);
});


// ----- Start the http server and export it. ----- //
export const server = app.listen(PORT,()=>{
    console.log(`>> SERVER STARTED [port: ${PORT}]`);
});
