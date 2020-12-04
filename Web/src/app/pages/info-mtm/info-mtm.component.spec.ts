import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupTest } from 'src/setup-test';

import { InfoMtmComponent } from './info-mtm.component';

describe('InfoMtmComponent', () => {
  let component: InfoMtmComponent;
  let fixture: ComponentFixture<InfoMtmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(SetupTest.config)
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
