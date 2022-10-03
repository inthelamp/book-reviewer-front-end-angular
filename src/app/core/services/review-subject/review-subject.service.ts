import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { environment, httpOptions } from 'src/environments/environment';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewSubjectService {
  // Review id
  reviewId : string | null = null;

  myReviewSelected = new  BehaviorSubject(false);
  otherReviewSelected = new BehaviorSubject(false); 
  reviewListChanged = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient, private messageService: MessageService) { }

  initialize() {
    this.reviewId = null;
    this.myReviewSelected.next(false);
    this.otherReviewSelected.next(false);
    this.reviewListChanged.next(false);
  }

  setMyReviewSelected(myReviewSelected: boolean) {
    this.myReviewSelected.next(myReviewSelected);
    this.otherReviewSelected.next (!myReviewSelected);
  }

  setOtherReviewSelected(reviewSelected: boolean) {
    this.otherReviewSelected.next(reviewSelected);
    this.myReviewSelected.next (!reviewSelected);
  }

  getMyReviewSubjects(authString: string, userId: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.APP_SERVER_BASE_URL}/reviews/myReviewSubjects`, { headers: new HttpHeaders ({ authorization: authString, userid: userId })}).pipe(
      tap(async _ => {
        console.log('Sucessfully got my review subjects!');
      }),
      catchError(this.messageService.handleErrorMessage('Getting a list of my reviews'))
    );
  }

  getOtherReviewSubjects(userId: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.APP_SERVER_BASE_URL}/reviews/OtherReviewSubjects`, { headers: new HttpHeaders ({ userid: userId })}).pipe(
      tap(async _ => {
        console.log('Sucessfully got review subjects!');
      }),
      catchError(this.messageService.handleErrorMessage('Getting a list of reviews'))
    );
  }
}
