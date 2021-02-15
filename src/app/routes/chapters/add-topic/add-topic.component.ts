import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@shared';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AddTopicModel } from './model/topic.model';

@Component({
  selector: 'app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss']
})
export class AddTopicComponent implements OnInit {

  public imagePath;
  public imgURL: any;
  public message: string;
  fileIcon: any;
  topicModel = new AddTopicModel();
  constructor(public dialogRef: MatDialogRef<AddTopicComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService,
              private service: ApiService) {
           this.topicModel.CHAPTER_ID = data.CHAPTER_ID;
           this.topicModel.IS_ACTIVE = 't';
    }

  ngOnInit(): void {
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

  addTopic() {
    this.spiner.show();
    const formData: FormData = new FormData();
    formData.append('file', this.fileIcon[0], this.fileIcon[0].name);
    formData.append('masTopics', JSON.stringify(this.topicModel));
    this.service.sendPostFormRequest('addTopics', formData).subscribe( (res: any) => {
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

}
