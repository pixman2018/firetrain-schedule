import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutFormPage } from './workout-form.page';

describe('WorkoutFormPage', () => {
  let component: WorkoutFormPage;
  let fixture: ComponentFixture<WorkoutFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
