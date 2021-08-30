import { hash, compare } from "bcrypt";
import User from "../../db/models/User";
import { ADMIN_EMAILS, PASSWORD_SALT_ROUNDS } from "../../env";
import { ERROR } from "../../server/api/errors";

export default class UserData {
    get id        ():string   { return this.wrappedDBObject.id }
    get email     ():string   { return this.wrappedDBObject.email }
    get hashedPass():string   { return this.wrappedDBObject.hashedpass }
    set hashedPass(v:string)  { this.wrappedDBObject.hashedpass = v }
    get canEdit   ():boolean  { return this.wrappedDBObject.canedit }
    set canEdit   (v:boolean) { this.wrappedDBObject.canedit = v }

    get isAdmin():boolean {
        // Case insensitive check if ADMIN_EMAILS allows the user to be admin.
        return ADMIN_EMAILS.includes(this.email.toLowerCase());
    }

    constructor(readonly wrappedDBObject:User) {}

    async checkPassword(pass:string):Promise<boolean> {
        return await compare(pass, this.hashedPass);
    }
    async setPassword(pass:string):Promise<void> {
        this.hashedPass = await hash(pass,PASSWORD_SALT_ROUNDS);
    }

    static async createUser(email:string,pass:string):Promise<UserData> {
        if (User.findOne({where:{email:email.toLowerCase()}}))
            throw new Error(ERROR.signupEmailTaken[1]);

        const hashedPass = await hash(pass,PASSWORD_SALT_ROUNDS);
        return new UserData(await User.create({email: email.toLowerCase(), hashedpass: hashedPass, canedit: false}));
    }
    static async patchUser(id:string,email?:string,canEdit?:boolean):Promise<UserData> {
        const user = await User.findByPk(id);
        if (!user)
            throw new Error(ERROR.modifyNonexistent[1]);
        if (email !== undefined) user.email = email;
        if (canEdit !== undefined) user.canedit = canEdit;
        await user.save();
        return new UserData(user);
    }
    static async getById(id:string):Promise<UserData|undefined> {
        const dbApp = await User.findByPk(id);
        if (dbApp)
            return new UserData(dbApp);
    }
    static async getByEmail(email:string):Promise<UserData|undefined> {
        const dbApp = await User.findOne({where:{email}});
        if (dbApp)
            return new UserData(dbApp);
    }
}
