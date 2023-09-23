import { AngularDelegate, ModalController, NavParams, Platform, PopoverController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

// PLUGINS
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { ControlService, DataBaseService, DataService, ExportService, LogService } from '@services/index';
import { DateFormatCalendarPipe } from '@pipes/date-format-calendar.pipe';

// MOCK
import { MockData } from '../mocks/mock-data.spec';
import { ModalInputModel } from '@src/app/core/models';
import { ConstantsTest } from './constants.spec';


export class SpyMockConfig {
    static SpyConfig = {
        statusBar: jasmine.createSpyObj('StatusBar', ['styleBlackTranslucent']),
        splashScreenSpy: jasmine.createSpyObj('SplashScreen', ['hide']),
        platformReadySpy: Promise.resolve(),
        platformSpy: {
            ready: jasmine.createSpy().and.returnValue(Promise.resolve()),
            backButton: {
                subscribeWithPriority: jasmine.createSpy('subscribeWithPriority', (priority, fn) => true)
            },
            is: jasmine.createSpy().and.returnValue((platform: any): boolean => (platform === 'android')),
            width: jasmine.createSpy().and.returnValue(800),
            height: jasmine.createSpy().and.returnValue(700),
        },
        screenOrientation: {
            onChange: jasmine.createSpy().and.returnValue(new Observable((res) => { res.next(); }))
        },
        file: {
            checkDir: jasmine.createSpy().and.returnValue(Promise.resolve()),
            checkFile: jasmine.createSpy().and.returnValue(Promise.resolve()),
            readAsText: jasmine.createSpy().and.returnValue(Promise.resolve()),
            writeExistingFile: jasmine.createSpy().and.returnValue(Promise.resolve()),
            createDir: jasmine.createSpy().and.returnValue(Promise.resolve()),
            createFile: jasmine.createSpy().and.returnValue(Promise.resolve()),
            listDir: jasmine.createSpy().and.returnValue(Promise.resolve([{ name: 'test.json' }])),
            externalRootDirectory: ConstantsTest.PATH_EXTERNAL_ROOT_DIRECTORY,
            dataDirectory: ConstantsTest.PATH_DATA_DIRECTORY
        },
        dbService: jasmine.createSpyObj('DataBaseService', ['initDB',]),
        dataService: jasmine.createSpyObj('DataService', 
            ['getSystemConfiguration', 'getSystemConfigurationData',
            'getConfigurations', 'getConfigurationsData', 'getVehicles', 'getVehiclesData', 'getVehicleTypeData',
            'getOperations', 'getOperationsData', 'getOperationTypeData', 'getMaintenance', 'getMaintenanceData',
            'getMaintenanceElement', 'getMaintenanceElementData', 'getVehicleType', 'getOperationType',
            'getMaintenanceFreq', 'getMaintenanceFreqData']),
        controlService: jasmine.createSpyObj('ControlService', ['activateButtonExist', 'isAppFree', 'activeSegmentScroll', 'alertCustom']),
        exportService: jasmine.createSpyObj('ExportService', ['createOutputDirectory']),
        logService: jasmine.createSpyObj('LogService', ['logInfo', 'getDataDirectory']),
        sqliteObject: jasmine.createSpyObj('SQLiteObject', ['executeSql']),
        sqlitePorter: jasmine.createSpyObj('SQLitePorter', ['importSqlToDb']),
        windows: {
            localStorage: jasmine.createSpyObj('localStorage', ['getItem', 'setItem'])
        }
    };

    static Providers = [
        TranslateService,
        SQLitePorter,
        ModalController,
        AngularDelegate,
        PopoverController,
        DateFormatCalendarPipe,
        InAppBrowser,
        //{ provide: LogService, useValue: SpyMockConfig.SpyConfig.logService },
        { provide: StatusBar, useValue: SpyMockConfig.SpyConfig.statusBar },
        { provide: SplashScreen, useValue: SpyMockConfig.SpyConfig.splashScreenSpy },
        { provide: Platform, useValue: SpyMockConfig.SpyConfig.platformSpy },
        { provide: File, useValue: SpyMockConfig.SpyConfig.file },
        { provide: ScreenOrientation, useValue: SpyMockConfig.SpyConfig.screenOrientation },
        { provide: ControlService, useValue: SpyMockConfig.SpyConfig.controlService }
    ];

    static ProvidersServices = [
        SQLite,
        InAppBrowser,
        //{ provide: LogService, useValue: SpyMockConfig.SpyConfig.logService },
        { provide: Storage, useValue: SpyMockConfig.SpyConfig.windows },
        { provide: File, useValue: SpyMockConfig.SpyConfig.file },
        { provide: SQLiteObject, useValue: SpyMockConfig.SpyConfig.sqliteObject },
        { provide: SQLitePorter, useValue: SpyMockConfig.SpyConfig.sqlitePorter }
    ];

    static ProviderDataService = { provide: DataService, useValue: SpyMockConfig.SpyMockDataService() };
    static ProviderDataBaseService = { provide: DataBaseService, useValue: SpyMockConfig.SpyConfig.dbService };
    static ProviderExportService = { provide: ExportService, useValue: SpyMockConfig.SpyConfig.exportService };

    static getProviderNavParams(data: ModalInputModel) {
        return {provide: NavParams, useValue: { data }};
    }

    static SpyMockDataService() {
        const spy = SpyMockConfig.SpyConfig.dataService;
        spy.getSystemConfiguration.and.returnValue(of(MockData.SystemConfigurations));
        spy.getSystemConfigurationData.and.returnValue(MockData.SystemConfigurations);
        spy.getConfigurations.and.returnValue(of(MockData.Configurations));
        spy.getConfigurationsData.and.returnValue(MockData.Configurations);
        spy.getVehicleType.and.returnValue(of(MockData.VehicleTypes));
        spy.getVehicleTypeData.and.returnValue(MockData.VehicleTypes);
        spy.getVehicles.and.returnValue(of(MockData.Vehicles));
        spy.getVehiclesData.and.returnValue(MockData.Vehicles);
        spy.getOperationType.and.returnValue(of(MockData.OperationTypes));
        spy.getOperationTypeData.and.returnValue(MockData.OperationTypes);
        spy.getOperations.and.returnValue(of(MockData.Operations));
        spy.getOperationsData.and.returnValue(MockData.Operations);
        spy.getMaintenance.and.returnValue(of(MockData.Maintenances));
        spy.getMaintenanceData.and.returnValue(MockData.Maintenances);
        spy.getMaintenanceElement.and.returnValue(of(MockData.MaintenanceElements));
        spy.getMaintenanceElementData.and.returnValue(MockData.MaintenanceElements);
        spy.getMaintenanceFreq.and.returnValue(of(MockData.MaintenanceFreqs));
        spy.getMaintenanceFreqData.and.returnValue(MockData.MaintenanceFreqs);
        return spy;
    }
}
