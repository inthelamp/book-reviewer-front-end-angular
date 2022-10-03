import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';
import { User, JwtResponse } from  '../../models';
import { environment, httpOptions } from 'src/environments/environment';
import { MessageService, LocalStorageService } from '..';

@Injectable()
export class AuthService {
  private userName: string = "";
  private userStatus = new BehaviorSubject('Inactive'); 
  private authentificated  =  new  BehaviorSubject(false);

  constructor(
    private httpClient: HttpClient, 
    private messageService: MessageService, 
    private localStorageService: LocalStorageService
  ) { }

  private getAccessToken() : string {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    return accessToken != null ?  accessToken : "";
  }

  signUp(user: User): Observable<JwtResponse> {
    return this.httpClient.post<JwtResponse>(`${environment.APP_SERVER_BASE_URL}/users/signup`, user, httpOptions).pipe(
      tap((res: JwtResponse) => {

        if (res.user) {
          localStorage.setItem("ACCESS_TOKEN", res.user.access_token);
          localStorage.setItem("EXPIRES_IN", res.user.token_expires.toString());
          this.localStorageService.saveData("USER_ID", res.user.id, environment.APP_ENCRYPT_KEY + res.user.token_expires.toString());
          this.localStorageService.saveData("ROLE", res.user.role, environment.APP_ENCRYPT_KEY + res.user.token_expires.toString());
          this.authentificated.next(true);
          this.userStatus.next(res.user.status);          
          this.userName = res.user.username;
          this.messageService.message = 'Sucessfully signed up!';
        }
      }),
      catchError(this.messageService.handleErrorMessage('Sign Up'))
    );
  }

  signIn(email: string, password: string): Observable<JwtResponse> {
    return this.httpClient.post<JwtResponse>(`${environment.APP_SERVER_BASE_URL}/users/signin`, { email, password }, httpOptions).pipe(
      tap(async (res: JwtResponse) => { 

        if (res.user) {
          localStorage.setItem("ACCESS_TOKEN", res.user.access_token);
          localStorage.setItem("EXPIRES_IN", res.user.token_expires.toString());
          this.localStorageService.saveData("USER_ID", res.user.id, environment.APP_ENCRYPT_KEY + res.user.token_expires.toString());
          this.localStorageService.saveData("ROLE", res.user.role, environment.APP_ENCRYPT_KEY + res.user.token_expires.toString());     
          this.authentificated.next(true);
          this.userStatus.next(res.user.status);          
          this.userName = res.user.username;
          this.messageService.message = 'Sucessfully signed in!';
        }
      }),
      catchError(this.messageService.handleErrorMessage('Sign In'))
    );
  }
  
  signOut(authString: string, id: string): Observable<any> {
    return this.httpClient.get(`${environment.APP_SERVER_BASE_URL}/users/signout`, { headers: new HttpHeaders ({ authorization: authString, userid: id })}).pipe(
      tap(async (res: any) => { 

        if (res) {
          this.localStorageService.removeData("ACCESS_TOKEN");
          this.localStorageService.removeData("EXPIRES_IN");
          this.localStorageService.removeData("USER_ID");
          this.localStorageService.removeData("ROLE");
          this.authentificated.next(false);
          this.userStatus.next('Inactive');          
          this.userName = "";
          this.messageService.message = 'Sucessfully signed out!';
        }
      }),
      catchError(this.messageService.handleErrorMessage('Sign out'))
    );
  }

  getUserName() : string {
    return this.userName;
  }

  getUserId() : string {
    return this.localStorageService.getData("USER_ID", environment.APP_ENCRYPT_KEY + localStorage.getItem("EXPIRES_IN"));
  } 

  getAuthString() : string {
    return  'token '.concat(this.getAccessToken());
  }

  isAuthenticated() : boolean {
    return this.authentificated.getValue();
  }

  isUserActive() {
    return this.userStatus.getValue() == 'Active' ? true : false;
  }
}
