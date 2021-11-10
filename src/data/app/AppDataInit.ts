import { ApprovalStatusEnum, PrivacyStatusEnum, PlatformEnum, GradeLevelEnum, SubjectEnum } from "./appdata-enums";

export default interface AppDataInit {
    id?: string | null;
    name?: string;
    url?: string;
    embed?: string;
    approval?: ApprovalStatusEnum;
    privacy?: PrivacyStatusEnum;
    platforms?: PlatformEnum[];
    grades?: GradeLevelEnum[];
    subjects?: SubjectEnum[];
}
