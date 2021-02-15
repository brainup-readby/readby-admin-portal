import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridColumn } from '@ng-matero/extensions';
import { MatDialog } from '@angular/material/dialog';
import { AddSubjectComponent } from './add-subject/add-subject.component';
import { CourseModel } from './model/course-interface';
import { ApiService } from '../../shared/services/api.services';
import { LocalStorageService } from '../../shared/services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NavigationEnd, Router } from '@angular/router';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { AddStreamComponent } from './add-stream/add-stream.component';
import { AddYearComponent } from './add-year/add-year.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courseModel: CourseModel[];
  @ViewChild('statusCourse', { static: true }) statusCourse: TemplateRef<any>;
  columns: MtxGridColumn[] = [
    { header: 'Code', field: 'courseCode', sortable: true },
    { header: 'Board', field: 'boardName', sortable: true },
    { header: 'Name', field: 'courseName', sortable: true},
    { header: 'Image', field: 'iconPath', type: 'image'},
    /* { header: 'Year', field: 'courseYear', sortable: true, },
    { header: 'Stream', field: 'courseStream', sortable: true, }, */
    { header: 'Type', field: 'courseType', sortable: true },
    { header: 'Status', field: 'status', sortable: true, type: 'tag',
    tag: {
      true: { text: 'Active', color: 'green-100' },
      false: { text: 'In-Active', color: 'red-100' },
    } },
    {
      header: 'Operation',
      field: 'operation',
      width: '240px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          icon: 'mode_edit',
          tooltip: 'Edit Course',
          type: 'icon',
          click: record => this.edit(record),
        },
        {
          icon: 'delete_forever',
          tooltip: 'Delete Course',
          color: 'warn',
          type: 'icon',
          click: record => this.delete(record),
        },
        {
          icon: 'add_circle_outline',
          tooltip: 'Add Subject',
          type: 'icon',
          click: record => this.addSubject(record),
        },
        {
          icon: 'add_circle_outline',
          tooltip: 'Add Stream',
          type: 'icon',
          click: record => this.addStream(record),
        },
        {
          icon: 'add_circle_outline',
          tooltip: 'Add Year',
          type: 'icon',
          click: record => this.addYear(record),
        },
      ],
    },
  ];
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
  courseList = [];
  courseTypeList = [];
  mySubscription: any;
  constructor(private dialog: MatDialog,
              private service: ApiService,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService,
              private router: Router) {
              this.getCourseList();
              this.courseTypeList = this.localStorage.get('courseType');
  }

  ngOnInit(): void {
  }

  getCourseList() {
     this.spiner.show();
     this.service.sendGetRequest('getCourseList').subscribe((res) => {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < res.data.length; index++) {
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
                status: res.data[index].IS_ACTIVE === 'f' ? false : true,
                boardName: res.data[index].BOARD_NAME,
                coursePrice: res.data[index].COURSE_PRICE
            };
            this.courseList.push(element);
          }
          this.courseModel = this.courseList;
          this.spiner.hide();
     }, (error) => {
        this.spiner.hide();
        Swal.fire(
          error.split(',')[0],
          error.split(',')[1],
          'error'
        );
      });
  }

  edit(record: any) {
    console.log(record);
    this.dialog.open(EditCourseComponent, {
      data: {
        selectedData: record,
        isUpdate: true
      },
      disableClose: true
    });
  }

  delete(record: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete course',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.service.sendGetRequest('deleteCourse?courseId=' + record.courseId)
            .subscribe( res => {
                this.spiner.hide();
                if (res.status === '200') {
                  this.getCourseList();
                  Swal.fire(
                    'Deleted!',
                    'Course removed successfully.',
                    'success'
                  ).then( okay => {
                    if (okay) {
                      window.location.reload();
                    }
                });
                } else {
                  Swal.fire(
                    'Cancelled!',
                    'Something went worng, please try later',
                    'error'
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
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Course still in our database.)',
          'error'
        );
      }
    });
  }

  addSubject(record: any) {
    this.dialog.open(AddSubjectComponent, {
      data: record,
      disableClose: true
    });
  }

  addCourse() {
    this.dialog.open(EditCourseComponent, {
      data: {
        selectedData: null,
        isUpdate: false
      },
      height: 'auto',
      disableClose: true
    });
  }

  addStream(record) {
    this.dialog.open(AddStreamComponent, {
      data: record,
      height: 'auto',
      disableClose: true
    });
  }
  addYear(record) {
    this.dialog.open(AddYearComponent, {
      data: record,
      height: 'auto',
      disableClose: true
    });
  }
}
