import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ApiService } from '../../shared/services/api.services';
import { LocalStorageService } from '../../shared/services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-usertrans',
  templateUrl: './usertrans.component.html',
  styleUrls: ['./usertrans.component.scss']
})
export class UsertransComponent implements OnInit {

  isLoading = true;
  multiSelectable = true;
  rowSelectable = false;
  hideRowSelectionCheckbox = false;
  showToolbar = true;
  columnHideable = true;
  columnMovable = true;
  rowHover = false;
  rowStriped = false;
  showPaginator = true;
  expandable = false;

  columns: MtxGridColumn[] = [
    { header: 'User Name', field: 'USER_ID', sortable: true, width: '170px'},
    { header: 'First Name', field: 'USER_DETAILS.FIRST_NAME', sortable: true, width: '170px'},
    { header: 'Middle Name', field: 'USER_DETAILS.MIDDLE_NAME', sortable: true, width: '170px'},
    { header: 'Last Name', field: 'USER_DETAILS.LAST_NAME', sortable: true, width: '170px' },
    { header: 'Mobile No', field: 'USER_DETAILS.MOBILE_NO', sortable: true, width: '130px' },
    { header: 'Email Id', field: 'USER_DETAILS.EMAIL_ID', sortable: true, width: '170px'},
    { header: 'Order Id', field: 'ORDER_ID', sortable: true, width: '170px' },
    { header: 'Transcation Id', field: 'TXNID', sortable: true, width: '170px'},
    { header: 'Payment Mode', field: 'PAYMENTMODE', sortable: true, width: '170px'},
    { header: 'Gateway Name', field: 'GATEWAYNAME', sortable: true, width: '170px'},
    { header: 'Course Name', field: 'MAS_COURSE.COURSE_NAME', sortable: true, width: '170px'},
    { header: 'Course Price', field: 'MAS_COURSE.COURSE_PRICE', sortable: true, width: '170px'},
    { header: 'Txn Date', field: 'TXNDATE', sortable: true, width: '170px'},
    { header: 'Currency', field: 'CURRENCY', sortable: true, width: '170px'},
    { header: 'Transcation Amount', field: 'TRANSACTION_AMOUNT', sortable: true, width: '170px'},
    { header: 'Payment Status', field: 'PAYMENT_STATUS', sortable: true, type: 'tag',
    tag: {
      true: { text: 'Process', color: 'green-100' },
      false: { text: 'In-Active', color: 'red-100' },
    } }
  ];

   list = [];

  constructor(private dialog: MatDialog,
              private service: ApiService,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getUserTranscationList();
  }

  getUserTranscationList() {
    this.spiner.show();
    this.service.sendGetRequest('getUserTransactionList').subscribe((res) => {
          this.spiner.hide();
          this.list = res.data;
         // tslint:disable-next-line:prefer-for-of
         /* for (let index = 0; index < res.data.length; index++) {
           const element = {
               courseCode: res.data[index].COURSE_CODE,
               courseId: res.data[index].COURSE_ID,
               courseName: res.data[index].COURSE_NAME,
               boardId: res.data[index].BOARD_ID,
               courseStream: res.data[index].MAS_STREAM.length > 0 ? res.data[index].MAS_STREAM[0].STREAM_NAME : '',
               masStreamCode: res.data[index].MAS_STREAM.length > 0 ? res.data[index].MAS_STREAM[0].STREAM_CODE : '',
               courseType: res.data[index].MAS_COURSE_TYPE !== null ? res.data[index].MAS_COURSE_TYPE.COURSE_TYPE_NAME : '',
               courseTypeId: res.data[index].COURSE_TYPE_ID,
               courseYear: res.data[index].MAS_COURSE_YEAR.length > 0 ? res.data[index].MAS_COURSE_YEAR[0].YEAR : '',
               iconPath: res.data[index].icon_path,
               masCourse: res.data[index].MAS_STREAM,
               masCourseYear: res.data[index].MAS_COURSE_YEAR,
               status: true
           };
         } */
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
