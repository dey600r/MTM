import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';

// SERVICES
import { PlatformService } from './platform.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

describe('PlatformService', () => {
    let service: PlatformService;
    let platform: Platform;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(PlatformService);
        platform = TestBed.inject(Platform);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should identify the platform android correctly', () => {
        const platformIs = spyOn(platform, 'is').and.returnValues(true, true);
        expect(service.isAndroid()).toBe(true);
        expect(platformIs).toHaveBeenCalledWith('android');
        expect(platformIs).toHaveBeenCalledWith('cordova');
    });

    it('should identify the platform desktop correctly', () => {
        const platformIs = spyOn(platform, 'is').and.returnValues(true);
        expect(service.isDesktop()).toBe(true);
        expect(platformIs).toHaveBeenCalledWith('desktop');
    });

    it('should get width of the platform correctly', () => {
        const platformWidth = spyOn(platform, 'width').and.returnValues(100);
        expect(service.getWidth()).toBe(100);
        expect(platformWidth).toHaveBeenCalledWith();
    });

    it('should get height of the platform correctly', () => {
        const platformHeight = spyOn(platform, 'height').and.returnValues(100);
        expect(service.getHeight()).toBe(100);
        expect(platformHeight).toHaveBeenCalledWith();
    });

    it('should get backbutton of the platform correctly', () => {
        expect(service.getBackButton()).toBeDefined();
    });

    it('should get ready of the platform correctly', () => {
        const platformReady = spyOn(platform, 'ready').and.returnValues(Promise.resolve('ok'));
        expect(service.getReady()).toBeDefined();
        expect(platformReady).toHaveBeenCalledWith();
    });
});
