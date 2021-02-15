import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MtxGridColumn } from '@ng-matero/extensions';
import { BoardModel } from './model/board-interface';
import { AddBoardComponent } from './add-board/add-board.component';
import { EditBoardComponent } from './edit-board/edit-board.component';
import { ApiService } from '../../shared/services/api.services';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddCourseComponent } from './add-course/add-course.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  columns: MtxGridColumn[] = [
    { header: 'Code', field: 'BOARD_CODE', sortable: true },
    { header: 'Name', field: 'BOARD_NAME', sortable: true },
    {
      header: 'Status',
      field: 'IS_ACTIVE',
      sortable: true,
      type: 'tag',
      tag: {
        true: { text: 'Active', color: 'green-100' },
        false: { text: 'In-Active', color: 'red-100' },
      },
    },
    {
      header: 'Operation',
      field: 'operation',
      width: '160px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          icon: 'mode_edit',
          tooltip: 'Edit Board',
          type: 'icon',
          click: record => this.edit(record),
        },
        {
          icon: 'delete_forever',
          tooltip: 'Delete Board',
          color: 'warn',
          type: 'icon',
          click: record => this.delete(record),
        },
        {
          icon: 'add_circle_outline',
          tooltip: 'Add Course',
          type: 'icon',
          click: record => this.addCourse(record),
        },
      ],
    },
  ];

  list: BoardModel[];
  isLoading = true;
  multiSelectable = true;
  rowSelectable = true;
  hideRowSelectionCheckbox = false;
  showToolbar = true;
  columnHideable = true;
  columnMovable = true;
  rowHover = false;
  rowStriped = false;
  showPaginator = true;
  expandable = false;
  boardList = [];
  constructor(
    public dialog: MatDialog,
    private service: ApiService,
    private spiner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getBoardList();
  }

  getBoardList() {
    this.service.sendGetRequest('getBoardList').subscribe(res => {
      if (res.data) {
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < res.data.length; index++) {
          const json = {
            BOARD_ID: res.data[index].BOARD_ID,
            BOARD_NAME: res.data[index].BOARD_NAME,
            BOARD_CODE: res.data[index].BOARD_CODE,
            IS_ACTIVE: res.data[index].IS_ACTIVE.toUpperCase() === 'T' ? true : false,
          };
          this.boardList.push(json);
        }
      }
      this.list = this.boardList;
    });
  }

  edit(record: any) {
    this.dialog.open(EditBoardComponent, {
      data: record,
      disableClose: true,
    });
  }

  delete(record: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete board',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then(result => {
      if (result.value) {
        this.spiner.show();
        this.service.sendDeleteRequest('deleteBoard?boardId=' + record.BOARD_ID).subscribe(
          res => {
            this.spiner.hide();
            if (res.status === '200') {
              Swal.fire('Deleted!', 'Board removed successfully.', 'success').then(okay => {
                if (okay) {
                  window.location.reload();
                }
              });
            } else {
              Swal.fire('Cancelled!', 'Something went worng, please try later', 'error');
            }
          },
          error => {
            this.spiner.hide();
            Swal.fire(error.split(',')[0], error.split(',')[1], 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Request Cancelled', 'Board still in our database.)', 'error');
      }
    });
  }

  addBoard() {
    this.dialog.open(AddBoardComponent, {
      disableClose: true,
    });
  }
  addCourse(record) {
    this.dialog.open(AddCourseComponent, {
      data: record,
      disableClose: true,
    });
  }
}
