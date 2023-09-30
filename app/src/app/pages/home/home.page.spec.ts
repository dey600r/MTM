import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENTS
import { HomePage } from './home.page';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { SettingsService } from '@src/app/core/services';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let translate: TranslateService;

  beforeAll(() => {
    const elementMock: any = {
      id: 'custom-overlay',
      style: 'display: flex'
    };
    spyOn(document, 'getElementById').and.returnValue(elementMock);
  });

  beforeEach((async () => {
    const config: any = SetupTest.config;
    config.providers.push(SpyMockConfig.ProviderDataService, SettingsService);
    await TestBed.configureTestingModule(config).compileComponents();

    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    component.loadedHeader = true;
    component.loadedBody = true;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
