import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { TutorDashboardComponent } from './pages/tutor-dashboard/tutor-dashboard.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';
import { TutorProfileComponent } from './pages/tutor-profile/tutor-profile.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { VideoCallComponent } from './pages/video-call/video-call.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },            // 👈 landing por defecto
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'student/dashboard', component: StudentDashboardComponent },
  { path: 'student/profile', component: StudentProfileComponent },

  { path: 'tutor/dashboard', component: TutorDashboardComponent },
  { path: 'tutor/profile', component: TutorProfileComponent },

  { path: 'calendar', component: CalendarComponent },
  { path: 'checkout/:id', component: CheckoutComponent },
  { path: 'video-call', component: VideoCallComponent },

  { path: '**', redirectTo: '' },
];
