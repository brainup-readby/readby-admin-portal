export class AddCourseModel {
    COURSE_CODE: string;
    COURSE_NAME: string;
    IS_ACTIVE: string;
    // tslint:disable-next-line:variable-name
    icon_path: string;
    COURSE_TYPE_ID: number;
    BOARD_ID: number;
    MAS_STREAM: MasStream[];
    MAS_COURSE_YEAR: MasCourseYear[];
    COURSE_TYPE: string;
    COURSE_PRICE: number;
}

export class MasCourseYear {
    YEAR: number;
    DISPLAY_NAME: string;
}

export class MasStream {
    STREAM_CODE: string;
    STREAM_NAME: string;
}
