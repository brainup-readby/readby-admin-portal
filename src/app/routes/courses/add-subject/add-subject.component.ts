import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '../../../shared/services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../shared/services/api.services';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.scss']
})
export class AddSubjectComponent implements OnInit {

  // addSubModel = new AddSubModel();
  fileIcon: any;
  imagePath: any;
  imgURL: string | ArrayBuffer;
  boardTypeList = [];
  masStreamList = [];
  masStreamAddList = [];
  courseYearList = [];
  courseYearAddList = [];
  addSubModel  = {
    SUBJECT_CODE: '',
    SUBJECT_NAME: '',
    IS_ACTIVE: 't',
    // tslint:disable-next-line:variable-name
    icon_path: 'c://tmp',
    STREAM_ID: null,
    YEAR_ID: null,
    COURSE_ID: null
  };
  constructor(public dialogRef: MatDialogRef<AddSubjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService,
              private service: ApiService) {
     this.addSubModel.IS_ACTIVE = 't';
     this.addSubModel.icon_path = 'c://tmp';
     this.addSubModel.COURSE_ID = data.courseId;
     this.getStreamListByCourseId(data.courseId);
     this.getYearListByCourseId(data.courseId);
     /* this.addSubModel.MAS_STREAM = data.masCourse[0];
     this.addSubModel.MAS_COURSE_YEAR = data.masCourseYear[0]; */
  }

  ngOnInit(): void {
    this.boardTypeList = this.localStorage.get('boardType');
    /* this.masStreamList = this.localStorage.get('MasStreamList');
    const masStreams = this.localStorage.get('MasStreamList');
    masStreams.forEach(element => {
         const json = {
          STREAM_CODE: element.STREAM_CODE,
          STREAM_NAME: element.STREAM_NAME
         };
         this.masStreamAddList.push(json);
    });
    this.courseYearList = this.localStorage.get('MasStreamYear');
    const masStreamsYears = this.localStorage.get('MasStreamYear');
    masStreamsYears.forEach(el => {
         const json = {
            YEAR: el.YEAR,
            DISPLAY_NAME: el.DISPLAY_NAME
         };
         this.courseYearAddList.push(json);
    }); */
  }

  destroyDailog() {
    this.dialogRef.close();
  }

  addSubject() {
    this.spiner.show();
    const formData: FormData = new FormData();
   // this.getMasStreamName(this.addSubModel.MAS_STREAM.STREAM_CODE, this.addSubModel.MAS_COURSE_YEAR.YEAR);
   // console.log(this.addSubModel);
    formData.append('file', this.fileIcon[0], this.fileIcon[0].name);
    formData.append('masSubjects', JSON.stringify(this.addSubModel));

    this.service.sendPostFormRequest('addSubjects', formData).subscribe( (res: any) => {
      if (res === 'course added successfully') {
        this.destroyDailog();
        Swal.fire(
          'Success',
          'Course saved successfully.',
          'success'
        ).then( okay => {
          if (okay) {
            window.location.reload();
          }
      });
      }
      console.log(res);
      this.spiner.hide();
    }, (error) => {
        console.log(error);
        this.spiner.hide();
        if (error === 'Success') {
          this.destroyDailog();
          Swal.fire(
            'Success',
            'Subject Added In Course.',
            'success'
          );
        } else {
          Swal.fire(
            error.split(',')[0],
            error.split(',')[1],
            'error'
          );
        }
    });
  }

  onFileSelected(event) {
    this.fileIcon = event.target.files;
    const reader = new FileReader();
    this.imagePath = this.fileIcon;
    // this.addCourseModel.icon_path = this.fileIcon;
    reader.readAsDataURL(this.fileIcon[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  /* getMasStreamName(streamId: any, yearId: any) {
    this.addSubModel.MAS_STREAM = this.masStreamList.filter( f => f.STREAM_CODE === streamId)[0];
    // tslint:disable-next-line:no-string-literal
    delete this.addSubModel.MAS_STREAM['STREAM_ID'];
   // this.addSubModel.MAS_STREAM = this.masStreamList.filter( f => f.STREAM_ID === streamId);
   // this.addSubModel.MAS_COURSE_YEAR = this.courseYearList.filter( f => f.YEAR_ID === yearId);
  } */

  getStreamListByCourseId(courseId: any) {
      this.spiner.show();
      this.service.sendGetRequest('getMasStreamList?courseId=' + courseId).subscribe((res) => {
          this.spiner.hide();
          if (res.status === '200') {
              this.masStreamAddList = res.data;
          }
      });
  }
  getYearListByCourseId(courseId: any) {
      this.spiner.hide();
      this.service.sendGetRequest('getMasYearList?courseId=' + courseId).subscribe((res) => {
          this.spiner.hide();
          if (res.status === '200') {
              this.courseYearAddList = res.data;
          }
      });
  }

}

export class AddSubModel {
  SUBJECT_CODE?: string;
  SUBJECT_NAME?: string;
  IS_ACTIVE?: string;
  // tslint:disable-next-line:variable-name
  icon_path?: string;
  MAS_STREAM?: MasStream;
  MAS_COURSE_YEAR?: MasCourseYear;
  COURSE_ID?: string;
}

export class MasCourseYear {
  YEAR?: number;
  DISPLAY_NAME?: string;
  IS_ACTIVE?: string;
}

export class MasStream {
  STREAM_CODE?: string;
  STREAM_NAME?: string;
  IS_ACTIVE?: string;
}
