import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MtxGridColumn } from '@ng-matero/extensions';
import { TopicModel } from './model/topic-interface';
import { EditTopicComponent } from './edit-topic/edit-topic.component';
import { LocalStorageService } from '@shared';
import { ApiService } from '@shared/services/api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FilterModel } from './model/topic-filter.model';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  @ViewChild('pdfLinkTpl') pdfLinkTpl: TemplateRef<any>;
  filterMdl = new FilterModel();
  boardFilterList = [];
  boardIdSelected: any;
  courseList = [];
  masStreamList = [];
  masYearList = [];
  subjectList = [];
  chapterList = [];
  chapterId: number;
  yearSelected: any;
  columns: MtxGridColumn[] = [
    { header: 'Topic Code', field: 'TOPIC_CODE', sortable: true},
    { header: 'Icon', field: 'icon_path', type: 'image'},
    { header: 'Pdf Link', field: 'BOOK_URL'},
    { header: 'Video Link', field: 'VIDEO_URL'},
    { header: 'Topic Name', field: 'TOPIC_NAME', sortable: true },
    { header: 'Subscription', field: 'TOPIC_SUBSCRIPTION', sortable: true, type: 'tag',
    tag: {
      p: { text: 'Paid', color: 'green-100' },
      f: { text: 'Free', color: '0xff229ff7' },
    } },
    { header: 'Status', field: 'IS_ACTIVE', sortable: true, type: 'tag',
    tag: {
      t: { text: 'Active', color: 'green-100' },
      f: { text: 'In-Active', color: 'red-100' },
    } },
    {
      header: 'Operation',
      field: 'operation',
      width: '140px',
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
          pop: true,
          popTitle: 'Are you sure want to delete topic ?',
          click: record => this.delete(record),
        }
      ],
    },
  ];

  topocList: TopicModel[];
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
  constructor(public dialog: MatDialog,
              private service: ApiService,
              private localStorage: LocalStorageService,
              private spiner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getTopicList();
    this.getBoardList();
  }



  getTopicList() {
    this.spiner.show();
    this.service.sendGetRequest('getTopicList').subscribe( res => {
          this.topocList = res.data;
          console.log(this.topocList);
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
    this.dialog.open(EditTopicComponent, {
      data: record,
      disableClose: true
    });
  }


  delete(record) {
     this.spiner.show();
     this.service.sendDeleteRequest('deleteTopic?topicId=' + record.TOPIC_ID).subscribe((res) => {
            this.spiner.hide();
            if (res.status === '200') {
              Swal.fire(
                'Topic!',
                'Topic removed successfully.',
                'success'
              ).then( okay => {
                if (okay) {
                  window.location.reload();
                }
            });
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
     this.chapterList = [];
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
     this.chapterList = [];
     this.courseList.filter(f => f.COURSE_ID === event.value).forEach(el => {
          el.MAS_STREAM.forEach(element => {
              this.masStreamList.push(element);
          });
          if (el.MAS_COURSE_YEAR !== null && el.MAS_COURSE_YEAR !== undefined) {
            this.masYearList.push(el.MAS_COURSE_YEAR[0]);
            this.yearSelected = this.masYearList[0].YEAR_ID;
          }
          // console.log(this.masYearList);
     });
  }

  onStreamChange(event) {
    this.subjectList = [];
    this.chapterList = [];
    this.service.sendGetRequest('getSubjectByStreamOrYear?streamId=' + event.value).subscribe( (res) => {
          this.subjectList = res.data;
    });
  }

  onSubjectChange(event) {
    this.chapterList = [];
    this.service.sendGetRequest('getChaptersBySubject?subjectId=' + event.value).subscribe( (res) => {
      this.chapterList = res.data;
    });
  }

  onChapterChange(event) {
      this.chapterId = event.value;
  }

  getFilteredTopicList() {
    this.topocList = [];
    this.spiner.show();
    this.service.sendGetRequest('getTopicsByChapter?chapterId=' + this.chapterId).subscribe( (res) => {
      this.spiner.hide();
      this.topocList = res.data;
      // tslint:disable-next-line:no-string-literal
      this.topocList['CourseYear'] = this.yearSelected;
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
