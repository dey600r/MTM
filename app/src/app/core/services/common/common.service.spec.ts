import { TestBed } from '@angular/core/testing';

// SERVICES
import { CommonService } from './common.service';

// CONFIGURATIONS
import { MockAppData } from '@testing/index';

// UTILS
import { Constants } from '@utils/index';

describe('CommonService', () => {
    let service: CommonService;

    beforeEach(() => {
        TestBed.configureTestingModule({}).compileComponents();
        service = TestBed.inject(CommonService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be calculate version', () => {
        expect(service.getVersion('v3.2.1')).toEqual(3021);
    });

    it('should validate if the operation is failure', () => {
        MockAppData.OperationTypes.forEach(x => {
            expect(service.isEventFailure(x.code)).toEqual((x.code === Constants.OPERATION_TYPE_FAILURE_HOME || x.code === Constants.OPERATION_TYPE_FAILURE_WORKSHOP));
        });
    });

    it('should validate if the operation is preventive', () => {
        MockAppData.OperationTypes.forEach(x => {
            expect(service.isEventPreventive(x.code)).toEqual((x.code === Constants.OPERATION_TYPE_MAINTENANCE_HOME || x.code === Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP));
        });
    });

    it('should validate if the operation is with replacement', () => {
        MockAppData.OperationTypes.forEach(x => {
            expect(service.isOperationWithReplacement(x.code)).toEqual(
                (x.code === Constants.OPERATION_TYPE_MAINTENANCE_HOME || x.code === Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP) ||
                (x.code === Constants.OPERATION_TYPE_FAILURE_HOME || x.code === Constants.OPERATION_TYPE_FAILURE_WORKSHOP));
        });
    });
});
