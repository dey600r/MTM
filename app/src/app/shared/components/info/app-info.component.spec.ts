import { ComponentFixture, TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// COMPONENT
import { AppInfoComponent } from './app-info.component';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// CONFIGURATION
import { MockTranslate, SetupTest } from '@testing/index';

// MODELS
import { ModalInputModel } from '@models/index';

// UTILS
import { IInfoModel, InfoButtonEnum } from '@utils/index';

describe('AppInfoComponent', () => {
  let component: AppInfoComponent;
  let fixture: ComponentFixture<AppInfoComponent>;
  let translate: TranslateService;

  beforeEach((async () => {
    TestBed.configureTestingModule(SetupTest.config).compileComponents();
    fixture = TestBed.createComponent(AppInfoComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize message without button info - ES', () => {
    component.inputInfo = new ModalInputModel<IInfoModel>({
      data: {
        text: 'ALERT.VehicleEmpty',
        icon: 'home',
        info: InfoButtonEnum.NONE
      }
    });
    fixture.detectChanges();
    const control = fixture.debugElement.nativeElement.querySelector('.info-main');
    expect(control.childNodes[0].childNodes[0].localName).toEqual('ion-icon');
    expect(control.childNodes[0].childNodes[0].className).toContain('ion-color-info-init');
    expect(control.childNodes[0].childNodes[0].name).toEqual('home');
    expect(control.childNodes[0].childNodes[1].localName).toEqual('h2');
    expect(control.childNodes[0].childNodes[1].innerHTML).toEqual(MockTranslate.ES.ALERT.VehicleEmpty);
    expect(fixture.debugElement.nativeElement.querySelector('.info-content-height-no-icon')).not.toBeNull();
    expect(fixture.debugElement.nativeElement.querySelector('.info-content-height-icon')).toBeNull();
    expect(fixture.debugElement.nativeElement.querySelector('.info-tab')).toBeNull();
  });

  it('should initialize message with button info - EN', async () => {
    await firstValueFrom(translate.use('en'));
    component.inputInfo = new ModalInputModel<IInfoModel>({
      data: {
        text: 'ALERT.OperationEmpty',
        icon: 'build',
        info: InfoButtonEnum.VEHICLES
      }
    });
    fixture.detectChanges();
    const control = fixture.debugElement.nativeElement.querySelector('.info-main');
    expect(control.childNodes[0].childNodes[0].localName).toEqual('ion-icon');
    expect(control.childNodes[0].childNodes[0].className).toContain('ion-color-info-init');
    expect(control.childNodes[0].childNodes[0].name).toEqual('build');
    expect(control.childNodes[0].childNodes[1].localName).toEqual('h2');
    expect(control.childNodes[0].childNodes[1].innerHTML).toEqual(MockTranslate.EN.ALERT.OperationEmpty);
    expect(fixture.debugElement.nativeElement.querySelector('.info-content-height-no-icon')).toBeNull();
    expect(fixture.debugElement.nativeElement.querySelector('.info-content-height-icon')).not.toBeNull();
    const controlIcon = fixture.debugElement.nativeElement.querySelector('.info-tab');
    expect(controlIcon).not.toBeNull();
    expect(controlIcon.childNodes[0].className).toEqual('info-icon dissapear');
    expect(controlIcon.childNodes[1].className).toEqual('info-icon');
    expect(controlIcon.childNodes[1].childNodes[0].localName).toEqual('ion-icon');
    expect(controlIcon.childNodes[1].childNodes[0].name).toEqual('arrow-down-circle');
    expect(controlIcon.childNodes[2].className).toEqual('info-icon dissapear');
    expect(controlIcon.childNodes[3].className).toEqual('info-icon dissapear');
  });
});
