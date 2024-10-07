import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VersionControlDetailsPage } from './version-control-details.page';

describe('VersionControlDetailsPage', () => {
  let component: VersionControlDetailsPage;
  let fixture: ComponentFixture<VersionControlDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionControlDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
