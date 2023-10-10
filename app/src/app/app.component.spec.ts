import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { AppComponent } from './app.component';

// PLUGINS
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// CONFIGURATION
import { SetupTest, SpyMockConfig, MockTranslate } from '@testing/index';

// SERVICES
import { ControlService, DataBaseService, ExportService } from '@services/index';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let platform: Platform;
  let statusBar: StatusBar;
  let dbService: DataBaseService;
  let controlService: ControlService;
  let exportService: ExportService;
  let translate: TranslateService;

  beforeEach(async () => {
    const config: any = SetupTest.config;
    config.providers.push(
      SpyMockConfig.ProviderDataBaseService,
      SpyMockConfig.ProviderDataService,
      SpyMockConfig.ProviderExportService);
    await TestBed.configureTestingModule(config).compileComponents();
    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    platform = TestBed.inject(Platform);
    statusBar = TestBed.inject(StatusBar);
    dbService = TestBed.inject(DataBaseService);
    //controlService = TestBed.inject(ControlService);
    exportService = TestBed.inject(ExportService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    let spyControlService = SpyMockConfig.SpyConfig.controlService.activateButtonExist.and.returnValue(null);
    component.initializeApp();
    fixture.detectChanges();
    await platform.ready();
    fixture.whenStable().then(() => {
        tick();
        expect(platform.ready).toHaveBeenCalled();
        expect(statusBar.styleLightContent).toHaveBeenCalled();
        expect(dbService.initDB).toHaveBeenCalled();
        expect(spyControlService).toHaveBeenCalled();
        expect(exportService.createOutputDirectory).toHaveBeenCalled();
    });
  });

  it('should translate app - ES', () => {
    expect(translate.instant('COMMON.SAVE')).toEqual(MockTranslate.ES.COMMON.SAVE);
  });

  it('should translate app - EN', async () => {
    await firstValueFrom(translate.use('en'));
    expect(translate.instant('COMMON.SAVE')).toEqual(MockTranslate.EN.COMMON.SAVE);
  });

  // afterAll(() => {
  //   fixture.destroy();
  //   //TestBed.resetTestEnvironment();
  //   TestBed.resetTestingModule();
  // });
});
