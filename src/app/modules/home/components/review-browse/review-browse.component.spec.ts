import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewBrowseComponent } from './review-browse.component';

describe('ReviewBrowseComponent', () => {
  let component: ReviewBrowseComponent;
  let fixture: ComponentFixture<ReviewBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewBrowseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
