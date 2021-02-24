import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSentimentComponent } from './ngx-sentiment.component';

describe('NgxSentimentComponent', () => {
  let component: NgxSentimentComponent;
  let fixture: ComponentFixture<NgxSentimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxSentimentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSentimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
