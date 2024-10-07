import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VersionControlPage } from './version-control.page';

describe('VersionControlPage', () => {
  let component: VersionControlPage;
  let fixture: ComponentFixture<VersionControlPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
