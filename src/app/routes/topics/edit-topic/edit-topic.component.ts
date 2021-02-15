import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '@shared';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { TopicModel } from '../model/topic-interface';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.scss']
})
export class EditTopicComponent implements OnInit {

  public imagePath;
  public imgURL: any;
  public message: string;
  topicModel: TopicModel;
  isImageUpdate: any;
  fileIcon: any;
  editedImagePath: any;
  serverResponse: any;
  constructor(public dialogRef: MatDialogRef<EditTopicComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private service: ApiService,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService,
              private router: Router) {

    this.topicModel = data;
    this.topicModel.IS_ACTIVE = 't';
    this.topicModel.VIDEO_URL = data.VIDEO_URL;
    this.imgURL = data.icon_path;
    this.topicModel.TOPIC_SUBSCRIPTION = data.TOPIC_SUBSCRIPTION;
}

ngOnInit(): void {
}

destroyDailog() {
this.dialogRef.close();
}

onSubmit() {
console.log(this.topicModel);
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

updateTopic() {
  this.spiner.show();
  const blob = new Blob();
  const formData: FormData = new FormData();
  delete this.topicModel.icon_path;
  if (this.isImageUpdate) {
    formData.append('file', this.fileIcon[0], this.fileIcon[0].name);
  } else {
    formData.append('file', blob, this.fileIcon);
  }
  formData.append('masTopics', JSON.stringify(this.topicModel));
  this.service.sendPostFormRequest('editTopics', formData).subscribe( (res: any) => {
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

}
