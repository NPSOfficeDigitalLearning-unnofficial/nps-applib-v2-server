// Get and export the server port (defaulting to 3000 if missing).
/** Port number to host server on. */
export const PORT = (()=>{
    const defaultPort = 3000;
    const portNumRaw = parseInt(process.env.PORT ?? "NaN");
    return isFinite(portNumRaw) ?
        portNumRaw :
        defaultPort;
})();

// Get and export the Postgres database url, and throw if it is missing.
/** Login/access URL of the PostgreSQL server holding the app's data. */
export const DATABASE_URL = (()=>{
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl)
        throw new Error("DATABASE_URL env variable must be provided, but was missing.");
    else
        return dbUrl;
})();

// Get and export the cookie secret for making signed cookies.
/** The secret token used for signed cookies. */
export const SESSION_SECRET = (()=>{
    const val = process.env.SESSION_SECRET;
    if (!val)
        throw new Error("SESSION_SECRET env variable must be provided, but was missing.");
    else
        return val;
})();
