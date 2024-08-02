import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingStartListPage } from './training-start-list.page';

describe('TrainingStartListPage', () => {
  let component: TrainingStartListPage;
  let fixture: ComponentFixture<TrainingStartListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingStartListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
