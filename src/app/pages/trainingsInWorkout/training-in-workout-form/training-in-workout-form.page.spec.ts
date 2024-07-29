import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingInWorkoutFormPage } from './training-in-workout-form.page';

describe('TrainingInWorkoutFormPage', () => {
  let component: TrainingInWorkoutFormPage;
  let fixture: ComponentFixture<TrainingInWorkoutFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingInWorkoutFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
