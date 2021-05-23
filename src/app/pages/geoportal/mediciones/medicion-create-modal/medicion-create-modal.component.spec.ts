import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicionCreateModalComponent } from './medicion-create-modal.component';

describe('MedicionCreateModalComponent', () => {
  let component: MedicionCreateModalComponent;
  let fixture: ComponentFixture<MedicionCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicionCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicionCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
