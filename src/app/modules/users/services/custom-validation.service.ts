import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';

@Injectable()
export class CustomValidationService {

  PatternValidator(pattern: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      const regExp = new RegExp(pattern);
      const isValid = regExp.test(control.value);
      return isValid ? null : { invalid: true };
    };
  }
  
  MatchValidator(matchControl: AbstractControl) : ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
 
      if (!matchControl.value || !control.value) {
        return null;
      }

      if (matchControl.errors || (control.errors && !control.hasError('mismatched'))) {
        return null;
      }

      const isMatched = matchControl.value === control.value;
      return isMatched ? null : { mismatched: true };
    };
  }
}