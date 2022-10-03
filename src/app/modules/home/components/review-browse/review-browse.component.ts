import { compileClassMetadata } from '@angular/compiler';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ReviewService, Delta, Review, QuillService, ReviewSubjectService, BookCover } from 'src/app/core';

@Component({
  selector: 'app-review-browse',
  templateUrl: './review-browse.component.html',
  styleUrls: ['../../home.module.scss']
})
export class ReviewBrowseComponent implements OnInit {
  bookCoverImageURL: SafeUrl = "/assets/images/no_book_cover.png";
  review: Review | null = null; 

  constructor(private quillService: QuillService,
              private reviewSubjectService: ReviewSubjectService,
              private reviewService: ReviewService,
              private sanitizer: DomSanitizer, 
              private changeDetectorRefs: ChangeDetectorRef) { 

    const quillStyle = document.getElementById('quill_style');
    // Checking if the style is imported
    if (!quillStyle) {
      this.quillService.beforeRender();
    }
  }

  ngOnInit(): void {
    this.initializeQuill();

    // Checking if my review in the list is selected or not
    this.reviewSubjectService.otherReviewSelected.subscribe( otherReviewSelected => {
      if ( otherReviewSelected && this.reviewSubjectService.reviewId) {
        this.getReview(this.reviewSubjectService.reviewId); 
      }
    });
  }

  // Attaching a Quill component
  initializeQuill() {
    this.quillService.createQuillForBrowse('#quill-browse');
  } 

  // Poplulating book cover
  populateBookCover(bookCover: BookCover | undefined) {
    let objectURL = "/assets/images/no_book_cover.png";
    if (bookCover) {
      objectURL = 'data:image/png;base64,' + bookCover.bytes;
    } 
    this.bookCoverImageURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  // Populating review content 
  populateReviewContent(content: string) {
    const delta : Delta = JSON.parse(content);
    this.quillService.quill!.setContents(delta, 'silent');  
  }

  // Getting review from server
  getReview(id: string) {
    this.reviewService.getReview(id).subscribe({     
      next: (res) => {
        this.review = res.review;
        if (this.review) {
          this.populateBookCover(this.review.bookCover);
          this.populateReviewContent(this.review.content);
        }
      },
      error: (e) => {
        console.log(e);
        this.review = null;
       },
      complete: () => {
        console.log(`${id} is successfully retrieved.`)
      }
    });
  }

  getBookAuthorsToString() : string {
    let bookAuthors: string = "";
    if (this.review && this.review.bookAuthors) {
      this.review.bookAuthors.forEach( bookAuthor => {
        if (bookAuthor) {
          if (!bookAuthors) {
            bookAuthors = bookAuthor;
          } else {
            bookAuthors = bookAuthors + ', ' + bookAuthor;
          }
        }
      });
    } 
    return bookAuthors;
  }
}
