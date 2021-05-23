import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresHeaderComponent } from './indicadores-header.component';

describe('IndicadoresHeaderComponent', () => {
  let component: IndicadoresHeaderComponent;
  let fixture: ComponentFixture<IndicadoresHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
