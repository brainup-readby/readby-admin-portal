import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@shared';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-add-year',
  templateUrl: './add-year.component.html',
  styleUrls: ['./add-year.component.scss']
})
export class AddYearComponent implements OnInit {

  addYearModel = new AddYearModel();

  constructor(public dialogRef: MatDialogRef<AddYearComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService,
              private service: ApiService) {

                this.addYearModel.COURSE_ID = data.courseId;
                this.addYearModel.IS_ACTIVE = 't';

               }

  ngOnInit(): void {
  }

  destroyDailog() {
    this.dialogRef.close();
  }


  addMasYear() {
    this.spiner.show();
    this.service.sendPostFormRequest('addYear', this.addYearModel).subscribe( (res: any) => {
      if (res.status === '200') {
        Swal.fire(
          'Success',
          'Year has been add in course .',
          'success'
        ).then( okay => {
          if (okay) {
            window.location.reload();
          }
      });
      }
      // console.log(res);
      this.spiner.hide();
    }, (error) => {
        console.log(error);
        this.spiner.hide();
        if (error === 'Success') {
          this.destroyDailog();
          Swal.fire(
            'Success',
            'Year has been add in course .',
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


export class AddYearModel {
  YEAR?: string;
  DISPLAY_NAME?: string;
  IS_ACTIVE?: string;
  COURSE_ID?: string;
}
