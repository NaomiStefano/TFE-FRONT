import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupPageComponent } from './components/public/signup-page/signup-page.component';
import { HomePageComponent } from './components/public/home-page/home-page.component';
import { PublicComponent } from './components/public/public.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from './_modules/@primeng.module';
import { SessionComponent } from './components/private/session/session.component';
import { PrivateComponent } from './components/private/private.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MyTitleComponent } from './components/shared/my-title/my-title.component';
import { ClientComponent } from './components/private/client/client.component';
import { ExerciseComponent } from './components/private/exercise/exercise.component';
import { WorkoutComponent } from './components/private/workout/workout.component';
import { MyTableComponent } from './components/shared/my-table/my-table.component';
import { ApiCallService } from './services/api-call.service';
import { StaminaService } from './services/stamina.service';
import { HttpClientModule } from '@angular/common/http';
import {  DatePipe } from '@angular/common';
import { ExerciseFormComponent } from './components/private/exercise/exercise-form/exercise-form.component';
import { SessionFormComponent } from './components/private/session/session-form/session-form.component';
import { DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MySkeletonComponent } from './components/shared/my-skeleton/my-skeleton.component';
import { ProgramComponent } from './components/private/program/program.component';
import { HistoryComponent } from './components/private/program/history/history.component';
import { FilterByTypePipe } from './_pipes/filter-by-type.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PublicComponent,
    HomePageComponent,
    SignupPageComponent,
    SessionComponent,
    PrivateComponent,
    MyTitleComponent,
    ClientComponent,
    ExerciseComponent,
    WorkoutComponent,
    SessionFormComponent,
    ExerciseFormComponent,
    MyTableComponent,
    MySkeletonComponent,
    ProgramComponent,
    HistoryComponent,
    FilterByTypePipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    AppRoutingModule,
    DynamicDialogModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatSidenavModule
  ],
  providers: [
    ApiCallService,
    StaminaService,
    DatePipe
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
