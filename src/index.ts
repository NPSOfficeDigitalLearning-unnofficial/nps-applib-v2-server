import express from "express";

export const app = express();

app.get("/",(req,res)=>{
    res.send("It works.");
});


const _portIn = parseInt(process.env.PORT ?? "");
const port = isFinite(_portIn) ? _portIn : 3000;

export const server = app.listen(port,()=>{
    console.log(`>> STARTED [port:${port}]`); 
});


