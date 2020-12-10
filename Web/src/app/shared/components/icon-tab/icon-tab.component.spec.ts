import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTabComponent } from './icon-tab.component';

describe('IconTabComponent', () => {
  let component: IconTabComponent;
  let fixture: ComponentFixture<IconTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconTabComponent ]
    })
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
