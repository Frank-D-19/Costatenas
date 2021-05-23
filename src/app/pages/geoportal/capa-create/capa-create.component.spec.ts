import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapaCreateComponent } from './capa-create.component';

describe('CapaCreateComponent', () => {
  let component: CapaCreateComponent;
  let fixture: ComponentFixture<CapaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
