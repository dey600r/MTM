import { TestBed, waitForAsync } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { SetupTest } from '@src/setup-test';

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;

  beforeEach(waitForAsync(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleBlackTranslucent']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });

    let providersModule: any[] = SetupTest.config.providers;
    providersModule = [...providersModule, { provide: StatusBar, useValue: statusBarSpy }];
    providersModule = [...providersModule, { provide: SplashScreen, useValue: splashScreenSpy }];
    providersModule = [...providersModule, { provide: Platform, useValue: platformSpy }];

    TestBed.configureTestingModule({
      declarations: SetupTest.config.declarations,
      schemas: SetupTest.config.schemas,
      providers: providersModule,
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    // expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    // expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: add more tests!

});
