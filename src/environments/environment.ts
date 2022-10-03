// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { HttpHeaders } from '@angular/common/http';

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

export const environment = {
  production: false,
  APP_SERVER_BASE_URL: 'http://127.0.0.1:5000',
  APP_TITLE: 'Book Reviewer',
  APP_COOKIE_SUSTAINING_HOURS: 1,
  APP_SUBJECT_MAX_SIZE: 50,
  APP_PASSWORD_REGEX: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$', //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  APP_ENCRYPT_KEY: 'mZkZoEbfHYlKe/c39IPrpSjPb6qv8qAi',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
