import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroCreateModalComponent } from './parametro-create-modal.component';

describe('ParametroCreateModalComponent', () => {
  let component: ParametroCreateModalComponent;
  let fixture: ComponentFixture<ParametroCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametroCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametroCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
