import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VehiclePage } from './vehicle.page';

describe('VehiclePage', () => {
  let component: VehiclePage;
  let fixture: ComponentFixture<VehiclePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VehiclePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
