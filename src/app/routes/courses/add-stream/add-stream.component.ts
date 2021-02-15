import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@shared';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddSubjectComponent } from '../add-subject/add-subject.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-add-stream',
  templateUrl: './add-stream.component.html',
  styleUrls: ['./add-stream.component.scss']
})
export class AddStreamComponent implements OnInit {

  addStreamModel = new AddStreamModel();

  constructor(public dialogRef: MatDialogRef<AddSubjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService,
              private service: ApiService) {

                this.addStreamModel.COURSE_ID = data.courseId;
                this.addStreamModel.IS_ACTIVE = 't';

               }

  ngOnInit(): void {
  }

  destroyDailog() {
    this.dialogRef.close();
  }


  addStream() {
    this.spiner.show();
    this.service.sendPostFormRequest('addStream', this.addStreamModel).subscribe( (res: any) => {
      if (res.status === '200') {
        Swal.fire(
          'Success',
          'Stream has been add in course .',
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
            'Stream has been add in course .',
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


export class AddStreamModel {
  STREAM_CODE?: string;
  STREAM_NAME?: string;
  IS_ACTIVE?: string;
  COURSE_ID?: string;
}
