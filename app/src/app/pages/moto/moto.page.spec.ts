import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MotoPage } from './moto.page';

describe('MotoPage', () => {
  let component: MotoPage;
  let fixture: ComponentFixture<MotoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MotoPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
