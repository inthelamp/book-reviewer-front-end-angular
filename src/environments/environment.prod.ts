import { HttpHeaders } from '@angular/common/http';

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

export const environment = {
  production: true,
  APP_SERVER_BASE_URL: 'http://127.0.0.1:5000',
  APP_TITLE: 'Book Reviewer',
  APP_COOKIE_SUSTAINING_HOURS: 1,
  APP_SUBJECT_MAX_SIZE: 50,
  APP_PASSWORD_REGEX: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$', //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  APP_ENCRYPT_KEY: 'mZkZoEbfHYlKe/c39IPrpSjPb6qv8qAi',
};
