import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService, LocalStorageService } from 'src/app/core';
import { CustomValidationService } from './services/custom-validation.service';
import { UserRoutingModule } from './user.routing.module';
import { SignInComponent  } from './components/sign-in/sign-in.component';
import { SignUpComponent  } from './components/sign-up/sign-up.component';

@NgModule({
  declarations: [SignInComponent, SignUpComponent],
  providers: [AuthService, LocalStorageService, CustomValidationService],
  imports: [ 
    UserRoutingModule,
    SharedModule,
  ]
})
export class UsersModule { }
