import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from  'rxjs/operators';
import { Observable } from  'rxjs';
import { environment } from 'src/environments/environment';
import { Review } from '../../models';
import { MessageService, ReviewSubjectService } from '..';

@Injectable()
export class ReviewService {

  constructor(private httpClient: HttpClient, 
              private messageService: MessageService, 
              private reviewSubjectService: ReviewSubjectService) { }

  // Saving review content into server database
  save(review: Review, authString: string, userId: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.APP_SERVER_BASE_URL}/reviews/save`, review, { headers: new HttpHeaders ({ authorization: authString, userid: userId })}).pipe(
      tap(async _ => {
        console.log("Saving is processed!");    
        this.reviewSubjectService.setMyReviewSelected(true);
        this.reviewSubjectService.reviewListChanged.next(true);
      }),
      catchError(this.messageService.handleErrorMessage('Saving draft')),
    );
  }

  // Updating review, "Content-Type": "multipart/form-data" is set automatically by Angular
  update(formData: FormData, authString: string, userId: string) : Observable<any> {
    return this.httpClient.post<any>(`${environment.APP_SERVER_BASE_URL}/reviews/update`, formData, { headers: new HttpHeaders ({ authorization: authString, userid: userId })}).pipe(
      tap(async _ => {
        console.log("Updating is processed!");
        this.reviewSubjectService.setMyReviewSelected(true);
        this.reviewSubjectService.reviewListChanged.next(true);
      }),
      catchError(this.messageService.handleErrorMessage('Updating review'))
    );
  }

  // Deleting review
  delete(id: string, authString: string, userId: string) : Observable<any> {
    return this.httpClient.delete<any>(`${environment.APP_SERVER_BASE_URL}/reviews/delete`, { headers: new HttpHeaders ({ authorization: authString, userid: userId, id: id })}).pipe(
      tap(async _ => {
        console.log("Deleting is processed!");
        this.reviewSubjectService.myReviewSelected.next(false);
        this.reviewSubjectService.otherReviewSelected.next(false);
        this.reviewSubjectService.reviewListChanged.next(true);
      }),
      catchError(this.messageService.handleErrorMessage('Deleting review'))
    );
  }

  // Updating review status
  changeStatus(id: string, status: string, authString: string, userId: string) : Observable<any> {
    return this.httpClient.patch<any>(`${environment.APP_SERVER_BASE_URL}/reviews/changeStatus`, { status }, { headers: new HttpHeaders ({ authorization: authString, userid: userId, id: id })}).pipe(
      tap(async _ => {
        console.log("Changing status is processed!");
      }),
      catchError(this.messageService.handleErrorMessage('Changing status'))
    );
  }

  // Getting review the user posted
  getMyReview(id: string, authString: string, userId: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.APP_SERVER_BASE_URL}/reviews/myreview`, { headers: new HttpHeaders ({ authorization: authString, userid: userId, id: id })}).pipe(
      tap(async _ => {
        console.log('Sucessfully get my review!');
      }),
      catchError(this.messageService.handleErrorMessage('Getting my review'))
    );
  }

  // Getting review
  getReview(id: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.APP_SERVER_BASE_URL}/reviews/reviews/${id}`).pipe(
      tap(async _ => {
        console.log('Sucessfully get a review!');
      }),
      catchError(this.messageService.handleErrorMessage('Getting a review'))
    );
  }
}
