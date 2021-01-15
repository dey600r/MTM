import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTest } from 'src/setup-test';

import { IconLinksComponent } from './icon-links.component';

describe('IconLinksComponent', () => {
  let component: IconLinksComponent;
  let fixture: ComponentFixture<IconLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(SetupTest.config).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
