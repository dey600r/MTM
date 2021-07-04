import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from './utils.service';

import { SetupTest } from 'src/setup-test';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule(SetupTest.config);
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
