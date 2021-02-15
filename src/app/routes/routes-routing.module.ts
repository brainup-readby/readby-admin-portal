import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

import { AdminLayoutComponent } from '../theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '../theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { AuthGuard } from '@core';
import { CoursesComponent } from './courses/courses.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { ChaptersComponent } from './chapters/chapters.component';
import { TopicsComponent } from './topics/topics.component';
import { UsersComponent } from './users/users.component';
import { BoardComponent } from './board/board.component';
import { UsertransComponent } from './usertrans/usertrans.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard', titleI18n: 'dashboard' },
      },
      {
        path: 'courses/management',
        component: CoursesComponent,
        pathMatch: 'full'
      },
      {
        path: 'subjects/management',
        component: SubjectsComponent,
        pathMatch: 'full'
      },
      {
        path: 'chapters/management',
        component: ChaptersComponent,
        pathMatch: 'full'
      },
      {
        path: 'topics/management',
        component: TopicsComponent,
        pathMatch: 'full'
      },
      {
        path: 'users/management',
        component: UsersComponent,
        pathMatch: 'full'
      },
      {
        path: 'board/management',
        component: BoardComponent,
        pathMatch: 'full'
      },
      {
        path: 'user/transcation',
        component: UsertransComponent,
        pathMatch: 'full'
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        data: { title: 'Profile', titleI18n: 'profile' },
      },
      {
        path: 'sessions',
        loadChildren: () => import('./sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Sessions', titleI18n: 'sessions' },
      }
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, data: { title: 'Login', titleI18n: 'login' } },
      {
        path: 'register',
        component: RegisterComponent,
        data: { title: 'Register', titleI18n: 'register' },
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
    }),
  ],
  exports: [RouterModule],
})
export class RoutesRoutingModule {}
