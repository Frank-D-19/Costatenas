import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoportalHeaderComponent } from './geoportal-header.component';

describe('GeoportalHeaderComponent', () => {
  let component: GeoportalHeaderComponent;
  let fixture: ComponentFixture<GeoportalHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoportalHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoportalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
