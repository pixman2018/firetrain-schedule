import { ComponentFixture, TestBed } from '@angular/core/testing';
import { exercisesFormPage } from './exercises-form.page';

describe('exercisesFormPage', () => {
  let component: exercisesFormPage;
  let fixture: ComponentFixture<exercisesFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(exercisesFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
