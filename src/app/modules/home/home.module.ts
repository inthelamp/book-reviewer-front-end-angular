import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeRoutingModule } from './home.routing.module';
import { HomeComponent, OtherReviewListComponent, ReviewDraftComponent, ReviewEditComponent, ReviewBrowseComponent} from './components';
import { AuthService, AuthGuardService, ReviewService, QuillService } from 'src/app/core';
import { MyReviewListComponent } from './components/my-review-list/my-review-list.component';

@NgModule({
  declarations: [HomeComponent, ReviewDraftComponent, ReviewEditComponent, ReviewBrowseComponent, MyReviewListComponent, OtherReviewListComponent],
  providers: [AuthService, AuthGuardService, ReviewService, QuillService],
  imports: [ 
    SharedModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
