import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorShowComponent } from './indicador-show.component';

describe('IndicadorShowComponent', () => {
  let component: IndicadorShowComponent;
  let fixture: ComponentFixture<IndicadorShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
