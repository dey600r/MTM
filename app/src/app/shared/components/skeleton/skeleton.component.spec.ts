import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTest } from '@testing/index';

import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let component: SkeletonComponent;
  let fixture: ComponentFixture<SkeletonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(SetupTest.config).compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
