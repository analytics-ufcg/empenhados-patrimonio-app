import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumoCandidatoComponent } from './resumo-candidato.component';

describe('ResumoCandidatoComponent', () => {
  let component: ResumoCandidatoComponent;
  let fixture: ComponentFixture<ResumoCandidatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumoCandidatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumoCandidatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
