import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// SERVICES
import { SettingsService } from './settings.service';
import { DataBaseService } from './data-base.service';
import { SqlService } from './sql.service';

// CONFIGURATIONS
import { ConstantsTest, MockData, MockTranslate, SetupTest, SpyMockConfig } from '@testing/index';
import { Constants } from '@utils/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';
import { File } from '@awesome-cordova-plugins/file/ngx';

describe('SettingsService', () => {
    let service: SettingsService;
    let translate: TranslateService;
    let dbService: DataBaseService;
    let sqlService: SqlService;
    let file: File;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(SettingsService);
        translate = TestBed.inject(TranslateService);
        dbService = TestBed.inject(DataBaseService);
        sqlService = TestBed.inject(SqlService);
        file = TestBed.inject(File);
        await firstValueFrom(translate.use('es'));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get list distance - EN', () => {
        const result = service.getListDistance();
        expect(result[0].code).toEqual(Constants.SETTING_DISTANCE_KM);
        expect(result[0].value).toEqual(MockTranslate.ES.COMMON.KM);
        expect(result[0].valueLarge).toEqual(MockTranslate.ES.COMMON.KILOMETERS);
        expect(result[1].code).toEqual(Constants.SETTING_DISTANCE_MILES);
        expect(result[1].value).toEqual(MockTranslate.ES.COMMON.MI);
        expect(result[1].valueLarge).toEqual(MockTranslate.ES.COMMON.MILES);
    });

    it('should get list distance - EN', async () => {
        await firstValueFrom(translate.use('en'));
        const result = service.getListDistance();
        expect(result[0].value).toEqual(MockTranslate.EN.COMMON.KM);
        expect(result[0].valueLarge).toEqual(MockTranslate.EN.COMMON.KILOMETERS);
        expect(result[1].value).toEqual(MockTranslate.EN.COMMON.MI);
        expect(result[1].valueLarge).toEqual(MockTranslate.EN.COMMON.MILES);
    });

    it('should get list money - EN', () => {
        const result = service.getListMoney();
        expect(result[0].code).toEqual(Constants.SETTING_MONEY_EURO);
        expect(result[0].value).toEqual('€');
        expect(result[0].valueLarge).toEqual(MockTranslate.ES.COMMON.EURO);
        expect(result[1].code).toEqual(Constants.SETTING_MONEY_DOLLAR);
        expect(result[1].value).toEqual('$');
        expect(result[1].valueLarge).toEqual(MockTranslate.ES.COMMON.DOLLAR);
        expect(result[2].code).toEqual(Constants.SETTING_MONEY_POUND);
        expect(result[2].value).toEqual('£');
        expect(result[2].valueLarge).toEqual(MockTranslate.ES.COMMON.POUND);
    });

    it('should get list money - EN', async () => {
        await firstValueFrom(translate.use('en'));
        const result = service.getListMoney();
        expect(result[0].valueLarge).toEqual(MockTranslate.EN.COMMON.EURO);
        expect(result[1].valueLarge).toEqual(MockTranslate.EN.COMMON.DOLLAR);
        expect(result[2].valueLarge).toEqual(MockTranslate.EN.COMMON.POUND);
    });

    it('should get list theme - EN', () => {
        const result = service.getListThemes();
        expect(result[0].code).toEqual(Constants.SETTING_THEME_LIGHT);
        expect(result[0].value).toEqual(MockTranslate.ES.COMMON.LIGHT);
        expect(result[0].valueLarge).toEqual(Constants.SETTING_THEME_LIGHT);
        expect(result[1].code).toEqual(Constants.SETTING_THEME_DARK);
        expect(result[1].value).toEqual(MockTranslate.ES.COMMON.DARK);
        expect(result[1].valueLarge).toEqual(Constants.SETTING_THEME_DARK);
        expect(result[2].code).toEqual(Constants.SETTING_THEME_SKY);
        expect(result[2].value).toEqual(MockTranslate.ES.COMMON.SKY);
        expect(result[2].valueLarge).toEqual(Constants.SETTING_THEME_SKY);
    });

    it('should get list theme - EN', async () => {
        await firstValueFrom(translate.use('en'));
        const result = service.getListThemes();
        expect(result[0].value).toEqual(MockTranslate.EN.COMMON.LIGHT);
        expect(result[1].value).toEqual(MockTranslate.EN.COMMON.DARK);
        expect(result[2].value).toEqual(MockTranslate.EN.COMMON.SKY);
    });

    it('should get distance', () => {
        const result = service.getDistanceSelected(MockData.SystemConfigurations);
        expect(result.code).toEqual(Constants.SETTING_DISTANCE_KM);
        expect(result.value).toEqual(MockTranslate.ES.COMMON.KM);
        expect(result.valueLarge).toEqual(MockTranslate.ES.COMMON.KILOMETERS);
    });

    it('should get money', () => {
        const result = service.getMoneySelected(MockData.SystemConfigurations);
        expect(result.code).toEqual(Constants.SETTING_MONEY_EURO);
        expect(result.value).toEqual('€');
        expect(result.valueLarge).toEqual(MockTranslate.ES.COMMON.EURO);
    });

    it('should get theme', () => {
        const result = service.getThemeSelected(MockData.SystemConfigurations);
        expect(result.code).toEqual(Constants.SETTING_THEME_DARK);
        expect(result.value).toEqual(MockTranslate.ES.COMMON.DARK);
        expect(result.valueLarge).toEqual(Constants.SETTING_THEME_DARK);
    });

    it('should save system configuration key', () => {
        jasmine.getEnv().allowRespy(true); // ALLOW MULTIPLE RESPY
        const spyDBService = spyOn(dbService, 'executeScriptDataBase');
        const spySqlService = spyOn(sqlService, 'updateSqlSystemConfiguration');
        spySqlService.calls.reset(); // RESET CALLS TO VERIFY CALLS
        service.saveSystemConfiguration(Constants.KEY_CONFIG_THEME, Constants.SETTING_THEME_DARK);
        expect(spyDBService).toHaveBeenCalledTimes(1);
        expect(spySqlService).toHaveBeenCalledTimes(1);
    });

    it('should not save system configuration key', () => {
        jasmine.getEnv().allowRespy(true); // ALLOW MULTIPLE RESPY
        const spyDBService = spyOn(dbService, 'executeScriptDataBase');
        const spySqlService = spyOn(sqlService, 'updateSqlSystemConfiguration');
        spySqlService.calls.reset(); // RESET CALLS TO VERIFY CALLS
        service.saveSystemConfiguration(Constants.KEY_CONFIG_THEME, null);
        expect(spyDBService).toHaveBeenCalledTimes(0);
        expect(spySqlService).toHaveBeenCalledTimes(0);
    });

    it('should insert system configuration key', () => {
        jasmine.getEnv().allowRespy(true); // ALLOW MULTIPLE RESPY
        const spyDBServiceSystem = spyOn(dbService, 'getSystemConfigurationData').and.returnValue([]);
        const spyDBService = spyOn(dbService, 'executeScriptDataBase');
        const spySqlService = spyOn(sqlService, 'insertSqlSystemConfiguration').and.returnValue('sql');
        spySqlService.calls.reset(); // RESET CALLS TO VERIFY CALLS
        service.insertSystemConfiguration();
        expect(spyDBServiceSystem).toHaveBeenCalledTimes(1);
        expect(spyDBService).toHaveBeenCalledTimes(1);
        expect(spySqlService).toHaveBeenCalledTimes(3);
    });

    it('should not insert system configuration key', () => {
        jasmine.getEnv().allowRespy(true); // ALLOW MULTIPLE RESPY
        const spyDBServiceSystem = spyOn(dbService, 'getSystemConfigurationData').and.returnValue(MockData.SystemConfigurations);
        const spyDBService = spyOn(dbService, 'executeScriptDataBase');
        const spySqlService = spyOn(sqlService, 'insertSqlSystemConfiguration').and.returnValue('sql');
        spySqlService.calls.reset(); // RESET CALLS TO VERIFY CALLS
        service.insertSystemConfiguration();
        expect(spyDBServiceSystem).toHaveBeenCalledTimes(1);
        expect(spyDBService).toHaveBeenCalledTimes(0);
        expect(spySqlService).toHaveBeenCalledTimes(0);
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
