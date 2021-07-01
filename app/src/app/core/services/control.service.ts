import { Injectable } from '@angular/core';
import { ToastController, AlertController, Platform, ModalController, PopoverController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARY ANGULAR
import { TranslateService } from '@ngx-translate/core';
import * as Moment from 'moment';

// UTILS
import { ModalInputModel, ModalOutputModel } from '@models/index';
import { Constants, PageEnum, ToastTypeEnum } from '@utils/index';
import { environment } from '@environment/environment';

@Injectable({
    providedIn: 'root'
})
export class ControlService {

    private dateLastUse = new Date();
    private listPages: PageEnum[] = [PageEnum.HOME, PageEnum.VEHICLE, PageEnum.OPERATION, PageEnum.CONFIGURATION];

    // SUBSCRIPTION
    private exitButtonSubscripion: Subscription = new Subscription();

    constructor(private translator: TranslateService,
                private alertController: AlertController,
                private toastController: ToastController,
                private modalController: ModalController,
                private popoverController: PopoverController,
                private loadingController: LoadingController,
                private platform: Platform) {
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

    // COMMON UTILS METHODS STRINGS

    getDateString(date: Date): any {
        return Moment(date).format(this.getFormatCalendar());
    }

    getDateStringToDB(date: Date): any {
        return Moment(date).format(Constants.DATE_FORMAT_DB);
    }

    getFormatCalendar() {
        return this.translator.currentLang === 'es' ? Constants.DATE_FORMAT_ES : Constants.DATE_FORMAT_EN;
    }

    // IS MTM FREE

    isAppFree(modalController: ModalController, ) {
        if (environment.isFree) {
            this.showToast(PageEnum.MODAL_INFO, ToastTypeEnum.WARNING, 'ALERT.PayForMTM', null, Constants.DELAY_TOAST_NORMAL);
            setTimeout(() => {
                this.closeModal(modalController);
            }, Constants.DELAY_TOAST_IS_FREE);
        }
    }

    async closeModal(modalController: ModalController, modalOuput: ModalOutputModel = new ModalOutputModel()) {
        await modalController.dismiss(modalOuput);
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
                        navigator[Constants.IONIC_APP].exitApp();
                        }
                    });
            });
        }
    }

    desactivateButtonExist() {
        this.exitButtonSubscripion.unsubscribe();
    }

    // LOADING

    async showLoader(parent: PageEnum) {
        this.desactivateButtonExist();
        const loader = await this.loadingController.create({
            spinner: 'bubbles',
            duration: 3000,
            message: this.translator.instant('Loading...'),
            translucent: true,
            cssClass: 'custom-loader-class',
            backdropDismiss: false
        });
        await loader.present();

        await loader.onDidDismiss().then(() => {
            this.activateButtonExist(parent);
        });
    }

    closeLoader() {
        this.loadingController.getTop().then(r => { if (!!r) { r.dismiss(); } } );
    }

    // CONFIRMS
    async showConfirm(parent: PageEnum, title: string, msg: string, buttonAccept: any, callbackCancel: any = () => {}) {
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
              pos: string = Constants.TOAST_POSITION_BOTTOM) {
        this.showMsgToast(parent, type, this.translator.instant(msg, data), delay, pos);
    }

    async showMsgToast(parent: PageEnum, type: ToastTypeEnum, msg: string, delay: number = Constants.DELAY_TOAST,
                       pos: any = Constants.TOAST_POSITION_BOTTOM) {
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
        toast.present();
    }

    // ALERTS

    alertInfo(parent: PageEnum, msg: string, header: string = 'ALERT.INFO') {
        this.alert(parent, header, msg);
    }

    async alert(parent: PageEnum, header: string, msg: string) {
        this.desactivateButtonExist();
        const alert = await this.alertController.create({
            header: this.translator.instant(header),
            subHeader: '',
            message: this.translator.instant(msg),
            buttons: [this.translator.instant(`COMMON.ACCEPT`)]
        });
        alert.onDidDismiss().then((dataReturned) => {
            this.activateButtonExist(parent);
        });
        await alert.present();
    }

    // POPOVERS

    async showPopover(parent: PageEnum, ev: any, modalComponent: any, inputModel: ModalInputModel) {
        this.desactivateButtonExist();
        const currentPopover = await this.popoverController.create({
            component: modalComponent,
            componentProps: inputModel,
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
          componentProps: inputModel
        });
        modal.onDidDismiss().then((dataReturned) => {
          this.activateButtonExist(parent);
        });
        await modal.present();
        return modal;
    }

}
