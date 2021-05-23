import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapaBaseCreateComponent } from './capa-base-create.component';

describe('CapaBaseCreateComponent', () => {
  let component: CapaBaseCreateComponent;
  let fixture: ComponentFixture<CapaBaseCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapaBaseCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapaBaseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
