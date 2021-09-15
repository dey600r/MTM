import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

// COMPONENTS
import { AddEditVehicleComponent } from './add-edit-vehicle.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ModalInputModel } from '@models/index';

describe('AddEditVehicleComponent', () => {
  let component: AddEditVehicleComponent;
  let fixture: ComponentFixture<AddEditVehicleComponent>;
  let translate: TranslateService;

  beforeEach(waitForAsync(async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataBaseService, SettingsService,
      SpyMockConfig.getProviderNavParams(new ModalInputModel(true, MockData.Vehicles[0], [], PageEnum.VEHICLE)));
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await translate.use('es').toPromise();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
