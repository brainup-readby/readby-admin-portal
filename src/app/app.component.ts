import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PreloaderService } from '@core';
import { ConnectionService } from 'ng-connection-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, AfterViewInit {
  isConnected = true;
  constructor(private preloader: PreloaderService,
              private connectionService: ConnectionService,
              private toast: ToastrService) {

      this.connectionService.monitor().subscribe( isConnected => {
            this.isConnected = isConnected;
            if (this.isConnected) {
              this.toast.success('You are online');
            } else {
              this.toast.error('Please check your internet connection' , 'You are offline');
              /* Swal.fire(
                'The Internet?',
                'Please check your internet connection',
                'question'
              ); */
            }
      });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
