import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { BoardModel } from '../model/board-interface';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent implements OnInit {

  boardModel: BoardModel;
  constructor(public dialogRef: MatDialogRef<EditBoardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private service: ApiService,
              private spiner: NgxSpinnerService) {

    this.boardModel = data;
}

  ngOnInit(): void {
  }

  destroyDailog() {
  this.dialogRef.close();
  }

  editBoard() {
    this.spiner.show();
    this.boardModel.IS_ACTIVE = 'T';
    this.service.sendPostFormRequest('editBoard', this.boardModel).subscribe( res => {
          this.spiner.hide();
          Swal.fire(
            'Success',
            'Board successfully Updated.',
            'success'
          ).then( okay => {
            if (okay) {
              window.location.reload();
            }
          });
    }, (error) => {
          this.spiner.hide();
          Swal.fire(
            error.split(',')[0],
            error.split(',')[1],
            'error'
          );
    });
  }
}
