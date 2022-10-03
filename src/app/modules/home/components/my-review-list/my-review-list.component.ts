import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, MessageService, ReviewSubject, ReviewSubjectService } from 'src/app/core';

@Component({
  selector: 'app-my-review-list',
  templateUrl: './my-review-list.component.html',
  styleUrls: ['../../home.module.scss']
})
export class MyReviewListComponent implements OnInit {
  myReviewSubjects: ReviewSubject[] | null = null;

  constructor(private router: Router, 
              private authService: AuthService,              
              private reviewSubjectService: ReviewSubjectService, 
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.reviewSubjectService.reviewListChanged.subscribe( changed => {
      if (this.authService.isAuthenticated()) {
        if (changed) {
          this.getMyReviewSubjects();      
          this.reviewSubjectService.reviewListChanged.next(false);
        } else if (!this.myReviewSubjects) {
          this.getMyReviewSubjects();    
        }
      }
    });
  }

  getMyReviewSubjects() : void {
    this.reviewSubjectService.getMyReviewSubjects(this.authService.getAuthString(), this.authService.getUserId()).subscribe(
      res =>  this.myReviewSubjects = res.reviewSubjects
    );
  }

  onClick(id: string) {
    this.messageService.delivered.next(true);
    this.reviewSubjectService.reviewId = id;
    this.reviewSubjectService.setMyReviewSelected(true);
    this.router.navigateByUrl('home');
  }
}
