// Get and export the server port (defaulting to 3000 if missing).
/** Port number to host server on. */
export const PORT = (()=>{
    const defaultPort = 3000;
    const portNumRaw = parseInt(process.env.PORT ?? "NaN");
    return isFinite(portNumRaw) ?
        portNumRaw : defaultPort;
})();

// Get and export the password salt rounds to use (default 10).
/** Number of salt rounds to use when hashing passwords. */
export const PASSWORD_SALT_ROUNDS = (()=>{
    const defaultV = 10;
    const raw = parseInt(process.env.PASSWORD_SALT_ROUNDS ?? "NaN");
    return isFinite(raw) ? raw : defaultV;
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

/** URL this webserver will be hosted. */
export const HOSTING_URL = (()=>{
    const dbUrl = process.env.HOSTING_URL;
    if (!dbUrl)
        throw new Error("HOSTING_URL env variable must be provided, but was missing.");
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

// Get and export the email addresses of the admin users for authentication.
/** The email addresses of the trusted admin users. */
export const ADMIN_EMAILS = (()=>{
    return process.env.ADMIN_EMAILS?.split(",").map(v=>v.trim().toLowerCase()) ?? [];
})();
/** The email addresses of the trusted admin users. */
export const ALLOWED_EMAIL_DOMAINS = (()=>{
    return process.env.ALLOWED_EMAIL_DOMAINS?.split(",").map(v=>v.trim().toLowerCase()) ?? [];
})();

/** If the app is in development mode */
export const isDevMode = (process.env.NODE_ENV === "development");
/** If the helmet security is disabled (for debugging). */
export const CORS_LENIENCE_DEBUG = (process.env.CORS_LENIENCE_DEBUG?.toLocaleLowerCase() === "true");
/** If the app is to ignore permissions in developer mode. */
export const devOverridePermissions = (process.env.DEV_OVERRIDE_PERMS ?? "false").toLowerCase() === "true";

export const verificationEmailCredentials = (()=>{
    const user = process.env.VERIFICATION_EMAIL;
    const pass = process.env.VERIFICATION_EMAIL_PASS;
    if (!user || !pass)
        throw new Error("VERIFICATION_EMAIL and VERIFICATION_EMAIL_PASS must be provided, but were missing.");
    return { user, pass };
})();

/** The source of the static data to be served. 
 * 
 * Formats:
 * "url https://a.b/c.zip" -> fetch zip from url.
 * "github user/repo" -> fetch latest release zipball.
*/
export const publicDataSrc = (()=>{
    const txt = process.env.PUBLIC_DATA_SRC?.trim() ?? "";
    const [type,src] = txt.split(" ");
    if (!type || !src)
        throw new Error("PUBLIC_DATA_SRC must be provided, but was missing.");

    return {type,src};
})();
