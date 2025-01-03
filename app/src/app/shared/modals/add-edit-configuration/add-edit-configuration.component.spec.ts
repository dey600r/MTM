import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { AddEditConfigurationComponent } from './add-edit-configuration.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { MockAppData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ConfigurationModel, ModalInputModel } from '@models/index';

describe('AddEditConfigurationComponent', () => {
  let component: AddEditConfigurationComponent;
  let fixture: ComponentFixture<AddEditConfigurationComponent>;
  let translate: TranslateService;

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataService, SettingsService);
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditConfigurationComponent);
    component = fixture.componentInstance;
    component.modalInputModel = new ModalInputModel<ConfigurationModel>({
      data: MockAppData.Configurations[0],
      parentPage: PageEnum.CONFIGURATION
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
