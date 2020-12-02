import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFilePickComponent } from './mobile-file-pick.component';

describe('MobileFilePickComponent', () => {
  let component: MobileFilePickComponent;
  let fixture: ComponentFixture<MobileFilePickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileFilePickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileFilePickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
