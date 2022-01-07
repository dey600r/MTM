import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { ConfigurationPage } from './configuration.page';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

describe('ConfigurationPage', () => {
  let component: ConfigurationPage;
  let fixture: ComponentFixture<ConfigurationPage>;
  let translate: TranslateService;

  beforeEach(waitForAsync(async() => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataBaseService, SettingsService);
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationPage);
    component = fixture.componentInstance;
    component.loaded = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
