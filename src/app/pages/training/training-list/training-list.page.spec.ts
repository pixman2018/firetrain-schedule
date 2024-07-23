import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingListPage } from './training-list.page';

describe('TrainingListPage', () => {
  let component: TrainingListPage;
  let fixture: ComponentFixture<TrainingListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
