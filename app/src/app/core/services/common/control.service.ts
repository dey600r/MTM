import { Injectable } from '@angular/core';
import { ToastController, AlertController, Platform, ModalController, PopoverController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARY ANGULAR
import { TranslateService } from '@ngx-translate/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

// SERVICE
import { LogService } from './log.service';

// UTILS
import { ModalInputModel, ModalOutputModel } from '@models/index';
import { Constants, PageEnum, ToastTypeEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class ControlService {

    private dateLastUse = new Date();
    private readonly listPages: PageEnum[] = [PageEnum.HOME, PageEnum.VEHICLE, PageEnum.OPERATION, PageEnum.CONFIGURATION];

    // SUBSCRIPTION
    private exitButtonSubscripion: Subscription = new Subscription();

    constructor(private readonly translator: TranslateService,
                private readonly alertController: AlertController,
                private readonly toastController: ToastController,
                private readonly modalController: ModalController,
                private readonly popoverController: PopoverController,
                private readonly loadingController: LoadingController,
                private readonly platform: Platform,
                private readonly iab: InAppBrowser,
                private readonly logService: LogService) {
    }

    getDateLastUse(): Date {
        return this.dateLastUse;
    }

    setDateLastUse(): void {
        this.dateLastUse = new Date();
    }

    isPage(page: PageEnum): boolean {
        return this.listPages.some(x => x === page);
    }

    // EXIT BUTTON

    activateButtonExist(parent: PageEnum) {
        if (!this.platform.is('desktop') && this.isPage(parent)) {
            this.exitButtonSubscripion = this.platform.backButton.subscribe(() => {
                this.showConfirm(PageEnum.HOME, this.translator.instant('COMMON.EXIT'),
                    this.translator.instant('ALERT.ExitApp'),
                    {
                        text: this.translator.instant('COMMON.ACCEPT'),
                        handler: () => {
                            this.closeApp();
                        }
                    });
            });
        }
    }

    closeApp() {
        navigator[Constants.IONIC_APP].exitApp();
    }

    desactivateButtonExist() {
        this.exitButtonSubscripion.unsubscribe();
    }

    // CONFIRMS
    async showConfirm(parent: PageEnum, title: string, msg: string, buttonAccept: any, callbackCancel: any = () => { /* this is intentional */ }) {
        this.desactivateButtonExist();
        const alert = await this.alertController.create({
            header: title,
            message: msg,
            buttons: [
            {
                text: this.translator.instant('COMMON.CANCEL'),
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                    this.activateButtonExist(parent);
                    callbackCancel();
                }
            }, buttonAccept
            ]
        });

        await alert.present();
    }

    // TOAST

    showToast(parent: PageEnum, type: ToastTypeEnum, msg: string, data: any = null, delay: number = Constants.DELAY_TOAST,
              pos: string = Constants.TOAST_POSITION_BOTTOM, err: any = null) {
        this.showMsgToast(parent, type, this.translator.instant(msg, data), delay, pos, err);
    }

    async showMsgToast(parent: PageEnum, type: ToastTypeEnum, msg: string, delay: number = Constants.DELAY_TOAST,
                       pos: any = Constants.TOAST_POSITION_BOTTOM, err: any = null) {
        
        this.logService.logInfo(type, parent, msg, err);

        this.desactivateButtonExist();
        const toast = await this.toastController.create({
            message: msg,
            duration: delay,
            position: pos,
            color: type,
            cssClass: 'custom-toast'
        });
        toast.onDidDismiss().then((dataReturned) => {
            this.activateButtonExist(parent);
        });
        await toast.present();
    }

    // ALERTS

    alertInfo(parent: PageEnum, msg: string, header: string = 'ALERT.INFO') {
        this.alert(parent, header, msg);
    }

    async alert(parent: PageEnum, header: string, msg: string) {
        await this.alertCustom(parent, header, msg, [this.translator.instant(`COMMON.ACCEPT`)]);
    }

    private alertOpen: boolean = false;
    async alertCustom(parent: PageEnum, header: string, msg: string, btns: any[]) {
        if(!this.alertOpen) {
            this.desactivateButtonExist();

            this.alertOpen = true;
            const alert = await this.alertController.create({
                header: this.translator.instant(header),
                subHeader: '',
                message: this.translator.instant(msg),
                buttons: btns
            });
            alert.onDidDismiss().then((dataReturned) => {
                this.alertOpen = false;
                this.activateButtonExist(parent);
            });
            await alert.present();
        }
            
    }

    // POPOVERS

    async showPopover(parent: PageEnum, ev: any, modalComponent: any, inputModel: ModalInputModel) {
        this.desactivateButtonExist();
        const currentPopover = await this.popoverController.create({
            component: modalComponent,
            componentProps: { modalInputModel: inputModel },
            event: ev,
            translucent: true
        });
        currentPopover.onDidDismiss().then((dataReturned) => {
            this.activateButtonExist(parent);
        });
        return await currentPopover.present();
    }

    closePopover() {
        this.popoverController.dismiss();
    }

    // MODALS

    async openModal(parent: PageEnum, modalComponent: any, inputModel: ModalInputModel): Promise<HTMLIonModalElement> {
        this.desactivateButtonExist();
        const modal: HTMLIonModalElement = await this.modalController.create({
          component: modalComponent,
          componentProps: { modalInputModel: inputModel },
          cssClass: 'my-custom-modal',
        });
        modal.onDidDismiss().then((dataReturned) => {
          this.activateButtonExist(parent);
        });
        await modal.present();
        return modal;
    }

    closeModal(modalController: ModalController, modalOuput: ModalOutputModel = new ModalOutputModel()) {
        modalController?.dismiss(modalOuput);
    }

    // SEGMENTS

    activeSegmentScroll(length: number): boolean {
        return (this.platform.width() < Constants.MAX_WIDTH_SEGMENT_SCROLABLE && length > 2) || length > 10;
    }

    // APP BROWSER
    showPrivacyPolicy() {
        this.iab.create(encodeURI(Constants.MTM_URL_PRIVACY_POLICY), (this.platform.is('desktop') ? '_system' : '_self'));
    }
}
