import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterplotPatrimonioComponent } from './scatterplot-patrimonio.component';

describe('ScatterplotPatrimonioComponent', () => {
  let component: ScatterplotPatrimonioComponent;
  let fixture: ComponentFixture<ScatterplotPatrimonioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScatterplotPatrimonioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterplotPatrimonioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
