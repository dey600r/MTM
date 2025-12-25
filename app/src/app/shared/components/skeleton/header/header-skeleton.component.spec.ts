import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTest } from '@testing/index';

import { HeaderSkeletonComponent } from './header-skeleton.component';

describe('HeaderSkeletonComponent', () => {
  let component: HeaderSkeletonComponent;
  let fixture: ComponentFixture<HeaderSkeletonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(SetupTest.config).compileComponents();

    fixture = TestBed.createComponent(HeaderSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
