import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroCreateComponent } from './parametro-create.component';

describe('ParametroCreateComponent', () => {
  let component: ParametroCreateComponent;
  let fixture: ComponentFixture<ParametroCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametroCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametroCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
