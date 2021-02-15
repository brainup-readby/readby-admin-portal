import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MtxGridColumn } from '@ng-matero/extensions';
import { UserModel } from './model/user-interface';
import { ApiService } from '../../shared/services/api.services';
import { LocalStorageService } from '../../shared/services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  columns: MtxGridColumn[] = [
    { header: 'User Name', field: 'USERNAME', sortable: true, showExpand: true },
    { header: 'Name', field: 'FIRST_NAME', sortable: true},
    { header: 'Email Id', field: 'EMAIL_ID', sortable: true, },
    { header: 'Mobile No', field: 'MOBILE_NO', sortable: true, },
    { header: 'Device Id', field: 'DEVICE_ID', sortable: true, },
    { header: 'State', field: 'STATE', sortable: true, },
    { header: 'City', field: 'CITY', sortable: true, },
    { header: 'Pincode', field: 'PINCODE', sortable: true},
    { header: 'Logout', field: 'logout', sortable: true},
    { header: 'Status', field: 'IS_ACTIVE',  type: 'tag',
    tag: {
      true: { text: 'Active', color: 'green-100' },
      false: { text: 'In-Active', color: 'red-100' },
    } }
  ];
  nestedColumn: MtxGridColumn[] = [
    { header: 'SUBSCRIPTION ID', field: 'SUBSCRIPTION_ID', sortable: true, },
    { header: 'INSTITUTION NAME', field: 'INSTITUTION_NAME', sortable: true},
    { header: 'EXPIRED', field: 'IS_EXPIRED', type: 'tag',
    tag: {
      n: { text: 'No', color: 'green-100' },
      y: { text: 'Yes', color: 'red-100' },
    } },
    { header: 'STATUS', field: 'IS_ACTIVE',  type: 'tag',
    tag: {
      t: { text: 'Active', color: 'green-100' },
      f: { text: 'In-Active', color: 'red-100' },
    } }
  ];

  userlist: UserModel[];
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
  constructor(private dialog: MatDialog,
              private service: ApiService,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.spiner.show();
    this.service.sendGetRequest('getUserList').subscribe((res) => {
          this.spiner.hide();
          this.userlist = res.data;
          console.log(this.userlist);
    }, (error) => {
       this.spiner.hide();
       Swal.fire(
         error.split(',')[0],
         error.split(',')[1],
         'error'
       );
     });
 }

 logoutUser(mobileNo: any) {
  this.spiner.show();
  this.service.sendGetRequest('getLogoutDetail?mobileNo=' + mobileNo).subscribe((res) => {
        this.spiner.hide();
        if (res.status === '200') {
          Swal.fire(
            'Success',
            'User Successfully Logout',
            'success'
          );
        }
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
