import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingsInWorkoutListPage } from './trainings-in-workout-list.page';

describe('TrainingsInWorkoutListPage', () => {
  let component: TrainingsInWorkoutListPage;
  let fixture: ComponentFixture<TrainingsInWorkoutListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingsInWorkoutListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
