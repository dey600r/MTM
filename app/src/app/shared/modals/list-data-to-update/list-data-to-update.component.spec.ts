import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { ListDataToUpdateComponent } from './list-data-to-update.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ListDataModalModel, ListModalModel, ModalInputModel } from '@models/index';

describe('ListDataToUpdateComponent', () => {
  let component: ListDataToUpdateComponent;
  let fixture: ComponentFixture<ListDataToUpdateComponent>;
  let translate: TranslateService;

  beforeEach(waitForAsync(async () => {
    let listDataModel: ListDataModalModel[] = [];

    MockData.Configurations.forEach(x => {
      listDataModel = [...listDataModel,
        new ListDataModalModel(
          x.id,
          x.name,
          '',
          x.description,
          'cog',
          (x.listMaintenance && x.listMaintenance.some(z => z.id === MockData.Maintenances[0].id)),
          (x.id === 1)
        )];
    });
    const listModel: ListModalModel = new ListModalModel('TEST_TITLE', true, listDataModel);
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataBaseService, SettingsService,
      SpyMockConfig.getProviderNavParams(new ModalInputModel(true, listModel, [], PageEnum.CONFIGURATION)));
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDataToUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
