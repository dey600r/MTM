import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

// COMPONENTS
import { InfoCalendarComponent } from './info-calendar.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { ControlService, DashboardService, SettingsService } from '@services/index';

// CONFIGURATION
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ModalInputModel } from '@models/index';

describe('InfoCalendarComponent', () => {
  let component: InfoCalendarComponent;
  let fixture: ComponentFixture<InfoCalendarComponent>;
  let translate: TranslateService;
  let dashboardService: DashboardService;

  beforeEach(waitForAsync(async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataBaseService, SettingsService,
      SpyMockConfig.getProviderNavParams(new ModalInputModel()));
    await TestBed.configureTestingModule(config).compileComponents();
    dashboardService = TestBed.inject(DashboardService);
    translate = TestBed.inject(TranslateService);
    await translate.use('es').toPromise();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCalendarComponent);
    component = fixture.componentInstance;
    const allWears = dashboardService.getWearReplacementToVehicle(
      MockData.Operations, MockData.Vehicles, MockData.Configurations, MockData.Maintenances);
    component.navParams.data = new ModalInputModel(true, null, allWears, PageEnum.HOME);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
