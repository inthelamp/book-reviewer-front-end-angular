import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Navigation, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router:Router, private authService: AuthService ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('CanActivate called');

    if (this.authService.isAuthenticated()){
      return true;
    } else {
      if (this.router.getCurrentNavigation()) {
        const navigation = this.router.getCurrentNavigation() as Navigation;
        if (navigation.extras.state) {
          return this.router.navigateByUrl('/signin', navigation.extras);
        } else {
          return this.router.parseUrl('/signin');
        }
      }
      else
      {
        return this.router.parseUrl('/signin');
      }
    }
  }
}
