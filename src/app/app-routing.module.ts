import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { HomePageComponent } from './home-page/home-page.component';
import { TestComponent } from './test/test.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VideoSessionComponent } from './video-session/video-session.component';

const loggedIn = () => redirectUnauthorizedTo(['']);

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'video', component: TestComponent,},// canActivate: [AngularFireAuthGuard], data: { authGuardPipe: loggedIn } },
  { path: 'dashboard', component: DashboardComponent,},// canActivate: [AngularFireAuthGuard], data: { authGuardPipe: loggedIn } },
  { path: 'session', component: VideoSessionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }