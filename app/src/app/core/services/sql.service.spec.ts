import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// SERVICES
import { SqlService } from './sql.service';
import { IconService } from './icon.service';

// CONFIGURATIONS
import { MockData, MockTranslate, SetupTest } from '@testing/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import { MaintenanceElementModel, MaintenanceFreqModel, OperationTypeModel, VehicleModel, VehicleTypeModel } from '@models/index';

// UTILS
import { Constants, ConstantsColumns } from '@utils/index';

describe('SqlService', () => {
    let service: SqlService;
    let translate: TranslateService;
    let iconService: IconService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
        }).compileComponents();
        service = TestBed.inject(SqlService);
        iconService = TestBed.inject(IconService);
        translate = TestBed.inject(TranslateService);
        await firstValueFrom(translate.use('es'));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize maintenance frequency table without maintenance', () => {
        const mock: MaintenanceFreqModel = MockData.MaintenanceFreqsAux[0];
        let result: MaintenanceFreqModel[] = service.mapMaintenanceFreq(getStructureDatabase([{
            [ConstantsColumns.COLUMN_MTM_ID]: mock.id,
            [ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_CODE]: mock.code,
            [ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_DESCRIPTION]: mock.description
        }]));
        let icon = iconService.getIconMaintenance(mock.code);

        expect(result[0].id).toEqual(mock.id);
        expect(result[0].code).toEqual(mock.code);
        expect(result[0].description).toEqual(MockTranslate.ES.DB.ONCE);
        expect(result[0].icon).toEqual(icon);
    });

    it('should initialize maintenance frequency table with maintenance', () => {
        const mock: MaintenanceFreqModel = MockData.MaintenanceFreqsAux[0];
        let result: MaintenanceFreqModel = service.getMapMaintenanceFreq({
            'idMaintenanceFreq': mock.id,
            'codeMaintenanceFreq': mock.code,
            'descriptionMaintenanceFreq': mock.description
        }, true);
        let icon = iconService.getIconMaintenance(mock.code);
        
        expect(result.id).toEqual(mock.id);
        expect(result.code).toEqual(mock.code);
        expect(result.description).toEqual(MockTranslate.ES.DB.ONCE);
        expect(result.icon).toEqual(icon);
    });

    it('should initialize maintenance element table without operation', () => {
        const mock: MaintenanceElementModel = MockData.MaintenanceElementsAux[0];
        let result: MaintenanceElementModel[] = service.mapMaintenanceElement(getStructureDatabase([{
            [ConstantsColumns.COLUMN_MTM_ID]: mock.id,
            [ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME]: mock.name,
            [ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION]: mock.description,
            [ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER]: (mock.master ? Constants.DATABASE_YES : Constants.DATABASE_NO),
        }]));
        let icon = iconService.getIconReplacement(mock.id);

        expect(result[0].id).toEqual(mock.id);
        expect(result[0].name).toEqual(MockTranslate.ES.DB.FRONT_WHEEL);
        expect(result[0].description).toEqual(MockTranslate.ES.DB.CHANGE_FRONT_WHEEL);
        expect(result[0].icon).toEqual(icon);
    });

    it('should initialize maintenance element table with operation', () => {
        const mock: MaintenanceElementModel = MockData.MaintenanceElementsAux[0];
        let result: MaintenanceElementModel = service.getMapMaintenanceElement({
            'idMaintenanceElement': mock.id,
            'nameMaintenanceElement': mock.name,
            'descriptionMaintenanceElement': mock.description,
            'masterMaintenanceElement': (mock.master ? Constants.DATABASE_YES : Constants.DATABASE_NO),
            'priceOpMaintenanceElement': mock.price
        }, true);
        let icon = iconService.getIconReplacement(mock.id);

        expect(result.id).toEqual(mock.id);
        expect(result.name).toEqual(MockTranslate.ES.DB.FRONT_WHEEL);
        expect(result.description).toEqual(MockTranslate.ES.DB.CHANGE_FRONT_WHEEL);
        expect(result.icon).toEqual(icon);
    });

    it('should initialize vehicle type table without vehicle', () => {
        const mock: VehicleTypeModel = MockData.VehicleTypesAux[0];
        let result: MaintenanceFreqModel[] = service.mapVehicleType(getStructureDatabase([{
                    [ConstantsColumns.COLUMN_MTM_ID]: mock.id,
                    [ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_CODE]: mock.code,
                    [ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_DESCRIPTION]: mock.description
        }]));
        let icon = iconService.getIconVehicle(mock.code);

        expect(result[0].id).toEqual(mock.id);
        expect(result[0].code).toEqual(mock.code);
        expect(result[0].description).toEqual(MockTranslate.ES.DB.MOTORBIKE);
        expect(result[0].icon).toEqual(icon);
    });

    it('should initialize vehicle type table with vehicle', () => {
        const mock: VehicleTypeModel = MockData.VehicleTypesAux[0];
        let result: MaintenanceFreqModel = service.getMapVehicleType({
            'idVehicleType': mock.id,
            'codeVehicleType': mock.code,
            'descriptionVehicleType': mock.description
        }, true);
        let icon = iconService.getIconVehicle(mock.code);
        
        expect(result.id).toEqual(mock.id);
        expect(result.code).toEqual(mock.code);
        expect(result.description).toEqual(MockTranslate.ES.DB.MOTORBIKE);
        expect(result.icon).toEqual(icon);
    });

    it('should initialize vehicle table', () => {
        const mock: VehicleModel = MockData.VehiclesAux[0];
        let result: VehicleModel[] = service.mapVehicle(getStructureDatabase([{
            [ConstantsColumns.COLUMN_MTM_ID]: 1,
            [ConstantsColumns.COLUMN_MTM_VEHICLE_MODEL]: mock.model,
            [ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND]: mock.brand,
            [ConstantsColumns.COLUMN_MTM_VEHICLE_YEAR]: mock.year,
            [ConstantsColumns.COLUMN_MTM_VEHICLE_KM]: mock.km,
            [ConstantsColumns.COLUMN_MTM_VEHICLE_KMS_PER_MONTH]: mock.kmsPerMonth,
            [ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_KMS]: mock.dateKms,
            [ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_PURCHASE]: mock.datePurchase,
            [ConstantsColumns.COLUMN_MTM_VEHICLE_ACTIVE]: (mock.active ? Constants.DATABASE_YES : Constants.DATABASE_NO)
        }]));

        expect(result[0].id).toEqual(mock.id);
        expect(result[0].brand).toEqual(mock.brand);
        expect(result[0].model).toEqual(mock.model);
        expect(result[0].year).toEqual(mock.year);
        expect(result[0].km).toEqual(mock.km);
        expect(result[0].kmsPerMonth).toEqual(mock.kmsPerMonth);
        expect(result[0].dateKms).toEqual(mock.dateKms);
        expect(result[0].datePurchase).toEqual(mock.datePurchase);
        expect(result[0].active).toBeTrue();
        expect(result[0].kmEstimated).toBeGreaterThan(result[0].km);
    });

    it('should initialize operation type table without operation', () => {
        const mock: OperationTypeModel = MockData.OperationTypesAux[0];
        let result: OperationTypeModel[] = service.mapOperationType(getStructureDatabase([{
            [ConstantsColumns.COLUMN_MTM_ID]: mock.id,
            [ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_CODE]: mock.code,
            [ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION]: mock.description
        }]));
        let icon = iconService.getIconOperationType(mock.code);

        expect(result[0].id).toEqual(mock.id);
        expect(result[0].code).toEqual(mock.code);
        expect(result[0].description).toEqual(MockTranslate.ES.DB.MAINTENANCE_WORKSHOP);
        expect(result[0].icon).toEqual(icon);
    });

    it('should initialize operation type table with operation', () => {
        const mock: OperationTypeModel = MockData.OperationTypesAux[0];
        let result: OperationTypeModel = service.getMapOperationType({
            'idOperationType': mock.id,
            'codeOperationType': mock.code,
            'descriptionOperationType': mock.description
        }, true);
        let icon = iconService.getIconOperationType(mock.code);
        
        expect(result.id).toEqual(mock.id);
        expect(result.code).toEqual(mock.code);
        expect(result.description).toEqual(MockTranslate.ES.DB.MAINTENANCE_WORKSHOP);
        expect(result.icon).toEqual(icon);
    });

    function getStructureDatabase(data: any[]): any {
        return { 
            rows : {
                length: data.length,
                item: (i: number) => { 
                    return data[i];
                }
        }};
    }
});
