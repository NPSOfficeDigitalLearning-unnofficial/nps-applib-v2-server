export const APPROVAL_STATUSES = ["UNK", "APPROVED", "14_PARENTAL_CONSENT", "PARENT_INFORMED", "PILOT", "INSTRUCTOR_ONLY", "PENDING", "DENIED"] as const;
export const PRIVACY_STATUSES = ["UNK", "COMPLIANT", "NONCOMPLIANT", "PARENTAL_CONSENT", "INSTRUCTOR_ONLY", "NO_INFO_COLLECTED", "NOT_APPLICABLE"] as const;
export const PLATFORMS = ["WINDOWS", "MACOS", "LINUX", "ANDROID_PHONE", "ANDROID_TABLET", "IOS_PHONE", "IOS_TABLET", "WEB", "CHROMEBOOK"] as const;
export const GRADE_LEVELS = ["PRE_K", "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;
export const SUBJECTS = ["MATH", "SCIENCE", "HISTORY", "ENGLISH", "LANGUAGE", "CS", "ART", "MUSIC","SEL"] as const;

export type ApprovalStatusEnum = typeof APPROVAL_STATUSES[number];
export type PrivacyStatusEnum = typeof PRIVACY_STATUSES[number];
export type PlatformEnum = typeof PLATFORMS[number];
export type GradeLevelEnum = typeof GRADE_LEVELS[number];
export type SubjectEnum = typeof SUBJECTS[number];
