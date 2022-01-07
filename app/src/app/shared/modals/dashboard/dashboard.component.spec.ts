import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { DashboardComponent } from './dashboard.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ModalInputModel } from '@models/index';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let translate: TranslateService;

  beforeEach(waitForAsync(async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataBaseService, SettingsService,
      SpyMockConfig.getProviderNavParams(new ModalInputModel(true, null, MockData.Operations, PageEnum.OPERATION)));
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
