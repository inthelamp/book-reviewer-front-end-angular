import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _message: string = "";
  delivered = new BehaviorSubject(false);

  get message() {
    return this._message;
  }

  set message(message: string) {
    this._message = message;
    if (this.delivered.value) {
      this.delivered.next(false);
    }
  }

  clear() {
    this._message = "";
  }

  handleErrorMessage(operation = 'operation') {
    return (error: any) => {
      let errorMessage: string;

      if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
        errorMessage = `${operation} failed. Please try again later.`;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(`Backend returned code ${error.status}, body was: `, error.error);
        errorMessage = `${operation} failed. ${error.error.message}`;
      }

      this._message = errorMessage;
  
      return throwError(() => new Error(errorMessage));
    };
  }
}