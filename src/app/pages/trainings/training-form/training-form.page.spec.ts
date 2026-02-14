import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingFormPage } from './training-form.page';

describe('TrainingFormPage', () => {
  let component: TrainingFormPage;
  let fixture: ComponentFixture<TrainingFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
