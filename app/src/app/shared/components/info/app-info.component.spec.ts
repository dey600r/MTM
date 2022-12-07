import { ComponentFixture, TestBed } from '@angular/core/testing';

// COMPONENT
import { AppInfoComponent } from './app-info.component';

// CONFIGURATION
import { SetupTest } from '@testing/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

describe('AppInfoComponent', () => {
  let component: AppInfoComponent;
  let fixture: ComponentFixture<AppInfoComponent>;

  beforeEach((async () => {
    TestBed.configureTestingModule(SetupTest.config).compileComponents();
    fixture = TestBed.createComponent(AppInfoComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
