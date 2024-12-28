import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTest } from '@testing/index';

import { BodySkeletonComponent } from './body-skeleton.component';

describe('BodySkeletonComponent', () => {
  let component: BodySkeletonComponent;
  let fixture: ComponentFixture<BodySkeletonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(SetupTest.config).compileComponents();

    fixture = TestBed.createComponent(BodySkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
