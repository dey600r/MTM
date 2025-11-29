import { TestBed } from '@angular/core/testing';

// UTILS
import { Constants, WarningWearEnum } from '@utils/index';

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

    it('should get class progressbar from success/warning/danger/skull status', () => {
        expect(service.getClassProgressbar(WarningWearEnum.SUCCESS)).toEqual(' quizz-progress-success');
        expect(service.getClassProgressbar(WarningWearEnum.WARNING)).toEqual(' quizz-progress-warning');
        expect(service.getClassProgressbar(WarningWearEnum.DANGER)).toEqual(' quizz-progress-danger');
        expect(service.getClassProgressbar(WarningWearEnum.SKULL)).toEqual(' quizz-progress-danger');
    });

    it('should get class icon from success/warning/danger/skull status', () => {
        expect(service.getClassIcon(WarningWearEnum.SUCCESS)).toEqual(' icon-color-success');
        expect(service.getClassIcon(WarningWearEnum.WARNING)).toEqual(' icon-color-warning');
        expect(service.getClassIcon(WarningWearEnum.DANGER)).toEqual(' icon-color-danger');
        expect(service.getClassIcon(WarningWearEnum.SKULL)).toEqual(' icon-color-skull');
    });

    it('should get class cardprogressbar from success/warning/danger/skull status', () => {
        expect(service.getClassCardProgressbar(WarningWearEnum.SUCCESS)).toEqual(' card-progress-success');
        expect(service.getClassCardProgressbar(WarningWearEnum.WARNING)).toEqual(' card-progress-warning');
        expect(service.getClassCardProgressbar(WarningWearEnum.DANGER)).toEqual(' card-progress-danger');
        expect(service.getClassCardProgressbar(WarningWearEnum.SKULL)).toEqual(' card-progress-danger');
    });

    it('should get icon km/month from success/warning/danger/skull status', () => {
        expect(service.getIconKms(WarningWearEnum.SUCCESS)).toEqual('checkmark-circle');
        expect(service.getIconKms(WarningWearEnum.WARNING)).toEqual('warning');
        expect(service.getIconKms(WarningWearEnum.DANGER)).toEqual('nuclear');
        expect(service.getIconKms(WarningWearEnum.SKULL)).toEqual('skull');
    });
    
    it('should load icon dashboard', () => {
        expect(service.loadIconDashboard([])).toEqual('information-circle');
        expect(service.loadIconDashboard([1, 2])).toEqual('bar-chart');
    });

    it('should load icon search', () => {
        expect(service.loadIconSearch(true)).toEqual('filter');
        expect(service.loadIconSearch(false)).toEqual('filter-circle');
    });

    it('should load icon vehicle', () => {
        expect(service.getIconVehicle(Constants.VEHICLE_TYPE_CODE_MOTO)).toEqual('bicycle');
        expect(service.getIconVehicle(Constants.VEHICLE_TYPE_CODE_CAR)).toEqual('car-sport');
        expect(service.getIconVehicle('other')).toEqual('car');
    });

    it('should load icon operation', () => {
        expect(service.getIconOperationType(Constants.OPERATION_TYPE_MAINTENANCE_HOME)).toEqual('build');
        expect(service.getIconOperationType(Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP)).toEqual('build');
        expect(service.getIconOperationType(Constants.OPERATION_TYPE_FAILURE_HOME)).toEqual('hammer');
        expect(service.getIconOperationType(Constants.OPERATION_TYPE_FAILURE_WORKSHOP)).toEqual('hammer');
        expect(service.getIconOperationType(Constants.OPERATION_TYPE_CLOTHES)).toEqual('shirt');
        expect(service.getIconOperationType(Constants.OPERATION_TYPE_ACCESSORIES)).toEqual('gift');
        expect(service.getIconOperationType(Constants.OPERATION_TYPE_TOOLS)).toEqual('construct');
        expect(service.getIconOperationType(Constants.OPERATION_TYPE_OTHER)).toEqual('body');
        expect(service.getIconOperationType(Constants.OPERATION_TYPE_SPARE_PARTS)).toEqual('repeat');
        expect(service.getIconOperationType('test')).toEqual('repeat');
    });

    it('should load icon maintenance frequency', () => {
        expect(service.getIconMaintenance(Constants.MAINTENANCE_FREQ_ONCE_CODE)).toEqual('alarm');
        expect(service.getIconMaintenance(Constants.MAINTENANCE_FREQ_CALENDAR_CODE)).toEqual('calendar');
        expect(service.getIconMaintenance('test')).toEqual('alarm');
    });

    it('should load icon maintenance element', () => {
        expect(service.getIconReplacement(1)).toEqual('disc');
        expect(service.getIconReplacement(2)).toEqual('disc');
        expect(service.getIconReplacement(22)).toEqual('disc');
        expect(service.getIconReplacement(4)).toEqual('basket');
        expect(service.getIconReplacement(6)).toEqual('flash');
        expect(service.getIconReplacement(9)).toEqual('thermometer');
        expect(service.getIconReplacement(14)).toEqual('thermometer');
        expect(service.getIconReplacement(15)).toEqual('thermometer');
        expect(service.getIconReplacement(3)).toEqual('color-fill');
        expect(service.getIconReplacement(11)).toEqual('layers');
        expect(service.getIconReplacement(13)).toEqual('layers');
        expect(service.getIconReplacement(16)).toEqual('layers');
        expect(service.getIconReplacement(18)).toEqual('eyedrop');
        expect(service.getIconReplacement(19)).toEqual('eyedrop');
        expect(service.getIconReplacement(10)).toEqual('settings');
        expect(service.getIconReplacement(24)).toEqual('battery-charging');
        expect(service.getIconReplacement(30)).toEqual('barcode');
        expect(service.getIconReplacement(31)).toEqual('barcode');
        expect(service.getIconReplacement(35)).toEqual('cube');
        expect(service.getIconReplacement(41)).toEqual('bulb');
        expect(service.getIconReplacement(56)).toEqual('bandage');
        expect(service.getIconReplacement(66)).toEqual('briefcase');
    });

});
