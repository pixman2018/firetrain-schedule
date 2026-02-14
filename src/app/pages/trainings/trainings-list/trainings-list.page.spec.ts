import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingsListPage } from './trainings-list.page';

describe('TrainingsListPage', () => {
  let component: TrainingsListPage;
  let fixture: ComponentFixture<TrainingsListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
