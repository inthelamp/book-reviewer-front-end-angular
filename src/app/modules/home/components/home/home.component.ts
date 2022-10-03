import { Component, OnInit } from '@angular/core';
import { AuthService, ReviewSubjectService } from 'src/app/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../home.module.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, 
              private reviewSubjectService: ReviewSubjectService) { }

  ngOnInit(): void {
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  isMyReviewSelected() : boolean {
    let myReviewSelected: boolean = false;

    this.reviewSubjectService.myReviewSelected.subscribe((selected) => {
        myReviewSelected = selected;
    });

    return myReviewSelected;
  }

  isOtherReviewSelected() : boolean {
    let otherReviewSelected: boolean = false;

    this.reviewSubjectService.otherReviewSelected.subscribe((selected) => { 
      otherReviewSelected = selected;
    });

    return otherReviewSelected;
  }
}
