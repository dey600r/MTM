import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DomController } from '@ionic/angular';

// SERVICES
import { ThemeService } from './theme.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

// CONFIGURATIONS
import { Constants } from '@utils/index';

describe('ThemeService', () => {
    let service: ThemeService;
    let dom: DomController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(ThemeService);
        dom = TestBed.inject(DomController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be call write dom controller to change theme', () => {
        const spy = spyOn(dom, 'write');
        service.changeTheme('');

        expect(spy).toHaveBeenCalled();
    });

    it('should be get LIGHT theme', fakeAsync(() => {
        service.changeTheme(Constants.SETTING_THEME_LIGHT);
        tick(1000);
        expect(document.documentElement.style.getPropertyValue('--ion-color-primary')).toEqual('');
    }));

    it('should be get SKY theme', fakeAsync(() => {
        service.changeTheme(Constants.SETTING_THEME_SKY);
        tick(1000);
        expect(document.documentElement.style.getPropertyValue('--ion-color-primary')).toEqual('#00B0B9');
    }));

    it('should be get DARK theme', fakeAsync(() => {
        service.changeTheme(Constants.SETTING_THEME_DARK);
        tick(1000);
        expect(document.documentElement.style.getPropertyValue('--ion-color-primary')).toEqual('#8ab4f8');
    }), 10000);
});
