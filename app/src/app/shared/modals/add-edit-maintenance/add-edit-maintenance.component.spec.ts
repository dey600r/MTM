import { ComponentFixture, TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { AddEditMaintenanceComponent } from './add-edit-maintenance.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { MockAppData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { MaintenanceModel, ModalInputModel } from '@models/index';

describe('AddEditMaintenanceComponent', () => {
  let component: AddEditMaintenanceComponent;
  let fixture: ComponentFixture<AddEditMaintenanceComponent>;
  let translate: TranslateService;

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataService, SettingsService,
      SpyMockConfig.getProviderNavParams(new ModalInputModel<MaintenanceModel, number>({
        data: MockAppData.Maintenances[0],
        dataList: [MockAppData.Vehicles[0].km],
        parentPage: PageEnum.CONFIGURATION
      })));
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
