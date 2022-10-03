import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ReviewService, MessageService, Delta, Review, BookCover, QuillService, ReviewSubjectService, LocalStorageService, ReviewStatus, Authors } from 'src/app/core';

@Component({
  selector: 'app-review-edit',
  templateUrl: './review-edit.component.html',
  styleUrls: ['../../home.module.scss']
})
export class ReviewEditComponent implements OnInit {
  bookCoverImageURL: SafeUrl = "/assets/images/no_book_cover.png";
  submitted = false;
  maximumNoOfBookAuthorsAdded = false;

  id = new FormControl('', {nonNullable: true});
  bookCover = new FormControl();
  subject = new FormControl('', {validators: [Validators.maxLength(100)], nonNullable: true});
  bookTitle = new FormControl('', {validators: [Validators.maxLength(100)]});
  isbn = new FormControl('', {validators: [Validators.maxLength(17)]});
  content = new FormControl('', {validators: [Validators.maxLength(4000)], nonNullable: true});
  status = new FormControl('', {nonNullable: true});
  
  // Defining a form
  reviewEditForm = this.formBuilder.group({
    id: this.id,
    bookCover: this.bookCover,
    subject: this.subject,
    bookTitle: this.bookTitle,
    isbn: this.isbn,
    bookAuthors: this.formBuilder.array([]),
    content: this.content,
    status: this.status,
  });

  constructor(private formBuilder: FormBuilder, 
              private router: Router,
              private authService: AuthService,
              private messageService: MessageService,
              private reviewService: ReviewService,
              private reviewSubjectService: ReviewSubjectService,
              private quillService: QuillService,
              private localStorageService: LocalStorageService,
              private sanitizer: DomSanitizer) {      

    const quillStyle = document.getElementById('quill_style');
    // Checking if the style is imported
    if (!quillStyle) {
      this.quillService.beforeRender();
    }
  }

  ngOnInit(): void {
    this.initializeQuill();

    // Checking if my review in the list is selected or not
    this.reviewSubjectService.myReviewSelected.subscribe( myReviewSelected => {
      if ( myReviewSelected ) {
        if (this.reviewSubjectService.reviewId) {
          this.getMyReview(this.reviewSubjectService.reviewId); 
        } else {
           const review = JSON.parse(this.localStorageService.getData('review', ''));
           this.localStorageService.removeData('review');
           this.populateForm(review);
        }
      }
    });

    // Monitoring any changes on the input fields
    // this.reviewEditForm.valueChanges.subscribe(selectedValue => {
    //   if (this.messageService.message && this.reviewEditForm.touched) {
    //     this.messageService.delivered.next(true);
    //   }
    // });
  }

  // Attaching a Quill component
  initializeQuill() {
    this.quillService.createQuill('#quill-edit');
  } 

  // Getting bookAuthors which is a FormArray
  get bookAuthors() {
    return this.reviewEditForm.controls["bookAuthors"] as FormArray;
  }

  // Adding a book author input field 
  addBookAuthor(bookAuthorIndex: number) {
    const bookAuthor = this.getBookAuthor(this.bookAuthors.at(bookAuthorIndex));
    // Checking if the field is empty or not. No adding another book author if not.
    if (bookAuthor.value) {
      if (this.bookAuthors.length > 0 && this.bookAuthors.length < 3) {
        const formGroup = this.formBuilder.group ({
          bookAuthor: new FormControl('', {validators: [Validators.maxLength(200)]})
        });
        formGroup.patchValue({
          bookAuthor: ''
        });
        this.bookAuthors.push(formGroup);
      }  else if (this.bookAuthors.length == 3)  {
        this.maximumNoOfBookAuthorsAdded = true;
      }
    }
  }

  // Deleting a book author input field 
  deleteBookAuthor(bookAuthorIndex: number) {
    if (this.bookAuthors.length == 3) {
      this.maximumNoOfBookAuthorsAdded = false;
    }
    this.bookAuthors.removeAt(bookAuthorIndex);
  }

  // Getting a string of book authors
  getBookAuthorsToString() : Authors {
    let bookAuthors: [string?, string?, string?] = []; 
    
    this.bookAuthors.controls.forEach(formGroup => {
      const bookAuthor = this.getBookAuthor(this.getFormGroup(formGroup));
      if (bookAuthor.value) {
        bookAuthors.push(bookAuthor.value);
      }
    });
    return bookAuthors;
  }

  // Casting AbstractControl to FormGroup
  getFormGroup(control: AbstractControl<any, any>) {
    return control as FormGroup;
  }

  // Getting bookAuthor FormControl
  getBookAuthor(formGroup : AbstractControl<any, any>) {
    return this.getFormGroup(formGroup).controls['bookAuthor'];
  }

  // Populating review received into the form
  populateForm(review: Review) {
    this.reviewEditForm.patchValue({
      id: review.id,
      subject: review.subject,
      bookTitle: review.bookTitle,
      isbn: review.isbn,
      status: review.status,      
    });

    this.populateBookCover(review.bookCover);
    
    this.populateBookAuthors(review.bookAuthors); 

    this.populateReviewContent(review.content);
  }

