import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconProjectComponent } from './icon-project.component';

describe('IconProjectComponent', () => {
  let component: IconProjectComponent;
  let fixture: ComponentFixture<IconProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
