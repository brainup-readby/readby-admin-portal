import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '@shared';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ChapterModel } from '../model/chapter-interface';

@Component({
  selector: 'app-edit-chapters',
  templateUrl: './edit-chapters.component.html',
  styleUrls: ['./edit-chapters.component.scss']
})
export class EditChaptersComponent implements OnInit {

  public imagePath;
  public imgURL: any;
  public message: string;
  chapterModel: ChapterModel;
  isImageUpdate: boolean;
  fileIcon: any;
  editedImagePath: any;
  serverResponse: any;
  constructor(public dialogRef: MatDialogRef<EditChaptersComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private service: ApiService,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService,
              private router: Router) {

    this.chapterModel = data;
    console.log(this.chapterModel);
    this.imgURL = this.chapterModel.icon_path;
}

ngOnInit(): void {
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

updateChapter() {
  const file: File = FileList[0];
  const blob = new Blob();
  this.spiner.show();
  const formData: FormData = new FormData();
  if (this.isImageUpdate) {
    formData.append('file', this.fileIcon[0], this.fileIcon[0].name);
  } else {
    formData.append('file', blob, this.fileIcon);
  }
  formData.append('masChapters', JSON.stringify(this.chapterModel));
  this.service.sendPostFormRequest('editChapters', formData).subscribe( (res: any) => {
    this.serverResponse = res;
    this.spiner.hide();
  }, (error) => {
      // console.log(error);
      this.spiner.hide();
      if (error === 'Success') {
        this.destroyDailog();
        Swal.fire('Success',
          'Chapter successfully Updated',
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
  subjectModel(subjectModel: any): string | Blob {
    throw new Error('Method not implemented.');
  }

}
