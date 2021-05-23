import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroShowComponent } from './parametro-show.component';

describe('ParametroShowComponent', () => {
  let component: ParametroShowComponent;
  let fixture: ComponentFixture<ParametroShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametroShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametroShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
