import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@shared';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AddChapterModel } from './model/chapter-model';

@Component({
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html'
})
export class AddChapterComponent implements OnInit {

  addChapterModel = new AddChapterModel();
  fileIcon: any;
  imagePath: any;
  imgURL: string | ArrayBuffer;
  constructor(public dialogRef: MatDialogRef<AddChapterComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService,
              private service: ApiService) {
                console.log(data);
                this.addChapterModel.SUBJECT_ID = data.SUBJECT_ID;
                this.addChapterModel.IS_ACTIVE = 't';
                this.addChapterModel.icon_path = 'c://tmp';
  }

  ngOnInit(): void {
  }

  destroyDailog() {
    this.dialogRef.close();
  }

  addChapter() {
    this.spiner.show();
    const formData: FormData = new FormData();
    formData.append('file', this.fileIcon[0], this.fileIcon[0].name);
    formData.append('masChapters', JSON.stringify(this.addChapterModel));
    this.service.sendPostFormRequest('addChapters', formData).subscribe( (res: any) => {
      /* if (res === 'course added successfully') {
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
      } */
      console.log(res);
      this.spiner.hide();
    }, (error) => {
        console.log(error);
        this.spiner.hide();
        if (error === 'Success') {
          this.destroyDailog();
          Swal.fire(
            'Success',
            'Chapter Added In Subject.',
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

}
