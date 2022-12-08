import { TestBed } from '@angular/core/testing';

// UTILS
import { WarningWearEnum } from '@utils/index';

// SERVICES
import { IconService } from './icon.service';

describe('IconService', () => {
    let service: IconService;

    beforeEach(() => {
        service = TestBed.inject(IconService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get class progressbar from success status', () => {
        expect(service.getClassProgressbar(WarningWearEnum.SUCCESS)).toEqual(' quizz-progress-success');
    });

    it('should get class progressbar from warning status', () => {
        expect(service.getClassProgressbar(WarningWearEnum.WARNING)).toEqual(' quizz-progress-warning');
    });

    it('should get class progressbar from danger/skull status', () => {
        expect(service.getClassProgressbar(WarningWearEnum.DANGER)).toEqual(' quizz-progress-danger');
        expect(service.getClassProgressbar(WarningWearEnum.SKULL)).toEqual(' quizz-progress-danger');
    });

    it('should get class icon from success status', () => {
        expect(service.getClassIcon(WarningWearEnum.SUCCESS)).toEqual(' icon-color-success');
    });

    it('should get class icon from warning status', () => {
        expect(service.getClassIcon(WarningWearEnum.WARNING)).toEqual(' icon-color-warning');
    });

    it('should get class icon from danger status', () => {
        expect(service.getClassIcon(WarningWearEnum.DANGER)).toEqual(' icon-color-danger');
    });

    it('should get class icon from skull status', () => {
        expect(service.getClassIcon(WarningWearEnum.SKULL)).toEqual(' icon-color-skull');
    });

    it('should get icon km/month from success status', () => {
        expect(service.getIconKms(WarningWearEnum.SUCCESS)).toEqual('checkmark-circle');
    });

    it('should get icon km/month from warning status', () => {
        expect(service.getIconKms(WarningWearEnum.WARNING)).toEqual('warning');
    });

    it('should get icon km/month from danger status', () => {
        expect(service.getIconKms(WarningWearEnum.DANGER)).toEqual('nuclear');
    });

    it('should get icon km/month from skull status', () => {
        expect(service.getIconKms(WarningWearEnum.SKULL)).toEqual('skull');
    });
    
    it('should load info icon dashboard', () => {
        expect(service.loadIconDashboard([])).toEqual('information-circle');
    });

    it('should load bar char icon dashboard', () => {
        expect(service.loadIconDashboard([1, 2])).toEqual('bar-chart');
    });

    it('should load filter icon search', () => {
        expect(service.loadIconSearch(true)).toEqual('filter');
    });

    it('should load filter circle icon search', () => {
        expect(service.loadIconSearch(false)).toEqual('filter-circle');
    });
});
