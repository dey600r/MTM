import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

// COMPONENT
import { AppInfoComponent } from './app-info.component';

// CONFIGURATION
import { SetupTest } from '@testing/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

describe('AppInfoComponent', () => {
  let component: AppInfoComponent;
  let fixture: ComponentFixture<AppInfoComponent>;
  let translate: TranslateService;

  beforeEach(waitForAsync(async () => {
    TestBed.configureTestingModule(SetupTest.config).compileComponents();
    translate = TestBed.inject(TranslateService);
    await translate.use('es').toPromise();
    fixture = TestBed.createComponent(AppInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
