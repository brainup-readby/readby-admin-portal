import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MenuService } from '@core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidemenuComponent {
  // NOTE: Ripple effect make page flashing on mobile
  @Input() ripple = false;

  menus = this.menu.getAll();

  menuItems = [
    {
        route: 'dashboard',
        name: 'dashboard',
        type: 'link',
        icon: 'dashboard',
        color: 'red-500',
        value: '5'
    },
    {
      route: 'board/management',
      name: 'Board Management',
      type: 'link',
      icon: 'developer_board',
      color: 'red-500',
      value: '5'
  },
    {
        route: 'courses/management',
        name: 'Course Management',
        type: 'link',
        icon: 'local_library',
        color: 'red-500',
        value: '5'
    },
    {
        route: 'subjects/management',
        name: 'Subjects Management',
        type: 'link',
        icon: 'subtitles',
        color: 'red-500',
        value: '5'
    },
    {
        route: 'chapters/management',
        name: 'Chapter Management',
        type: 'link',
        icon: 'menu_book',
        color: 'red-500',
        value: '5'
    },
    {
        route: 'topics/management',
        name: 'Topic Management',
        type: 'link',
        icon: 'list_alt',
        color: 'red-500',
        value: '5'
    },
    {
        route: 'users/management',
        name: 'User Management',
        type: 'link',
        icon: 'group',
        color: 'red-500',
        value: '5'
    },
    {
        route: 'user/transcation',
        name: 'User Transcation',
        type: 'link',
        icon: 'assessment',
        color: 'red-500',
        value: '5'
    }
  ];

  constructor(private menu: MenuService) {}

  // Delete empty values and rebuild route
  buildRoute(routes: string[]) {
    let route = '';
    routes.forEach(item => {
      if (item && item.trim()) {
        route += '/' + item.replace(/^\/+|\/+$/g, '');
      }
    });
    return route;
  }
}
