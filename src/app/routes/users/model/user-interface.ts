export interface UserModel {
    USER_ID?: number;
    USERNAME?: string;
    ROLE_ID?: number;
    FIRST_NAME?: string;
    MIDDLE_NAME?: string;
    LAST_NAME?: string;
    MOBILE_NO?: number;
    EMAIL_ID?: string;
    CITY?: string;
    STATE?: string;
    PINCODE?: string;
    IS_ACTIVE?: string;
    DEVICE_ID?: string;
    SESSION_TOKEN?: string;
    USER_SUBSCRIPTION?: UserSubscription[];
}
export interface UserSubscription {
        SUBSCRIPTION_ID: number;
        USER_ID: number;
        STREAM_ID: number;
        YEAR_ID: number;
        IS_ACTIVE: string;
        IS_EXPIRED: string;
        SUBSCRIPTION_FLAG: string;
        COURSE_ID: number;
        BOARD_ID: number;
        MOBILE_NO: number;
        COURSE_STREAM_ID: number;
        MAS_STREAM: string;
        MAS_COURSE_YEAR: string;
        MAS_BOARD: string;
        MAS_COURSE: string;
        STUDENT_STUDY_STATE: string;
        INSTITUTION_NAME: string;
    }
