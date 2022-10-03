import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService, ReviewSubjectService } from 'src/app/core';
import { CustomValidationService } from '../../services/custom-validation.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../..//user.module.scss']
})
export class SignInComponent implements OnInit {
  returnURL : string = '/home';
  email = new FormControl('', {validators: [Validators.required, Validators.email], nonNullable: true});
  password = new FormControl('', {validators: [Validators.required, this.customValidator.PatternValidator(environment.APP_PASSWORD_REGEX)], nonNullable: true});
  
  signInForm: FormGroup = this.formBuilder.group({
    email: this.email,
    password: this.password,
  });
   
  hide = true;
  submitted = false;

  constructor(private authService: AuthService, 
              private customValidator: CustomValidationService,
              private formBuilder: FormBuilder,
              private reviewSubjectService: ReviewSubjectService,
              private router: Router) { }

  ngOnInit() {
    if (history.state && history.state.returnURL) {
      this.returnURL = history.state.returnURL;  
      history.state.returnURL = null;
    }
  }

  signIn(email: string, password: string){
    console.log(email);
    this.authService.signIn(email, password).subscribe(res => {
      console.log("Signed in!");

      // Initialize review service
      this.reviewSubjectService.initialize();

      this.router.navigateByUrl(this.returnURL);  
    });    
  }

  onSubmit() {
    this.submitted = true;
    if (this.signInForm.valid) {
      const email = this.email.value; 
      const password = this.password.value;
      this.signIn(email, password);
    }
  }
}
