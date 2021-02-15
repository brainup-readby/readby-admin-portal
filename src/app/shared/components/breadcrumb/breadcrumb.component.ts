import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '@core/bootstrap/menu.service';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbComponent implements OnInit {
  @Input() currentRoute: string[] = [];

  constructor(private router: Router, private menu: MenuService) {}

  ngOnInit() {
  }

  trackByNavlink(index: number, navlink: string): string {
    return navlink;
  }

  genBreadcrumb() {
  }
}
