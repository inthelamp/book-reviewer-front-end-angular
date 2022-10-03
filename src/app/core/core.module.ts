import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthService } from './services'

@NgModule({
  declarations: [],
  providers: [
    AuthService
  ],
  imports: []
})
export class CoreModule { 

  constructor(@Optional() @SkipSelf() core:CoreModule ){
    if (core) {
        throw new Error("You should import core module only in the root module")
    }
  }  
}
