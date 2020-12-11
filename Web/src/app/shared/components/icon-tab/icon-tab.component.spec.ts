import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTest } from 'src/setup-test';

import { IconTabComponent } from './icon-tab.component';

describe('IconTabComponent', () => {
  let component: IconTabComponent;
  let fixture: ComponentFixture<IconTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(SetupTest.config)
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
