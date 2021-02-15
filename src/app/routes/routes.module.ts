import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { CoursesComponent } from './courses/courses.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { ChaptersComponent } from './chapters/chapters.component';
import { TopicsComponent } from './topics/topics.component';
import { UsersComponent } from './users/users.component';
import { BoardComponent } from './board/board.component';
import { AddSubjectComponent } from './courses/add-subject/add-subject.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditSubjectComponent } from './subjects/edit-subject/edit-subject.component';
import { AddChapterComponent } from './subjects/add-chapter/add-chapter.component';
import { EditChaptersComponent } from './chapters/edit-chapters/edit-chapters.component';
import { AddTopicComponent } from './chapters/add-topic/add-topic.component';
import { EditTopicComponent } from './topics/edit-topic/edit-topic.component';
import { AddBoardComponent } from './board/add-board/add-board.component';
import { EditBoardComponent } from './board/edit-board/edit-board.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsertransComponent } from './usertrans/usertrans.component';
import { NumberDirective } from '../shared/directives/numbers-only.directive';
import { AddCourseComponent } from './board/add-course/add-course.component';
import { EditCourseComponent } from './courses/edit-course/edit-course.component';
import { AddStreamComponent } from './courses/add-stream/add-stream.component';
import { AddYearComponent } from './courses/add-year/add-year.component';

const COMPONENTS = [DashboardComponent, LoginComponent, RegisterComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    SharedModule,
    RoutesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC,
    CoursesComponent, SubjectsComponent, ChaptersComponent,
    TopicsComponent, UsersComponent, BoardComponent, EditCourseComponent,
    AddSubjectComponent, EditSubjectComponent, AddChapterComponent, EditChaptersComponent,
    AddTopicComponent, EditTopicComponent, AddBoardComponent, EditBoardComponent, UsertransComponent, NumberDirective,
    AddCourseComponent,
    AddStreamComponent,
    AddYearComponent],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class RoutesModule {}
