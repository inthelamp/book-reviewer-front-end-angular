import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReviewsComponent } from './components/reviews/reviews.component';

@NgModule({
  declarations: [
    ReviewsComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ReviewsModule { }
