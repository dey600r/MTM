import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconDocComponent } from './icon-doc.component';

describe('IconDocComponent', () => {
  let component: IconDocComponent;
  let fixture: ComponentFixture<IconDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
