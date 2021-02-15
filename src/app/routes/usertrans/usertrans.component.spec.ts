import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsertransComponent } from './usertrans.component';

describe('UsertransComponent', () => {
  let component: UsertransComponent;
  let fixture: ComponentFixture<UsertransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsertransComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
