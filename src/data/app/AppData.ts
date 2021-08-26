import AppDataInit from "./AppDataInit";
import { ApprovalStatusEnum, PrivacyStatusEnum, PlatformEnum, GradeLevelEnum, SubjectEnum } from "./appdata-enums";

const DEFAULT_APP_DATA:Required<AppDataInit> = { id: null, name: "", url: "", approval: "UNK", privacy: "UNK", grades: [], platforms: [], subjects: [] };

export default class AppData {
    private _id: string|null;
    private _name: string;
    private _url: string;
    private _approval: ApprovalStatusEnum;
    private _privacy: PrivacyStatusEnum;
    private _platforms: Set<PlatformEnum>;
    private _grades: Set<GradeLevelEnum>;
    private _subjects: Set<SubjectEnum>;

    public readonly _reactInstanceKey:string = new Array(4).fill(null).map(()=>Math.random().toString(16).substr(2)).join("");

    constructor(init?: AppDataInit) {
        const { id, approval, grades, name, platforms, privacy, subjects, url } = { ...DEFAULT_APP_DATA, ...(init ?? {}) };
        this._id = id;
        this._name = name;
        this._url = url;
        this._approval = approval;
        this._privacy = privacy;
        this._subjects = new Set(subjects);
        this._platforms = new Set(platforms);
        this._grades = new Set(grades);
    }

    public get id       ():string | null       { return this._id        }
    public get name     ():string              { return this._name      }
    public set name     (v:string)             { this._name = v }
    public get url      ():string              { return this._url       }
    public set url      (v:string)             { this._url = v }
    public get approval ():ApprovalStatusEnum  { return this._approval  }
    public set approval (v:ApprovalStatusEnum) { this._approval = v }
    public get privacy  ():PrivacyStatusEnum   { return this._privacy   }
    public set privacy  (v:PrivacyStatusEnum)  { this._privacy = v }
    public get platforms():Set<PlatformEnum>   { return this._platforms }
    public get grades   ():Set<GradeLevelEnum> { return this._grades    }
    public get subjects ():Set<SubjectEnum>    { return this._subjects  }

    
    public setId(v:string):void {
        if (this._id) throw new Error("Application id can only be set once.");
        else if (v) this._id = v;
    }


    toJSON():AppDataInit {
        const { id, name, url, approval, privacy, platforms:platformsSet, grades:gradesSet, subjects:subjectsSet } = this;
        const platforms = [...platformsSet], grades = [...gradesSet], subjects = [...subjectsSet];
        return { id, name, url, approval, privacy, platforms, grades, subjects };
    }
    toString():string {
        return `[ApplicationData "${this.name}" (id: ${this.id})]`;
    }
}
