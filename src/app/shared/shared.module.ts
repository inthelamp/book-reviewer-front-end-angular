import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent, FooterComponent, MessagesComponent, AuthGuardComponent } from './components';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,     
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [ 
    HeaderComponent, 
    FooterComponent, 
    MessagesComponent, 
    AuthGuardComponent 
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    HeaderComponent, 
    FooterComponent, 
    MessagesComponent, 
    AuthGuardComponent
  ]
})
export class SharedModule {
}