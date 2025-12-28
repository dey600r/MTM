import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Platform } from '@ionic/angular';

// SERVICES
import { ExportService } from './export.service';
import { CRUDService } from './crud.service';

// CONFIGURATIONS
import { ConstantsTest, SetupTest, SpyMockConfig } from '@testing/index';
import { Constants, ConstantsTable } from '@utils/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { LogService } from '../common';

describe('ExportService', () => {
    let service: ExportService;
    let crudService: CRUDService;
    let translate: TranslateService;
    let file: File;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: [...SpyMockConfig.ProvidersServices, LogService]
        }).compileComponents();
        service = TestBed.inject(ExportService);
        crudService = TestBed.inject(CRUDService);
        translate = TestBed.inject(TranslateService);
        file = TestBed.inject(File);
        await firstValueFrom(translate.use('es'));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get root real relative path', () => {
        const spyPlatform = spyOn(TestBed.inject(Platform), 'is').and.returnValue(true);
        expect(service.getRootRealRelativePath())
            .toEqual(`${Constants.OUTPUT_DIR_NAME}/`);
        expect(service.getRootRealRelativePath('hola'))
            .toEqual(`${Constants.OUTPUT_DIR_NAME}/hola`);
        expect(spyPlatform).toHaveBeenCalled();
    });

    it('should get real relative directory', () => {
        expect(service.getRealRelativeDirectory())
            .toEqual(ConstantsTest.PATH_EXTERNAL_DATA_DIRECTORY);
        file.externalDataDirectory = null;
        expect(service.getRealRelativeDirectory())
            .toEqual(`/Downloads`);
        file.externalDataDirectory = ConstantsTest.PATH_EXTERNAL_DATA_DIRECTORY;
    });

    it('should get path file', () => {
        expect(service.getPathFile('test.txt'))
            .toEqual(`${ConstantsTest.PATH_EXTERNAL_DATA_DIRECTORY}${Constants.OUTPUT_DIR_NAME}//test.txt`);
        expect(service.getPathFile('test.txt', 'hola'))
            .toEqual(`${ConstantsTest.PATH_EXTERNAL_DATA_DIRECTORY}${Constants.OUTPUT_DIR_NAME}/hola/test.txt`);
    });

    it('should create output directory', fakeAsync (() => {
        const spyPlatform = spyOn(TestBed.inject(Platform), 'is').and.returnValue(true);
        service.createOutputDirectory();
        tick();
        expect(spyPlatform).toHaveBeenCalled();
        expect(SpyMockConfig.SpyConfig.file.checkDir).toHaveBeenCalled();
    }));

    it('should not create output directory', fakeAsync(() => {
        const spyPlatform = spyOn(TestBed.inject(Platform), 'is').and.returnValue(true);
        SpyMockConfig.SpyConfig.file.checkDir = jasmine.createSpy().and.returnValue(Promise.reject());
        service.createOutputDirectory();
        tick();
        expect(spyPlatform).toHaveBeenCalled();
        expect(SpyMockConfig.SpyConfig.file.checkDir).toHaveBeenCalled();
        expect(SpyMockConfig.SpyConfig.file.createDir).toHaveBeenCalled();
        SpyMockConfig.SpyConfig.file.checkDir = jasmine.createSpy().and.returnValue(Promise.resolve());
    }));

    it('should not create output directory and error', fakeAsync(() => {
        const spyPlatform = spyOn(TestBed.inject(Platform), 'is').and.returnValue(true);
        SpyMockConfig.SpyConfig.file.checkDir = jasmine.createSpy().and.returnValue(Promise.reject());
        SpyMockConfig.SpyConfig.file.createDir = jasmine.createSpy().and.returnValue(Promise.reject());
        service.createOutputDirectory();
        tick();
        expect(spyPlatform).toHaveBeenCalled();
        expect(SpyMockConfig.SpyConfig.file.checkDir).toHaveBeenCalled();
        expect(SpyMockConfig.SpyConfig.file.createDir).toHaveBeenCalled();
        SpyMockConfig.SpyConfig.file.checkDir = jasmine.createSpy().and.returnValue(Promise.resolve());
        SpyMockConfig.SpyConfig.file.createDir = jasmine.createSpy().and.returnValue(Promise.resolve());
    }));

    it('should not create output directory and error and error', fakeAsync(() => {
        const spyPlatform = spyOn(TestBed.inject(Platform), 'is').and.returnValue(true);
        SpyMockConfig.SpyConfig.file.checkDir = jasmine.createSpy().and.returnValues(Promise.reject(), Promise.reject(), Promise.reject());
        SpyMockConfig.SpyConfig.file.createDir = jasmine.createSpy().and.returnValues(Promise.resolve(), Promise.reject(), Promise.reject());
        service.createOutputDirectory();
        tick();
        flush();
        expect(spyPlatform).toHaveBeenCalled();
        expect(SpyMockConfig.SpyConfig.file.checkDir).toHaveBeenCalled();
        expect(SpyMockConfig.SpyConfig.file.createDir).toHaveBeenCalled();
        SpyMockConfig.SpyConfig.file.checkDir = jasmine.createSpy().and.returnValue(Promise.resolve());
        SpyMockConfig.SpyConfig.file.createDir = jasmine.createSpy().and.returnValue(Promise.resolve());
    }));

    it('should generate name export file', () => {
        const today = new Date();
        expect(service.generateNameExportFile())
            .toEqual(`${Constants.EXPORT_FILE_NAME}_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}_` +
            `${today.getHours()}${today.getMinutes()}${today.getSeconds()}.${Constants.FORMAT_FILE_DB}`);
        expect(service.generateNameExportFile('test'))
            .toEqual(`test_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}_` +
            `${today.getHours()}${today.getMinutes()}${today.getSeconds()}.${Constants.FORMAT_FILE_DB}`);
    });

    it('should validate format JSON', () => {
        expect(service.validateStructureJsonDB('david', crudService.getAllTables())).toBeFalsy();
        expect(service.validateStructureJsonDB(`${ConstantsTable.TABLE_MTM_VEHICLE_TYPE}
        ${ConstantsTable.TABLE_MTM_OPERATION_TYPE}
        ${ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ}
        ${ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION}
        ${ConstantsTable.TABLE_MTM_VEHICLE}
        ${ConstantsTable.TABLE_MTM_CONFIGURATION}
        ${ConstantsTable.TABLE_MTM_OPERATION}
        ${ConstantsTable.TABLE_MTM_MAINTENANCE}
        ${ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT}
        ${ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT}
        ${ConstantsTable.TABLE_MTM_CONFIG_MAINT}
        ${ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL}`, crudService.getAllTables())).toBeTruthy();
    });
});
