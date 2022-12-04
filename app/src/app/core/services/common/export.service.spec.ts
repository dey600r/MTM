import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// SERVICES
import { ExportService } from './export.service';

// CONFIGURATIONS
import { ConstantsTest, SetupTest, SpyMockConfig } from '@testing/index';
import { Constants } from '@utils/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';
import { File } from '@awesome-cordova-plugins/file/ngx';

describe('ExportService', () => {
    let service: ExportService;
    let translate: TranslateService;
    let file: File;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(ExportService);
        translate = TestBed.inject(TranslateService);
        file = TestBed.inject(File);
        await firstValueFrom(translate.use('es'));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get data directory', () => {
        expect(service.getDataDirectory()).toEqual(ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY);
        file.externalRootDirectory = null;
        expect(service.getDataDirectory()).toEqual(ConstantsTest.PATH_DATA_DIRECTORY);
        file.externalRootDirectory = ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY;
    });

    it('should get root directory', () => {
        expect(service.getRootDirectory()).toEqual(ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY);
        file.externalRootDirectory = null;
        expect(service.getRootDirectory()).toEqual('');
        file.externalRootDirectory = ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY;
    });

    it('should get root path files', () => {
        expect(service.getRootPathFiles())
            .toEqual(`${ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY}${Constants.OUTPUT_DIR_NAME}/`);
        expect(service.getRootPathFiles('hola'))
            .toEqual(`${ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY}${Constants.OUTPUT_DIR_NAME}/hola`);
    });

    it('should get root relative path', () => {
        expect(service.getRootRelativePath())
            .toEqual(`${Constants.OUTPUT_DIR_NAME}/`);
        expect(service.getRootRelativePath('hola'))
            .toEqual(`${Constants.OUTPUT_DIR_NAME}/hola`);
    });

    it('should get root real relative path', () => {
        expect(service.getRootRealRelativePath())
            .toEqual(`${Constants.OUTPUT_DIR_NAME}/`);
        expect(service.getRootRealRelativePath('hola'))
            .toEqual(`${Constants.OUTPUT_DIR_NAME}/hola`);
    });

    it('should get real relative directory', () => {
        expect(service.getRealRelativeDirectory())
            .toEqual(ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY);
        file.externalRootDirectory = null;
        expect(service.getRealRelativeDirectory())
            .toEqual(`C:\\Users\\<USER>\\AppData\\Local\\Packages\\<52193DeyHome.MotortrackManager>\\LocalState\\${Constants.OUTPUT_DIR_NAME}`);
        file.externalRootDirectory = ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY;
    });

    it('should get real path windows', () => {
        expect(service.getRealPathWindows())
            .toEqual(`C:\\Users\\<USER>\\AppData\\Local\\Packages\\<52193DeyHome.MotortrackManager>\\LocalState\\${Constants.OUTPUT_DIR_NAME}`);
    });

    it('should get path file', () => {
        expect(service.getPathFile('test.txt'))
            .toEqual(`${ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY}${Constants.OUTPUT_DIR_NAME}//test.txt`);
        expect(service.getPathFile('test.txt', 'hola'))
            .toEqual(`${ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY}${Constants.OUTPUT_DIR_NAME}/hola/test.txt`);
    });

    it('should create output directory', fakeAsync (() => {
        service.createOutputDirectory();
        tick();
        expect(SpyMockConfig.SpyConfig.file.checkDir).toHaveBeenCalled();
    }));

    it('should not create output directory', fakeAsync(() => {
        SpyMockConfig.SpyConfig.file.checkDir = jasmine.createSpy().and.returnValue(Promise.reject());
        service.createOutputDirectory();
        tick();
        expect(SpyMockConfig.SpyConfig.file.checkDir).toHaveBeenCalled();
        expect(SpyMockConfig.SpyConfig.file.createDir).toHaveBeenCalled();
        SpyMockConfig.SpyConfig.file.checkDir = jasmine.createSpy().and.returnValue(Promise.resolve());
    }));

    it('should not create output directory and error', fakeAsync(() => {
        SpyMockConfig.SpyConfig.file.checkDir = jasmine.createSpy().and.returnValue(Promise.reject());
        SpyMockConfig.SpyConfig.file.createDir = jasmine.createSpy().and.returnValue(Promise.reject());
        service.createOutputDirectory();
        tick();
        expect(SpyMockConfig.SpyConfig.file.checkDir).toHaveBeenCalled();
        expect(SpyMockConfig.SpyConfig.file.createDir).toHaveBeenCalled();
        SpyMockConfig.SpyConfig.file.checkDir = jasmine.createSpy().and.returnValue(Promise.resolve());
        SpyMockConfig.SpyConfig.file.createDir = jasmine.createSpy().and.returnValue(Promise.resolve());
    }));

    it('should not create output directory and error and error', fakeAsync(() => {
        SpyMockConfig.SpyConfig.file.checkDir = jasmine.createSpy().and.returnValues(Promise.reject(), Promise.reject());
        SpyMockConfig.SpyConfig.file.createDir = jasmine.createSpy().and.returnValues(Promise.resolve(), Promise.reject());
        service.createOutputDirectory();
        tick();
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
});
