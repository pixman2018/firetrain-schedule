import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogitemsFormPage } from './logitems-form.page';

describe('LogitemsFormPage', () => {
  let component: LogitemsFormPage;
  let fixture: ComponentFixture<LogitemsFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LogitemsFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