  // Poplulating book cover
  populateBookCover(bookCover: BookCover | undefined) {
    let objectURL = "/assets/images/no_book_cover.png";
    if (bookCover) {
      objectURL = 'data:image/png;base64,' + bookCover.bytes;
    } 
    this.bookCoverImageURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  // Poplulating book author input fields
  populateBookAuthors(authors: Authors | undefined) {
    this.bookAuthors.clear();
    if (authors) {
      authors.forEach( author => {
        if (author) {
          let formGroup = this.formBuilder.group ({
              bookAuthor: new FormControl('', {validators: [Validators.maxLength(200)]})
          });
          formGroup.patchValue({
            bookAuthor: author
          });
          this.bookAuthors.push(formGroup);
        }
     })       
    } else {
      let formGroup = this.formBuilder.group ({
        bookAuthor: new FormControl('', {validators: [Validators.maxLength(200)]})
      });
      formGroup.patchValue({
        bookAuthor: ''
      });
      this.bookAuthors.push(formGroup);
    }
  }

  // Populating review content 
  populateReviewContent(content: string) {
    const delta : Delta = JSON.parse(content);
    this.quillService.quill!.setContents(delta, 'silent');  
  }

  // Getting a FormData object from inputs 
  getFormData(content : string) : FormData {
    let formData = new FormData();
    formData.append('id', this.id.value);
    formData.append('subject', this.subject.value);
    formData.append('bookTitle', this.bookTitle.value != null ? this.bookTitle.value : "");
    formData.append('isbn', this.isbn.value != null ? this.isbn.value : "");
    const bookAuthors = this.getBookAuthorsToString();
    formData.append('bookAuthors', bookAuthors.length != 0 ? JSON.stringify(bookAuthors) : "");
    formData.append('bookCover', this.bookCover.value ? this.bookCover.value : "");
    formData.append('content', content);
    const status = (<any>ReviewStatus)[this.status.value];
    formData.append('status', status);

    return formData;
  }

  // Getting my review from server
  getMyReview(id: string) {
    this.reviewService.getMyReview(id, this.authService.getAuthString(), this.authService.getUserId()).subscribe({
      next: (res) => {
        const review = res.review;
        if (review) {
          this.populateForm(review);        
        }
      },
      error: (e) => {
        console.log(e);
      }, 
      complete: () => {
        console.log(`${id} is successfully retrieved.`)
      }   
    });
  }

  onNewReview() {
    // Message has delivered already.
    this.messageService.delivered.next(true);
    // Initialize review subject service
    this.reviewSubjectService.initialize();
  }

  onDelete() {
    this.reviewService.delete(this.id.value, this.authService.getAuthString(), this.authService.getUserId()).subscribe({
      error: (e) => {
          console.log(e);
      },
      complete: () => {
            this.messageService.message = 'Sucessfully deleted the review!';
            // Returning to Home
            this.router.navigateByUrl('home');     
      }
    });
  }

  onChangeStatus() {
    // Message has delivered already.
    this.messageService.delivered.next(true);

    const status = this.status.value == ReviewStatus.Published ? ReviewStatus.Draft : ReviewStatus.Published;

    // Sending server request for changing review status
    this.reviewService.changeStatus(this.id.value, status, this.authService.getAuthString(), this.authService.getUserId()).subscribe({
      error: (e) => {
            console.log(e);
      },
      complete: () => {
            this.status.patchValue(status);
            console.log('Sucessfully updated the review!');  
      } 
    });  
  }

  // Uploading an image file
  onUpLoadBookCover(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (files) {
      const bookCoverFile = files[0];
      this.bookCoverImageURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(files[0]));
      this.bookCover.patchValue(bookCoverFile);
      this.reviewEditForm.controls['bookCover'].updateValueAndValidity();
    }
  }

  // Updating the review
  Update(formData: FormData) {
    this.reviewService.update(formData, this.authService.getAuthString(), this.authService.getUserId()).subscribe({
      error: (e) => {
            console.log(e);
            // display review content
            const content = formData.get('content')?.toString();
            if (content) {
              this.populateReviewContent(content);
            }
      },
      complete: () => {
            this.messageService.message = 'Sucessfully updated the review!';
            // Returning to Home
            this.router.navigateByUrl('home');     
      } 
    });  
  }

  // Submitting form
  onSubmit() {  
    console.log('Review edit submit');
    this.submitted = true;

    const content = JSON.stringify(this.quillService.quill!.getContents());

    // Adding Required validator
    this.content.addValidators(Validators.required);
    this.content.setValue(this.quillService.getContentText(content));

    // Validation check for the content of the review
    if (this.reviewEditForm.valid && this.quillService.isContentValid()) {         
      // Getting a FormData object from inputs 
      const formData = this.getFormData(content);
      this.Update(formData);
    } else {
      // Removing Required validator
      this.content.removeValidators(Validators.required);
    }
  }
}