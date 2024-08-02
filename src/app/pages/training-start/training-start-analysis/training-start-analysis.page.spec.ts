import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingStartAnalysisPage } from './training-start-analysis.page';

describe('TrainingStartAnalysisPage', () => {
  let component: TrainingStartAnalysisPage;
  let fixture: ComponentFixture<TrainingStartAnalysisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingStartAnalysisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
