import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorCreateModalComponent } from './indicador-create-modal.component';

describe('IndicadorCreateModalComponent', () => {
  let component: IndicadorCreateModalComponent;
  let fixture: ComponentFixture<IndicadorCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
