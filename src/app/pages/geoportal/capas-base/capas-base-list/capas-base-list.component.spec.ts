import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapasBaseListComponent } from './capas-base-list.component';

describe('CapasBaseListComponent', () => {
  let component: CapasBaseListComponent;
  let fixture: ComponentFixture<CapasBaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapasBaseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapasBaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
