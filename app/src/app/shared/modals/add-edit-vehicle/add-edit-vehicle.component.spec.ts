import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { AddEditVehicleComponent } from './add-edit-vehicle.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { MockAppData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ModalInputModel, VehicleModel } from '@models/index';

describe('AddEditVehicleComponent', () => {
  let component: AddEditVehicleComponent;
  let fixture: ComponentFixture<AddEditVehicleComponent>;
  let translate: TranslateService;

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataService, SettingsService);
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVehicleComponent);
    component = fixture.componentInstance;
    component.modalInputModel = new ModalInputModel<VehicleModel>({
      data: MockAppData.Vehicles[0],
      parentPage: PageEnum.VEHICLE
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
