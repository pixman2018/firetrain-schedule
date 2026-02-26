import { ComponentFixture, TestBed } from '@angular/core/testing';
import { exercisesListPage } from './exercises-list.page';

describe('exercisesListPage', () => {
  let component: exercisesListPage;
  let fixture: ComponentFixture<exercisesListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(exercisesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
