import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Platform } from '@ionic/angular';

import { AppComponent } from './app.component';

// PLUGINS
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// CONFIGURATION
import { SetupTest, SpyMockConfig } from '@testing/index';
import { MockTranslate } from '@src/testing/mock-i18n.spec';

// SERVICES
import { ControlService, DataBaseService, SettingsService } from '@services/index';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let platform: Platform;
  let statusBar: StatusBar;
  let splashScreen: SplashScreen;
  let dbService: DataBaseService;
  let controlService: ControlService;
  let settingsService: SettingsService;
  let translate: TranslateService;

  beforeEach(waitForAsync(async () => {
    const config: any = SetupTest.config;
    config.providers.push(
      SpyMockConfig.ProviderDataBaseService,
      SpyMockConfig.ProviderSettingsService);
    await TestBed.configureTestingModule(config).compileComponents();
    translate = TestBed.inject(TranslateService);
    await translate.use('es').toPromise();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    platform = TestBed.inject(Platform);
    statusBar = TestBed.inject(StatusBar);
    splashScreen = TestBed.inject(SplashScreen);
    dbService = TestBed.inject(DataBaseService);
    controlService = TestBed.inject(ControlService);
    settingsService = TestBed.inject(SettingsService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    component.initializeApp();
    fixture.detectChanges();
    await platform.ready();
    fixture.whenStable().then(() => {
      expect(platform.ready).toHaveBeenCalled();
      expect(statusBar.styleBlackTranslucent).toHaveBeenCalled();
      expect(splashScreen.hide).toHaveBeenCalled();
      expect(dbService.initDB).toHaveBeenCalled();
      expect(controlService.activateButtonExist).toHaveBeenCalled();
      expect(settingsService.createOutputDirectory).toHaveBeenCalled();
    });
    
  });

  it('should translate app - ES', async () => {
    expect(translate.instant('COMMON.SAVE')).toEqual(MockTranslate.ES.COMMON.SAVE);
  });

  it('should translate app - EN', async () => {
    await translate.use('en').toPromise();
    expect(translate.instant('COMMON.SAVE')).toEqual(MockTranslate.EN.COMMON.SAVE);
  });

});
