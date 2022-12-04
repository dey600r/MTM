import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AlertController, LoadingController, ModalController, Platform, PopoverController, ToastController } from '@ionic/angular';

// SERVICES
import { ControlService } from './control.service';

// CONFIGURATIONS
import { MockTranslate, SetupTest, SpyMockConfig } from '@testing/index';
import { Constants, PageEnum, ToastTypeEnum } from '@utils/index';
import { environment } from '@environment/environment';
import { ModalInputModel } from '@models/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

describe('ControlService', () => {
    let service: ControlService;
    let translate: TranslateService;
    let modalController: ModalController;
    let toastController: ToastController;
    let loaderController: LoadingController;
    let alertController: AlertController;
    let popoverController: PopoverController;
    let platform: Platform;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(ControlService);
        modalController = TestBed.inject(ModalController);
        toastController = TestBed.inject(ToastController);
        loaderController = TestBed.inject(LoadingController);
        alertController = TestBed.inject(AlertController);
        popoverController = TestBed.inject(PopoverController);
        platform = TestBed.inject(Platform);
        translate = TestBed.inject(TranslateService);

        await firstValueFrom(translate.use('es'));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get and update date last use', () => {
        service.setDateLastUse();
        expect(service.getDateLastUse().toTimeString()).toEqual(new Date().toTimeString());
    });

    it('should check if page is a main page', () => {
        const isModal = service.isPage(PageEnum.MODAL_CALENDAR);
        const isPage = service.isPage(PageEnum.HOME);
        expect(isModal).toBeFalsy();
        expect(isPage).toBeTruthy();
    });

    it('should is not app free', () => {
        const closeModal = spyOn(modalController, 'dismiss');
        const createToast = spyOn(new ModalController(null, null, null), 'create');
        service.isAppFree(modalController);
        expect(createToast).not.toHaveBeenCalled();
        expect(closeModal).not.toHaveBeenCalled();
    });

    it('should is app free', fakeAsync(() => {
        const onDismiss: any = {
            onDidDismiss: jasmine.createSpy().and.returnValue(Promise.resolve({})),
            present: jasmine.createSpy().and.returnValue(Promise.resolve({}))
        };
        const createToast = spyOn(toastController, 'create').and.returnValue(Promise.resolve(onDismiss));
        const setTimeout = spyOn(window, 'setTimeout');
        environment.isFree = true;
        service.isAppFree(modalController);
        tick(Constants.DELAY_TOAST_IS_FREE + 2);
        expect(setTimeout).toHaveBeenCalled();
        expect(createToast).toHaveBeenCalled();
        expect(onDismiss.onDidDismiss).toHaveBeenCalled();
        expect(onDismiss.present).toHaveBeenCalled();
    }));

    it('should active button exit', () => {
        const platformIs = spyOn(platform, 'is').and.returnValue(false);
        service.activateButtonExist(PageEnum.VEHICLE);
        expect(platformIs).toHaveBeenCalled();
    });

    // LOADERS

    it('should show loader', async () => {
        const onDismiss: any = {
            onDidDismiss: jasmine.createSpy().and.returnValue(Promise.resolve({})),
            present: jasmine.createSpy().and.returnValue(Promise.resolve({}))
        };
        const createLoader = spyOn(loaderController, 'create').and.returnValue(Promise.resolve(onDismiss));
        await service.showLoader(PageEnum.VEHICLE);
        expect(createLoader).toHaveBeenCalled();
        expect(onDismiss.onDidDismiss).toHaveBeenCalled();
        expect(onDismiss.present).toHaveBeenCalled();
    });

    it('should close loader', fakeAsync (() => {
        const onDismiss: any = { dismiss: jasmine.createSpy().and.returnValue(Promise.resolve()) };
        const closeLoader = spyOn(loaderController, 'getTop').and.returnValue(Promise.resolve(onDismiss));
        service.closeLoader();
        tick();
        expect(closeLoader).toHaveBeenCalled();
        expect(onDismiss.dismiss).toHaveBeenCalled();
    }));

    it('should not close loader', () => {
        const closeLoader = spyOn(loaderController, 'getTop').and.returnValue(Promise.resolve(null));
        service.closeLoader();
        expect(closeLoader).toHaveBeenCalled();
    });

    // CONFIRMS

    it('should show confirm', async () => {
        const acceptTranslate = translate.instant('COMMON.ACCEPT');
        const titleTranslate = translate.instant('PAGE_HOME.HOME');
        const messageTranslate = translate.instant('PAGE_VEHICLE.ConfirmDeleteVehicle');
        const onDismiss: any = {
            present: jasmine.createSpy().and.returnValue(Promise.resolve({}))
        };
        const createConfirm = spyOn(alertController, 'create').and.returnValue(Promise.resolve(onDismiss));
        await service.showConfirm(PageEnum.OPERATION, titleTranslate, messageTranslate, {
            text: acceptTranslate,
            handler: () => {
                console.log(acceptTranslate);
            }
        });
        expect(createConfirm).toHaveBeenCalled();
        expect(onDismiss.present).toHaveBeenCalled();
    });

    it('should show confirm alert - ES', () => {
        const platformIs = spyOn(platform, 'is').and.returnValue(true);
        const acceptTranslate = translate.instant('COMMON.ACCEPT');
        const titleTranslate = translate.instant('PAGE_HOME.HOME');
        const messageTranslate = translate.instant('PAGE_VEHICLE.ConfirmDeleteVehicle');
        spyOn(alertController, 'create').and.callFake((opts?: any) => {
            expect(opts.header).toEqual(MockTranslate.ES.PAGE_HOME.HOME);
            expect(opts.message).toEqual(MockTranslate.ES.PAGE_VEHICLE.ConfirmDeleteVehicle);
            expect(opts.buttons[0].text).toEqual(MockTranslate.ES.COMMON.CANCEL);
            expect(opts.buttons[1].text).toEqual(MockTranslate.ES.COMMON.ACCEPT);
            console.log = jasmine.createSpy('log');
            opts.buttons[1].handler();
            expect(console.log).toHaveBeenCalledWith(MockTranslate.ES.COMMON.ACCEPT);
            opts.buttons[0].handler();
            expect(platformIs).toHaveBeenCalled();
            return new Promise((resolve) => {});
        });
        service.showConfirm(PageEnum.OPERATION, titleTranslate, messageTranslate, {
            text: acceptTranslate,
            handler: () => {
                console.log(acceptTranslate);
            }
        });
    });

    it('should show confirm alert - EN', async () => {
        await firstValueFrom(translate.use('en'));
        const platformIs = spyOn(platform, 'is').and.returnValue(true);
        const acceptTranslate = translate.instant('COMMON.ACCEPT');
        const titleTranslate = translate.instant('PAGE_HOME.HOME');
        const messageTranslate = translate.instant('PAGE_VEHICLE.ConfirmDeleteVehicle');
        spyOn(alertController, 'create').and.callFake((opts?: any) => {
            expect(opts.header).toEqual(MockTranslate.EN.PAGE_HOME.HOME);
            expect(opts.message).toEqual(MockTranslate.EN.PAGE_VEHICLE.ConfirmDeleteVehicle);
            expect(opts.buttons[0].text).toEqual(MockTranslate.EN.COMMON.CANCEL);
            expect(opts.buttons[1].text).toEqual(MockTranslate.EN.COMMON.ACCEPT);
            console.log = jasmine.createSpy('log');
            opts.buttons[1].handler();
            expect(console.log).toHaveBeenCalledWith(MockTranslate.EN.COMMON.ACCEPT);
            opts.buttons[0].handler();
            expect(platformIs).toHaveBeenCalled();
            return new Promise((resolve) => {});
        });
        service.showConfirm(PageEnum.OPERATION, titleTranslate, messageTranslate, {
            text: acceptTranslate,
            handler: () => {
                console.log(acceptTranslate);
            }
        });
    });

    // TOASTS

    it('should show toast', () => {
        spyOn(toastController, 'create').and.callFake((opts?: any) => {
            expect(opts.message).toEqual(MockTranslate.ES.PAGE_VEHICLE.ConfirmDeleteVehicle);
            return new Promise((resolve) => {});
        });
        service.showToast(PageEnum.VEHICLE, ToastTypeEnum.INFO, 'PAGE_VEHICLE.ConfirmDeleteVehicle');
    });

    it('should show message toast', async () => {
        const messageTranslate = translate.instant('PAGE_VEHICLE.ConfirmDeleteVehicle');
        const onDismiss: any = {
            onDidDismiss: jasmine.createSpy().and.returnValue(Promise.resolve({})),
            present: jasmine.createSpy().and.returnValue(Promise.resolve({}))
        };
        const createToast = spyOn(toastController, 'create').and.returnValue(Promise.resolve(onDismiss));
        await service.showMsgToast(PageEnum.VEHICLE, ToastTypeEnum.INFO, messageTranslate);
        expect(createToast).toHaveBeenCalled();
        expect(onDismiss.onDidDismiss).toHaveBeenCalled();
        expect(onDismiss.present).toHaveBeenCalled();
    });

    // ALERTS

    it('should show alert', () => {
        spyOn(alertController, 'create').and.callFake((opts?: any) => {
            expect(opts.header).toEqual(MockTranslate.ES.ALERT.INFO);
            expect(opts.message).toEqual(MockTranslate.ES.PAGE_VEHICLE.ErrorSaveVehicle);
            return new Promise((resolve) => {});
        });
        service.alertInfo(PageEnum.VEHICLE, 'PAGE_VEHICLE.ErrorSaveVehicle');
    });

    it('should show message alert', async () => {
        const onDismiss: any = {
            onDidDismiss: jasmine.createSpy().and.returnValue(Promise.resolve({})),
            present: jasmine.createSpy().and.returnValue(Promise.resolve({}))
        };
        const createAlert = spyOn(alertController, 'create').and.returnValue(Promise.resolve(onDismiss));
        await service.alert(PageEnum.VEHICLE, 'PAGE_HOME.HOME', 'PAGE_VEHICLE.ErrorSaveVehicle');
        expect(createAlert).toHaveBeenCalled();
        expect(onDismiss.onDidDismiss).toHaveBeenCalled();
        expect(onDismiss.present).toHaveBeenCalled();
    });

    // POPOVERS

    it('should show popover', async () => {
        const onDismiss: any = {
            onDidDismiss: jasmine.createSpy().and.returnValue(Promise.resolve({})),
            present: jasmine.createSpy().and.returnValue(Promise.resolve({}))
        };
        const createPopover = spyOn(popoverController, 'create').and.returnValue(Promise.resolve(onDismiss));
        await service.showPopover(PageEnum.VEHICLE, {}, {}, new ModalInputModel());
        expect(createPopover).toHaveBeenCalled();
        expect(onDismiss.onDidDismiss).toHaveBeenCalled();
        expect(onDismiss.present).toHaveBeenCalled();
    });

    it('should close popover', async () => {
        const closePopover = spyOn(popoverController, 'dismiss');
        service.closePopover();
        expect(closePopover).toHaveBeenCalled();
    });

    // MODALS

    it('should show modals', async () => {
        const onDismiss: any = {
            onDidDismiss: jasmine.createSpy().and.returnValue(Promise.resolve({})),
            present: jasmine.createSpy().and.returnValue(Promise.resolve({}))
        };
        const createModal = spyOn(modalController, 'create').and.returnValue(Promise.resolve(onDismiss));
        await service.openModal(PageEnum.VEHICLE, {}, new ModalInputModel());
        expect(createModal).toHaveBeenCalled();
        expect(onDismiss.onDidDismiss).toHaveBeenCalled();
        expect(onDismiss.present).toHaveBeenCalled();
    });

    it('should close modals', async () => {
        const closeModal = spyOn(modalController, 'dismiss');
        service.closeModal(modalController);
        expect(closeModal).toHaveBeenCalled();
    });
});
