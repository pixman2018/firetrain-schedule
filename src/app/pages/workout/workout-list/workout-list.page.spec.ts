import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutListPage } from './workout-list.page';

describe('WorkoutListPage', () => {
  let component: WorkoutListPage;
  let fixture: ComponentFixture<WorkoutListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
