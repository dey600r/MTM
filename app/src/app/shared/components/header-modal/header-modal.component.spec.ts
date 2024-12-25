import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTest, SpyMockConfig } from '@testing/index';

import { HeaderModalComponent } from './header-modal.component';

describe('HeaderModalComponent', () => {
  let component: HeaderModalComponent;
  let fixture: ComponentFixture<HeaderModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(SetupTest.config).compileComponents();

    fixture = TestBed.createComponent(HeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal', async () => {
    SpyMockConfig.SpyConfig.controlService.closeModal = jasmine.createSpy().and.returnValue(null);
    await component.closeModal();
    expect(SpyMockConfig.SpyConfig.controlService.closeModal).toHaveBeenCalled();
  });
});
