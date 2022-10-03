import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherReviewListComponent } from './other-review-list.component';

describe('OtherReviewListComponent', () => {
  let component: OtherReviewListComponent;
  let fixture: ComponentFixture<OtherReviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherReviewListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
