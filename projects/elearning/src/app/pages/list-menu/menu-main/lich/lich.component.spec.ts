import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LichComponent } from './lich.component';

describe('LichComponent', () => {
  let component: LichComponent;
  let fixture: ComponentFixture<LichComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LichComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
