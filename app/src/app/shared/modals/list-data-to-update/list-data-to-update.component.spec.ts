import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { ListDataToUpdateComponent } from './list-data-to-update.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@services/index';

// CONFIGURATION
import { MockAppData, SetupTest, SpyMockConfig } from '@testing/index';
import { PageEnum } from '@utils/index';

// MODELS
import { ListDataModalModel, ListModalModel, ModalInputModel } from '@models/index';

describe('ListDataToUpdateComponent', () => {
  let component: ListDataToUpdateComponent;
  let fixture: ComponentFixture<ListDataToUpdateComponent>;
  let translate: TranslateService;

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataService, SettingsService);
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDataToUpdateComponent);
    component = fixture.componentInstance;

    let listDataModel: ListDataModalModel[] = [];
    MockAppData.Configurations.forEach(x => {
      listDataModel = [...listDataModel,
        new ListDataModalModel(
          x.id,
          x.name,
          '',
          x.description,
          'cog',
          (x.listMaintenance && x.listMaintenance.some(z => z.id === MockAppData.Maintenances[0].id)),
          (x.id === 1)
        )];
    });
    const listModel: ListModalModel = new ListModalModel('TEST_TITLE', true, listDataModel);
    component.modalInputModel = new ModalInputModel<ListModalModel>({
      data: listModel, 
      parentPage: PageEnum.CONFIGURATION
    });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
