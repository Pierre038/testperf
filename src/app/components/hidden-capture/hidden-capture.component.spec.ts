import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenCaptureComponent } from './hidden-capture.component';

describe('HiddenCaptureComponent', () => {
  let component: HiddenCaptureComponent;
  let fixture: ComponentFixture<HiddenCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiddenCaptureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
