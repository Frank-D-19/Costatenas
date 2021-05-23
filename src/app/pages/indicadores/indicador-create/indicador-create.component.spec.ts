import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorCreateComponent } from './indicador-create.component';

describe('IndicadorCreateComponent', () => {
  let component: IndicadorCreateComponent;
  let fixture: ComponentFixture<IndicadorCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
