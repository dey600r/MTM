import { ComponentFixture, TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { InfoCalendarComponent } from './info-calendar.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { HomeService, SettingsService } from '@services/index';

// CONFIGURATION
import { MockAppData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { CalendarInputModal, ModalInputModel } from '@models/index';

describe('InfoCalendarComponent', () => {
  let component: InfoCalendarComponent;
  let fixture: ComponentFixture<InfoCalendarComponent>;
  let translate: TranslateService;
  let homeService: HomeService;

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataService, SettingsService);
    await TestBed.configureTestingModule(config).compileComponents();
    homeService = TestBed.inject(HomeService);
    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCalendarComponent);
    component = fixture.componentInstance;
    const allWears = homeService.getWearReplacementToVehicle(
      MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
    component.modalInputModel = new ModalInputModel<CalendarInputModal>({
        data: {
          wear: allWears,
          operations: [],
          vehicleSelected: allWears[0].idVehicle
        },
        parentPage: PageEnum.HOME
      });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
