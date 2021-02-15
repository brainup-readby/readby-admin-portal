import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { BoardModel } from '../model/board-interface';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.scss']
})
export class AddBoardComponent implements OnInit {

  @ViewChild('addBoardForm', {static: false}) addBoardForm: NgForm;
  boardModel = {
    BOARD_CODE: '',
    BOARD_NAME: '',
    IS_ACTIVE: 'T'
  };

  constructor(public dialogRef: MatDialogRef<AddBoardComponent>,
              public dialog: MatDialog, private service: ApiService,
              private spiner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  destroyDailog() {
    this.dialogRef.close();
  }

  addBoard() {
    this.spiner.show();
    this.service.sendPostFormRequest('saveBoard', this.boardModel).subscribe( res => {
          this.spiner.hide();
          Swal.fire(
            'Success',
            'Board successfully added.',
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
