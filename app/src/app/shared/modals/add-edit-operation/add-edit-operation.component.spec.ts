import { ComponentFixture, TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { AddEditOperationComponent } from './add-edit-operation.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { SetupTest, SpyMockConfig, MockAppData } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ModalInputModel, OperationModel } from '@models/index';

describe('AddEditOperationComponent', () => {
  let component: AddEditOperationComponent;
  let fixture: ComponentFixture<AddEditOperationComponent>;
  let translate: TranslateService;

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataService, SettingsService,
        SpyMockConfig.getProviderNavParams(new ModalInputModel<OperationModel>({
          data: MockAppData.Operations[0],
          parentPage: PageEnum.OPERATION
        })));
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
