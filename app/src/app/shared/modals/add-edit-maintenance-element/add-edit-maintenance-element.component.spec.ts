import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { AddEditMaintenanceElementComponent } from './add-edit-maintenance-element.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { MockAppData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { MaintenanceElementModel, ModalInputModel } from '@models/index';

describe('AddEditMaintenanceElementComponent', () => {
  let component: AddEditMaintenanceElementComponent;
  let fixture: ComponentFixture<AddEditMaintenanceElementComponent>;
  let translate: TranslateService;

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataService, SettingsService,
      SpyMockConfig.getProviderNavParams(new ModalInputModel<MaintenanceElementModel>({
        data: MockAppData.MaintenanceElements[0],
        parentPage: PageEnum.CONFIGURATION
      })));
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditMaintenanceElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
