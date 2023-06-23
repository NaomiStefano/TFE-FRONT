import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicComponent } from './components/public/public.component';
import { HomePageComponent } from './components/public/home-page/home-page.component';
import { SignupPageComponent } from './components/public/signup-page/signup-page.component';
import { PrivateComponent } from './components/private/private.component';
import { SessionComponent } from './components/private/session/session.component';
import { ClientComponent } from './components/private/client/client.component';
import { ExerciseComponent } from './components/private/exercise/exercise.component';
import { WorkoutComponent } from './components/private/workout/workout.component';
import { authGuard } from './services/AuthGuard.service';

const routes: Routes = [
  {
    path:'public',
    component:PublicComponent,
    children :[
      {
        path:'home',
        component: HomePageComponent
      },
      {
        path:'signup',
        component:SignupPageComponent
      }
    ]
  },
  {
    path:'private',
    component:PrivateComponent,
    canActivate:[authGuard],
    children:[
      {
        path:'session',
        component:SessionComponent
      },
      {
        path:'client',
        component:ClientComponent
      },
      {
        path:'exercise',
        component:ExerciseComponent
      },
      {
        path:'workout',
        component:WorkoutComponent
      }
    ]
  },
  { path: '', redirectTo: '/public/home', pathMatch: 'full' 
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
