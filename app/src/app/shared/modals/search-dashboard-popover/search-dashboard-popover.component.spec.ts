import { ComponentFixture, TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { SearchDashboardPopOverComponent } from './search-dashboard-popover.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ModalInputModel } from '@models/index';

describe('SearchDashboardPopOverComponent', () => {
  let component: SearchDashboardPopOverComponent;
  let fixture: ComponentFixture<SearchDashboardPopOverComponent>;
  let translate: TranslateService;

  beforeEach(async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataBaseService, SettingsService,
      SpyMockConfig.getProviderNavParams(new ModalInputModel({ parentPage: PageEnum.OPERATION })));
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDashboardPopOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
