import { AngularDelegate, ModalController, NavParams, Platform, PopoverController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

// PLUGINS
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { File } from '@ionic-native/file/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { ControlService, DataBaseService, SettingsService, SqlService } from '@services/index';
import { DateFormatCalendarPipe } from '@pipes/date-format-calendar.pipe';

// MOCK
import { MockData } from './mock-data.spec';
import { ModalInputModel } from '@src/app/core/models';


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
            createDir: jasmine.createSpy().and.returnValue(Promise.resolve()),
            listDir: jasmine.createSpy().and.returnValue(Promise.resolve([{ name: 'test.json' }]))
        },
        dbService: jasmine.createSpyObj('DataBaseService',
            ['initDB', 'getSystemConfiguration', 'getConfigurations', 'getVehicles', 'getOperations', 'getMaintenance',
            'getMaintenanceElement', 'getVehicleType', 'getOperationType', 'getMaintenanceFreq']),
        controlService: jasmine.createSpyObj('ControlService', ['activateButtonExist', 'isAppFree']),
        settingsService: jasmine.createSpyObj('SettingsService', ['createOutputDirectory']),
        sqliteObject: jasmine.createSpyObj('SQLiteObject', ['executeSql']),
        sqlitePorter: jasmine.createSpyObj('SQLitePorter', ['importSqlToDb']),
        sqlService: jasmine.createSpyObj('SqlService',
            ['getSqlSystemConfiguration', 'updateSqlSystemConfiguration', 'getSql', 'mapVehicle', 'mapVehicleType',
            'mapConfiguration', 'mapOperation', 'mapOperationType', 'mapMaintenance', 'mapMaintenanceElement',
            'mapMaintenanceFreq', 'mapSystemConfiguration'])
    };

    static Providers = [
        TranslateService,
        SQLitePorter,
        ModalController,
        AngularDelegate,
        PopoverController,
        DateFormatCalendarPipe,
        { provide: StatusBar, useValue: SpyMockConfig.SpyConfig.statusBar },
        { provide: SplashScreen, useValue: SpyMockConfig.SpyConfig.splashScreenSpy },
        { provide: Platform, useValue: SpyMockConfig.SpyConfig.platformSpy },
        { provide: File, useValue: SpyMockConfig.SpyConfig.file },
        { provide: ScreenOrientation, useValue: SpyMockConfig.SpyConfig.screenOrientation },
        { provide: ControlService, useValue: SpyMockConfig.SpyConfig.controlService }
    ];

    static ProvidersServices = [
        SQLite,
        { provide: File, useValue: SpyMockConfig.SpyConfig.file },
        { provide: SQLiteObject, useValue: SpyMockConfig.SpyConfig.sqliteObject },
        { provide: SQLitePorter, useValue: SpyMockConfig.SpyConfig.sqlitePorter }
    ];

    static ProviderDataBaseService = { provide: DataBaseService, useValue: SpyMockConfig.SpyMockDataBaseService() };
    static ProviderSettingsService = { provide: SettingsService, useValue: SpyMockConfig.SpyConfig.settingsService };
    static ProviderSqlService = { provide: SqlService, useValue: SpyMockConfig.SpyMockSqlService() };

    static getProviderNavParams(data: ModalInputModel) {
        return {provide: NavParams, useValue: { data }};
    }

    static SpyMockDataBaseService() {
        const spy = SpyMockConfig.SpyConfig.dbService;
        spy.getSystemConfiguration.and.returnValue(of(MockData.SystemConfigurations));
        spy.getConfigurations.and.returnValue(of(MockData.Configurations));
        spy.getVehicleType.and.returnValue(of(MockData.VehicleTypes));
        spy.getVehicles.and.returnValue(of(MockData.Vehicles));
        spy.getOperationType.and.returnValue(of(MockData.OperationTypes));
        spy.getOperations.and.returnValue(of(MockData.Operations));
        spy.getMaintenance.and.returnValue(of(MockData.Maintenances));
        spy.getMaintenanceElement.and.returnValue(of(MockData.MaintenanceElements));
        spy.getMaintenanceFreq.and.returnValue(of(MockData.MaintenanceFreqs));
        return spy;
    }

    static SpyMockSqlService() {
        const spy = SpyMockConfig.SpyConfig.sqlService;
        spy.updateSqlSystemConfiguration.and.returnValue('');
        spy.getSql.and.returnValue('');
        spy.mapSystemConfiguration.and.returnValue(MockData.SystemConfigurations);
        spy.mapVehicle.and.returnValue(MockData.Vehicles);
        spy.mapVehicleType.and.returnValue(MockData.VehicleTypes);
        spy.mapConfiguration.and.returnValue(MockData.Configurations);
        spy.mapOperation.and.returnValue(MockData.Operations);
        spy.mapOperationType.and.returnValue(MockData.OperationTypes);
        spy.mapMaintenance.and.returnValue(MockData.Maintenances);
        spy.mapMaintenanceElement.and.returnValue(MockData.MaintenanceElements);
        spy.mapMaintenanceFreq.and.returnValue(MockData.MaintenanceFreqs);
        return spy;
    }
}
