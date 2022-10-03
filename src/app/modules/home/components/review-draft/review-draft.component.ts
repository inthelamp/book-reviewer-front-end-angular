import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, ReviewService, Delta, QuillService, LocalStorageService, MessageService } from 'src/app/core';
import { Review, ReviewStatus } from 'src/app/core';
import { environment } from 'src/environments/environment';
0

@Component({
  selector: 'app-review-draft',
  templateUrl: './review-draft.component.html',
  styleUrls: ['../../home.module.scss']
})

export class ReviewDraftComponent implements OnInit {
  submitted = false;
  content = new FormControl('', {validators: [Validators.maxLength(4000)], nonNullable: true});
  
  reviewDraftForm: FormGroup = this.formBuilder.group({
    content: this.content,
  });

  constructor(private formBuilder: FormBuilder, 
              private router: Router,
              private authService: AuthService,
              private reviewService: ReviewService,
              private quillService: QuillService,
              private messageService: MessageService,
              private localStorageService: LocalStorageService) {  

    const quillStyle = document.getElementById('quill_style');
    // Checking if the style is imported
    if (!quillStyle) {
      this.quillService.beforeRender();
    }
  }

  ngOnInit(): void {
    this.initializeQuill();

    // Retrieving saved content in cookie
    const content = this.localStorageService.getData('content','');
    if (content && this.authService.isAuthenticated()) {
      this.save(content);
    }
  }

  // Attaching a Quill component
  initializeQuill() {
    this.quillService.createQuill('#quill-draft');
  } 

  // Saving the draft version of review if the user is signed-in
  // Asking for sign-in if the user is not signed-in
  save(content: string) {
    if (!this.authService.isAuthenticated()) {      
      // Asking for sign-in
      this.router.navigateByUrl('/authguard', { state: {returnURL: '/home' } });
    } else {
      // Retrieving saved content in cookie
      const content = this.localStorageService.getData('content','');

      // Extract a default subject from the review content
      const subject = this.createReviewSubject(content);
            
      const review : Review = {
        id: undefined, 
        subject: subject,
        content : content,
        status: ReviewStatus.Draft
      } 
      // Saving the draft version of review
      this.reviewService.save(review, this.authService.getAuthString(), this.authService.getUserId()).subscribe({
        next: (res) => {        
              review.id = res.id;  
              // Saving review object in cookie
              this.localStorageService.saveData('review', JSON.stringify(review), '');
              // Removing content from cookie because it is no longer needed.
              this.localStorageService.removeData('content');
        },
        error: (e) => {
              console.log(e);
              // display review content
              this.populateReviewContent(content);
        },
        complete: () => {
              this.messageService.message = 'Sucessfully saved the review!';   
              // Returning to Home
              this.router.navigateByUrl('home');              
        }
      });    
    }
  } 

  // Creating a default subject of the review 
  createReviewSubject(content: string)
  {
    if (content) {
      const subject = this.quillService.getContentText(content);
      const maxSubjectSize = environment.APP_SUBJECT_MAX_SIZE;

      if (subject.length <= maxSubjectSize) {
          return subject;
      } else {
          return subject.substring(0, maxSubjectSize-1);
      }
    } else {
      return '';
    }
  }  

  // Populating the review content when an error occurs in saving.
  populateReviewContent(content: string) {
    if (content) {
      const delta : Delta = JSON.parse(content);
      this.quillService.quill!.setContents(delta, 'silent');     
    }
  }
   
  // Submitting form 
  onSubmit() {  
    console.log('Review draft submit');

    if (this.quillService.quill) {
      this.submitted = true;
      const content = JSON.stringify(this.quillService.quill.getContents());

      // Save review content as a string in cookie
      this.localStorageService.saveData('content', content, '');
  
      // Adding Required validator 
      this.content.addValidators(Validators.required);
      this.content.setValue(this.quillService.getContentText(content));
  
      // Validation check for the review content
      if (this.reviewDraftForm.valid && this.quillService.isContentValid()) {
        // Saving the review content
        this.save(content);
      } else {
        // Removing Required validator
        this.content.removeValidators(Validators.required);
      } 
    }
  }
}
