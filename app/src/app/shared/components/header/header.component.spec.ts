import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTest, SpyMockConfig } from '@testing/index';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(SetupTest.config).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal', async () => {
    SpyMockConfig.SpyConfig.controlService.closeModal = jasmine.createSpy().and.returnValue(Promise.resolve(true));
    const data = await component.closeModal();
    expect(data).toEqual(true);
  });
});
