import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaCreateComponent } from './zona-create.component';

describe('ZonaEditarComponent', () => {
  let component: ZonaCreateComponent;
  let fixture: ComponentFixture<ZonaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
