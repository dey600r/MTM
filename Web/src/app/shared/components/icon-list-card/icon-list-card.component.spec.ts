import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTest } from 'src/setup-test';

import { IconListCardComponent } from './icon-list-card.component';

describe('IconListCardComponent', () => {
  let component: IconListCardComponent;
  let fixture: ComponentFixture<IconListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(SetupTest.config)
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
