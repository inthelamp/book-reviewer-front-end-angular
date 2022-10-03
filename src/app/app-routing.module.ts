import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/components/home/home.component';
import { ReviewsComponent } from './modules/reviews/components/reviews/reviews.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '',  redirectTo: '/home', pathMatch: 'full' },
  { path: 'reviews', component: ReviewsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
