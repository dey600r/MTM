import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SetupTest, SpyMockConfig } from '@testing/index';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(async () => {
    let config: any = SetupTest.config;
    config.providers.push(
      SpyMockConfig.ProviderControlService
    );
    await TestBed.configureTestingModule(SetupTest.config).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal', () => {
    component.closeModal();
    expect(SpyMockConfig.SpyConfig.controlService.closeModal).toHaveBeenCalled();
  });
});
