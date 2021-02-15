import { Component, OnInit } from '@angular/core';
import { SubjectModel } from './model/subject-interface';
import { MtxGridColumn } from '@ng-matero/extensions';
import { MatDialog } from '@angular/material/dialog';
import { AddChapterComponent } from './add-chapter/add-chapter.component';
import { EditSubjectComponent } from './edit-subject/edit-subject.component';
import { LocalStorageService } from '@shared';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
  filterSubMdl = new FilterSubModel();
  courseList = [];
  masYearList = [];
  masStreamList = [];
  subjectList = [];
  subjectId: number;
  yearSelected: any;
  boardFilterList = [];
  boardIdSelected: any;
  boardList = [];

  columns: MtxGridColumn[] = [
    { header: 'Subject Code', field: 'SUBJECT_CODE', sortable: true, },
    { header: 'Icon', field: 'icon_path', type: 'image'},
    { header: 'Subject Name', field: 'SUBJECT_NAME', sortable: true, },
    { header: 'Stream Name', field: 'STREAM_NAME', sortable: true, },
    { header: 'Year', field: 'YEAR', sortable: true, },
    { header: 'Status', field: 'IS_ACTIVE', sortable: true, type: 'tag',
    tag: {
      t: { text: 'Active', color: 'green-100' },
      f: { text: 'In-Active', color: 'red-100' },
    } },
    {
      header: 'Operation',
      field: 'operation',
      width: '160px',
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
          tooltip: 'Add Chapter',
          type: 'icon',
          click: record => this.addChapter(record),
        },
      ],
    },
  ];

  subList: SubjectModel[];
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
  isImageUpdate: boolean;
  fileIcon: any;
  imagePath: any;
  editedImagePath: any;
  imgURL: string | ArrayBuffer;
  streamId: any;
  constructor(public dialog: MatDialog,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService,
              private service: ApiService) { }

  ngOnInit(): void {
     this.getSubjectList();
     this.getBoardList();
  }

  getSubjectList() {
    this.spiner.show();
    this.service.sendGetRequest('getSubjectList').subscribe( res => {
          this.subList = res.data;
          console.log(this.subList);
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

  edit(record) {
    this.dialog.open(EditSubjectComponent, {
      data: record,
      disableClose: true
    });
  }

  delete(record: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete subject',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.service.sendDeleteRequest('deleteSubject?subjectId=' + record.SUBJECT_ID)
            .subscribe( res => {
                this.spiner.hide();
                if (res.status === '200') {
                  Swal.fire(
                    'Deleted!',
                    'Subject removed successfully.',
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
          'Subject still in our database.)',
          'error'
        );
      }
    });
  }

  addChapter(record) {
    this.dialog.open(AddChapterComponent, {
      data: record,
      disableClose: true});
  }

  getBoardList() {
    this.service.sendAppGetRequest('getBoardDetail').subscribe( (res) => {
        if (res.data) {
          this.boardFilterList = res.data;
          this.boardFilterList.forEach(brdEl => {
              const json = {
                 BOARD_ID: brdEl.BOARD_ID,
                 BOARD_NAME: brdEl.BOARD_NAME
              };
              this.boardList.push(json);
          });
        }
        console.log(this.boardFilterList);
    });
  }

  onBoardChange(event) {
     this.courseList = [];
     this.masStreamList = [];
     this.subjectList = [];
     this.masYearList = [];
     this.boardFilterList.filter(f => f.BOARD_ID === event.value).forEach(el => {
          el.MAS_COURSE.forEach(element => {
              const courseJson = {
                COURSE_ID: element.COURSE_ID,
                COURSE_NAME: element.COURSE_NAME
              };
              this.courseList.push(element);
          });
     });
  }
  onCourseChange(event) {
     this.masStreamList = [];
     this.subjectList = [];
     this.masYearList = [];
     this.courseList.filter(f => f.COURSE_ID === event.value).forEach(el => {
          el.MAS_STREAM.forEach(element => {
              this.masStreamList.push(element);
          });
          if (el.MAS_COURSE_YEAR !== null && el.MAS_COURSE_YEAR !== undefined) {
            this.masYearList.push(el.MAS_COURSE_YEAR[0]);
            this.yearSelected = this.masYearList[0].YEAR_ID;
          }
     });
  }

  onStreamChange(event) {
    this.streamId = event.value;
  }

  getFilteredSubjectList() {
    this.subList = [];
    this.spiner.show();
    this.service.sendGetRequest('getSubjectByStreamOrYear?streamId=' + this.streamId).subscribe( (res) => {
      this.spiner.hide();
      this.subList = res.data;
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


export class FilterSubModel {
  boardId: number;
  courseId: number;
  streamId: number;
  subjectId: number;
  yearId: number;
}
