import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { InfoVehicleComponent } from './info-vehicle.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { ControlService } from '@services/index';

// CONFIGURATION
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ModalInputModel } from '@models/index';

describe('InfoVehicleComponent', () => {
  let component: InfoVehicleComponent;
  let fixture: ComponentFixture<InfoVehicleComponent>;
  let translate: TranslateService;

  beforeEach(waitForAsync(async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataBaseService, ControlService,
      SpyMockConfig.getProviderNavParams(new ModalInputModel()));
    await TestBed.configureTestingModule(config).compileComponents();
    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoVehicleComponent);
    component = fixture.componentInstance;
    component.navParams.data = new ModalInputModel(true, null, MockData.Vehicles, PageEnum.VEHICLE);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
