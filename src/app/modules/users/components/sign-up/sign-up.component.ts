import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, UntypedFormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService, User } from 'src/app/core';
import { environment } from 'src/environments/environment';
import { CustomValidationService } from '../../services/custom-validation.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../../user.module.scss']
})
export class SignUpComponent implements OnInit {
  email = new FormControl('', {validators: [Validators.required, Validators.email], nonNullable: true});
  username = new FormControl('', {validators: [Validators.required, Validators.minLength(3)], nonNullable: true});
  password = new FormControl('', {validators: [Validators.required, this.customValidator.PatternValidator(environment.APP_PASSWORD_REGEX)], nonNullable: true});
  confirmPassword = new FormControl('', {validators: [Validators.required, this.customValidator.MatchValidator(this.password)], nonNullable: true});
  birthday = new UntypedFormControl('');


  signUpForm: FormGroup = this.formBuilder.group({
    email: this.email,
    username: this.username,
    password: this.password,
    confirmPassword: this.confirmPassword,
    birthday: this.birthday,
  });

  hidePassword = true;
  hideComfirmPassword = true;
  submitted = false;

  constructor(
              private authService: AuthService, 
              private customValidator: CustomValidationService,
              private formBuilder: FormBuilder,  
              private router: Router
  ) { }

  ngOnInit(): void {
  }

  signUp(user: User) {
    console.log(user.email);
    this.authService.signUp(user).subscribe(res => {
      this.router.navigateByUrl('home');
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.signUpForm.valid) {
      const user: User = {
        email: this.email.value,
        username: this.username.value,        
        password: this.password.value,
        confirmPassword: this.confirmPassword.value,
        birthday: this.birthday.value == "" ? null : this.birthday.value.toISOString(),
      }
      this.signUp(user);
    }
  }  
}
