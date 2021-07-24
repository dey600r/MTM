import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { SetupTest } from '@testing/index';

import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let translate: TranslateService;

  beforeEach(waitForAsync(async () => {
    TestBed.configureTestingModule(SetupTest.config).compileComponents();
    translate = TestBed.inject(TranslateService);
    await translate.use('es').toPromise();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
