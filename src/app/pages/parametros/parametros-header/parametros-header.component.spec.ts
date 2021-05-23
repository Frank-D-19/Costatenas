import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosHeaderComponent } from './parametros-header.component';

describe('ParametrosHeaderComponent', () => {
  let component: ParametrosHeaderComponent;
  let fixture: ComponentFixture<ParametrosHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
