import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoyplotEstadosComponent } from './joyplot-estados.component';

describe('JoyplotEstadosComponent', () => {
  let component: JoyplotEstadosComponent;
  let fixture: ComponentFixture<JoyplotEstadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoyplotEstadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoyplotEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
