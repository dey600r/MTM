import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTest } from 'src/setup-test';

import { IconCarouselComponent } from './icon-carousel.component';

describe('IconCarouselComponent', () => {
  let component: IconCarouselComponent;
  let fixture: ComponentFixture<IconCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(SetupTest.config)
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
