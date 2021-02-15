import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MtxGridColumn } from '@ng-matero/extensions';
import { ChapterModel } from './model/chapter-interface';
import { EditChaptersComponent } from './edit-chapters/edit-chapters.component';
import { AddTopicComponent } from './add-topic/add-topic.component';
import { LocalStorageService } from '@shared';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FilterChpModel } from './model/filter.chapter.model';
@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss']
})
export class ChaptersComponent implements OnInit {

  filterChpMdl = new FilterChpModel();
  boardList = [];
  boardFilterList = [];
  boardIdSelected: any;
  courseList = [];
  masYearList = [];
  masStreamList = [];
  subjectList = [];
  subjectId: number;
  yearSelected: any;
  columns: MtxGridColumn[] = [
    { header: 'Chapter Code', field: 'CHAPTER_CODE', sortable: true, },
    { header: 'Icon', field: 'icon_path', type: 'image'},
    { header: 'Chapter Name', field: 'CHAPTER_NAME', sortable: true, },
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
          tooltip: 'Add Topic',
          type: 'icon',
          click: record => this.add(record),
        },
      ],
    },
  ];

  chapterList: ChapterModel[];
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
  constructor(public dialog: MatDialog,
              private service: ApiService,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getChapterList();
    this.getBoardList();
  }

  getChapterList() {
    this.spiner.show();
    this.service.sendGetRequest('getChapterList').subscribe((res) => {
          this.spiner.hide();
          this.chapterList = res.data;
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
    this.dialog.open(EditChaptersComponent, {
      data: record,
      disableClose: true
    });
  }

  delete(record: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete chapter',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.spiner.show();
        this.service.sendDeleteRequest('deleteChapter?chapterId=' + record.CHAPTER_ID)
            .subscribe( res => {
                this.spiner.hide();
                if (res.status === '200') {
                  Swal.fire(
                    'Deleted!',
                    'Chapter removed successfully.',
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
          'Chapter still in our database.)',
          'error'
        );
      }
    });
  }

  add(record) {
    this.dialog.open(AddTopicComponent, {
      data:  record,
      disableClose: true
    });
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
    this.subjectList = [];
    this.service.sendGetRequest('getSubjectByStreamOrYear?streamId=' + event.value).subscribe( (res) => {
          this.subjectList = res.data;
    });
  }

  onSubjectChange(event) {
    this.subjectId = event.value;
  }

  getFilteredChapterList() {
    this.chapterList = [];
    this.spiner.show();
    this.service.sendGetRequest('getChaptersBySubject?subjectId=' + this.subjectId).subscribe( (res) => {
      this.spiner.hide();
      this.chapterList = res.data;
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
