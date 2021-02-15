import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '@shared';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { SubjectModel } from '../model/subject-interface';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.scss']
})
export class EditSubjectComponent implements OnInit {
  public imagePath;
  public imgURL: any;
  public message: string;
 // subjectModel: SubjectModel;
  isImageUpdate: boolean;
  fileIcon: any;
  editedImagePath: any;
  serverResponse: any;
  boardTypeList = [];
  masStreamList = [];
  masStreamAddList = [];
  courseYearList = [];
  courseYearAddList = [];
  subjectModel = {
    SUBJECT_ID: null,
    SUBJECT_CODE: '',
    SUBJECT_NAME: '',
    IS_ACTIVE: 't',
    icon_path: 'c:/test',
    STREAM_ID: null,
    YEAR_ID: null,
    COURSE_ID: null
  };
  constructor(public dialogRef: MatDialogRef<EditSubjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private service: ApiService,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService,
              private router: Router) {

    this.subjectModel.SUBJECT_ID = data.SUBJECT_ID;
    this.subjectModel.SUBJECT_CODE = data.SUBJECT_CODE;
    this.subjectModel.SUBJECT_NAME = data.SUBJECT_NAME;
    this.subjectModel.STREAM_ID = data.STREAM_ID;
    this.subjectModel.YEAR_ID = data.YEAR_ID;
    this.subjectModel.COURSE_ID = data.COURSE_ID;
    this.subjectModel.icon_path = data.icon_path;
    console.log(this.subjectModel);
    this.imgURL = this.subjectModel.icon_path;
    this.getStreamListByCourseId(data.COURSE_ID);
    this.getYearListByCourseId(data.COURSE_ID);
}

ngOnInit(): void {

    this.boardTypeList = this.localStorage.get('boardType');
   /*  this.masStreamList = this.localStorage.get('MasStreamList');
    const masStreams = this.localStorage.get('MasStreamList');
    masStreams.forEach(element => {
         const json = {
          STREAM_ID: element.STREAM_ID,
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

onFileSelected(event) {
  this.isImageUpdate = true;
  this.fileIcon = event.target.files;
  const reader = new FileReader();
  this.imagePath = this.editedImagePath;
  reader.readAsDataURL(this.fileIcon[0]);
  reader.onload = (_event) => {
    this.imgURL = reader.result;
  };
}

preview(files) {
  if (files.length === 0) {
    return;
  }

  const mimeType = files[0].type;
  if (mimeType.match(/image\/*/) == null) {
    this.message = 'Only images are supported.';
    return;
  }

  const reader = new FileReader();
  this.imagePath = files;
  reader.readAsDataURL(files[0]);
  reader.onload = (_event) => {
    this.imgURL = reader.result;
  };
}

updateSubject() {
  this.spiner.show();
  const blob = new Blob();
  const formData: FormData = new FormData();
  // this.getMasStreamName(this.subjectModel.MAS_STREAM.STREAM_CODE, this.subjectModel.MAS_COURSE_YEAR.YEAR);
  if (this.isImageUpdate) {
    formData.append('file', this.fileIcon[0], this.fileIcon[0].name);
  } else {
    formData.append('file', blob, this.fileIcon);
  }
  formData.append('masSubjects', JSON.stringify(this.subjectModel));
  this.service.sendPostFormRequest('editSubjects', formData).subscribe( (res: any) => {
    this.serverResponse = res;
    this.spiner.hide();
  }, (error) => {
      // console.log(error);
      this.spiner.hide();
      if (error === 'Success') {
        this.destroyDailog();
        Swal.fire('Success',
          'Subject successfully Updated',
          'success').then( okay => {
            if (okay) {
              window.location.reload();
            }
        });
      } else {
        Swal.fire(
           error.split(',')[0],
           error.split(',')[1],
          'error'
        );
      }
  });
}
  addCourseEditModel(addCourseEditModel: any): string | Blob {
    throw new Error('Method not implemented.');
  }

 /*  getMasStreamName(streamId: any, yearId: any) {
    console.log(streamId);
    this.subjectModel.MAS_STREAM = this.masStreamList.filter( f => f.STREAM_CODE === streamId)[0];
    this.subjectModel.MAS_COURSE_YEAR = this.courseYearList.filter( f => f.YEAR_ID === yearId)[0];
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
