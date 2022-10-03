import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDraftComponent } from './review-draft.component';

describe('ReviewDraftComponent', () => {
  let component: ReviewDraftComponent;
  let fixture: ComponentFixture<ReviewDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDraftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
