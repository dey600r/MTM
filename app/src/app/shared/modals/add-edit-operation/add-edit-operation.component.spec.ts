import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { AddEditOperationComponent } from './add-edit-operation.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { SetupTest, SpyMockConfig, MockData } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ModalInputModel } from '@models/index';

describe('AddEditOperationComponent', () => {
  let component: AddEditOperationComponent;
  let fixture: ComponentFixture<AddEditOperationComponent>;
  let translate: TranslateService;

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataBaseService, SettingsService,
        SpyMockConfig.getProviderNavParams(new ModalInputModel(true, MockData.Operations[0], [], PageEnum.OPERATION)));
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditOperationComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
