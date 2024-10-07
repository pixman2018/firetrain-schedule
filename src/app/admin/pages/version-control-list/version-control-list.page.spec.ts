import { ComponentFixture, TestBed } from '@angular/core/testing';
import { versionControlistPage } from './version-control-list.page';

describe('versionControlistPage', () => {
  let component: versionControlistPage;
  let fixture: ComponentFixture<versionControlistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(versionControlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
