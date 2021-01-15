import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTest } from 'src/setup-test';

import { IconHeaderComponent } from './icon-header.component';

describe('IconHeaderComponent', () => {
  let component: IconHeaderComponent;
  let fixture: ComponentFixture<IconHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(SetupTest.config).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
