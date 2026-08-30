import { inject, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BackButtonEmitter } from '@ionic/angular/common/providers/platform';

@Injectable({
    providedIn: 'root'
})
export class PlatformService {
    private platform = inject(Platform);

    constructor() {}

    isAndroid(): boolean {
        return this.platform.is('android') && this.platform.is('cordova');
    }

    isDesktop(): boolean {
        return this.platform.is('desktop');
    }

    getWidth(): number {
        return this.platform.width();
    }

    getHeight(): number {
        return this.platform.height();
    }

    getBackButton(): BackButtonEmitter {
        return this.platform.backButton;
    }

    getReady(): Promise<string> {
        return this.platform.ready();
    }
}