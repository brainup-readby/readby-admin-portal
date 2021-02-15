import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';

import { ApiService } from '../../shared/services/api.services';
import { DashboardStats } from './model-interface/dashboard-interface';
import { LocalStorageService } from '../../shared/services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
      .mat-raised-button {
        margin-right: 8px;
        margin-top: 8px;
      }
    `,
  ],
  providers: [ApiService, LocalStorageService],
})
export class DashboardComponent implements OnInit {
  dashboardStatList = [];
  dashStats: DashboardStats[];
  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private localStorage: LocalStorageService,
    private spiner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.getDashboardView();
    this.getCourseType();
    this.getBoardType();
    this.getMasStreamList();
    this.getMasStreamYears();
  }

  getDashboardView() {
    this.spiner.show();
    this.apiService.sendGetRequest('getDashBoardDetail').subscribe( res => {
      const dashboardData = res.data;
      const objLen = Object.keys(dashboardData).length;
      for (let index = 0; index < objLen; index++) {
        const key = Object.keys(dashboardData);
        const values = Object.values(dashboardData);
        const jsonObj = {
           title: key[index],
           value: values[index],
           iconName: this.getIconNameOfStat(key[index])
        };
        this.dashboardStatList.push(jsonObj);
      }
      this.dashStats = this.dashboardStatList;
      this.spiner.hide();
    }, (error) => {
      this.spiner.hide();
      console.log(error);
    });
  }

  getIconNameOfStat(labelName: string): string{
     switch (labelName) {

          case 'Total Users' :
              return 'grpusers';

          case 'Total Courses' :
              return 'courses';

          case 'Total Subjects' :
              return 'subjects';

          case 'Total Chapter' :
              return 'chapters';

          case 'Total Topic' :
              return 'topics';

     }
  }

  getCourseType() {
    this.spiner.show();
    this.apiService.sendGetRequest('getCourseType').subscribe( (res) => {

         const json = res.data;
         this.localStorage.set('courseType', json);
         this.spiner.hide();
    }, (error) => this.spiner.hide());
  }
  getBoardType() {
    this.spiner.show();
    this.apiService.sendGetRequest('getBoardList').subscribe( (res) => {

         const json = res.data;
         this.localStorage.set('boardType', json);
         this.spiner.hide();
    }, (error) => this.spiner.hide());
  }

  getMasStreamList() {
    this.spiner.show();
    this.apiService.sendGetRequest('getMasStreamList').subscribe( (res) => {

         const json = res.data;
         this.localStorage.set('MasStreamList', json);
         this.spiner.hide();
    }, (error) => this.spiner.hide());
  }

  getMasStreamYears() {
    this.spiner.show();
    this.apiService.sendGetRequest('getMasYearList').subscribe( (res) => {

         const json = res.data;
         this.localStorage.set('MasStreamYear', json);
         this.spiner.hide();
    }, (error) => this.spiner.hide());
  }



}
