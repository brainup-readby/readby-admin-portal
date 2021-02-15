import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@shared';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {

  courseTypeList = [];
  addCourseModel = {
    COURSE_CODE: '',
    COURSE_NAME: '',
    IS_ACTIVE: 't',
    COURSE_TYPE_ID: null,
    BOARD_ID: null,
    icon_path: 'c:/test',
    COURSE_PRICE: null
  };
  fileIcon: any;
  imagePath: any;
  imgURL: string | ArrayBuffer;
  serverResponse: any;

  constructor(public dialogRef: MatDialogRef<AddCourseComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService,
              private service: ApiService) {

                this.addCourseModel.BOARD_ID = data.BOARD_ID;
              }

  ngOnInit(): void {
    this.courseTypeList = this.localStorage.get('courseType');
  }


  addCourse() {
    this.spiner.show();
    this.addCourseModel.COURSE_PRICE = Number(this.addCourseModel.COURSE_PRICE);
    if (this.addCourseModel.COURSE_PRICE <= 0) {
        Swal.fire(
          'Error',
          'Price should be grater than 0',
          'error'
        );
        this.spiner.hide();
        return;
    }
    const formData: FormData = new FormData();
    formData.append('file', this.fileIcon[0], this.fileIcon[0].name);
    formData.append('masCourse', JSON.stringify(this.addCourseModel));
    this.service.sendPostFormRequest('addCourses', formData).subscribe( (res: any) => {
      this.serverResponse = res;
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
      this.spiner.hide();
    }, (error) => {
        console.log(error);
        this.spiner.hide();
        if (error === 'Success') {
          Swal.fire(
            'Success',
            'Course saved successfully.',
            'success'
          ).then( okay => {
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

  destroyDailog() {
    this.dialogRef.close();
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

}
