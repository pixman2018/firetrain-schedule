import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingStartAddPage } from './training-start-add.page';

describe('TrainingStartAddPage', () => {
  let component: TrainingStartAddPage;
  let fixture: ComponentFixture<TrainingStartAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingStartAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
