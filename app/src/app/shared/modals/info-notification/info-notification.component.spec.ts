import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { InfoNotificationComponent } from './info-notification.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { HomeService, SettingsService } from '@services/index';

// CONFIGURATION
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ModalInputModel, OperationModel, WearVehicleProgressBarViewModel } from '@models/index';

describe('InfoNotificationComponent', () => {
  let component: InfoNotificationComponent;
  let fixture: ComponentFixture<InfoNotificationComponent>;
  let translate: TranslateService;
  let homeService: HomeService;  

  // jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataBaseService, SettingsService,
      SpyMockConfig.getProviderNavParams(new ModalInputModel()));
    await TestBed.configureTestingModule(config).compileComponents();
    homeService = TestBed.inject(HomeService);
    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoNotificationComponent);
    component = fixture.componentInstance;
    const allWears: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(
      MockData.Operations, MockData.Vehicles, MockData.Configurations, MockData.Maintenances);
    component.navParams.data = new ModalInputModel<WearVehicleProgressBarViewModel, OperationModel>({
        data: allWears[0],
        dataList: MockData.Operations,
        parentPage: PageEnum.HOME
      });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
