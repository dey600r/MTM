import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { VehiclePage } from './vehicle.page';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { SetupTest, SpyMockConfig } from '@testing/index';

describe('VehiclePage', () => {
  let component: VehiclePage;
  let fixture: ComponentFixture<VehiclePage>;
  let translate: TranslateService;

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataBaseService, SettingsService);
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclePage);
    component = fixture.componentInstance;
    component.loaded = true;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
