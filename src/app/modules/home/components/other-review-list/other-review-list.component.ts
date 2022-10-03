import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewSubject, ReviewSubjectService, MessageService, AuthService } from 'src/app/core';

@Component({
  selector: 'app-other-review-list',
  templateUrl: './other-review-list.component.html',
  styleUrls: ['../../home.module.scss']
})

export class OtherReviewListComponent implements OnInit {
  otherReviewSubjects: ReviewSubject[] | null = null;

  constructor(private router: Router,       
              private authService: AuthService,
              private reviewSubjectService: ReviewSubjectService, 
              private messageService: MessageService) { }

  ngOnInit(): void {
     this.reviewSubjectService.reviewListChanged.subscribe( changed => {
      if (changed) {
        this.getOtherReviewSubjects();      
        this.reviewSubjectService.reviewListChanged.next(false);
      } else if (!this.otherReviewSubjects) {
        this.getOtherReviewSubjects();    
      }
    });
  }

  getOtherReviewSubjects() : void {
    const userId = this.authService.isAuthenticated() ? this.authService.getUserId() : '' ;
    this.reviewSubjectService.getOtherReviewSubjects(userId).subscribe(
      res =>  this.otherReviewSubjects = res.otherReviewSubjects
    );
  }

  onClick(id: string) {
    this.messageService.delivered.next(true);
    this.reviewSubjectService.reviewId = id;
    this.reviewSubjectService.setOtherReviewSelected(true);
    this.router.navigateByUrl('home');
  }
}