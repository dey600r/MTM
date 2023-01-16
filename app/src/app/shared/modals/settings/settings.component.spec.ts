import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { SettingsComponent } from './settings.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { ExportService, SettingsService } from '@services/index';

// CONFIGURATION
import { SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ModalInputModel } from '@models/index';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let translate: TranslateService;

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataBaseService, SettingsService, ExportService,
      SpyMockConfig.getProviderNavParams(new ModalInputModel({ parentPage: PageEnum.HOME })));
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
