import { AngularDelegate, ModalController, NavParams, Platform, PopoverController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

// PLUGINS
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
import { MockAppData } from '../mocks/mock-data-app.spec';
import { ModalInputModel } from '@src/app/core/models';
import { ConstantsTest } from './constants.spec';


export class SpyMockConfig {
    static SpyConfig = {
        statusBar: jasmine.createSpyObj('StatusBar', ['styleBlackTranslucent', 'styleLightContent']),
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
            externalDataDirectory: ConstantsTest.PATH_EXTERNAL_DATA_DIRECTORY,
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
        window: {
            localStorage: jasmine.createSpyObj('localStorage', ['getItem', 'setItem'])
        }
    };

    static Providers = [
        TranslateService,
        ModalController,
        AngularDelegate,
        PopoverController,
        DateFormatCalendarPipe,
        InAppBrowser,
        //{ provide: LogService, useValue: SpyMockConfig.SpyConfig.logService },
        { provide: StatusBar, useValue: SpyMockConfig.SpyConfig.statusBar },
        { provide: Platform, useValue: SpyMockConfig.SpyConfig.platformSpy },
        { provide: File, useValue: SpyMockConfig.SpyConfig.file },
        { provide: ScreenOrientation, useValue: SpyMockConfig.SpyConfig.screenOrientation },
        { provide: ControlService, useValue: SpyMockConfig.SpyConfig.controlService }
    ];

    static ProvidersServices = [
        InAppBrowser,
        { provide: Storage, useValue: SpyMockConfig.SpyConfig.window },
        { provide: File, useValue: SpyMockConfig.SpyConfig.file }
    ];

    static ProviderLogService = { provide: LogService, useValue: SpyMockConfig.SpyConfig.logService };
    static ProviderDataService = { provide: DataService, useValue: SpyMockConfig.SpyMockAppDataService() };
    static ProviderDataBaseService = { provide: DataBaseService, useValue: SpyMockConfig.SpyConfig.dbService };
    static ProviderExportService = { provide: ExportService, useValue: SpyMockConfig.SpyConfig.exportService };

    static getProviderNavParams(data: ModalInputModel) {
        return {provide: NavParams, useValue: { data }};
    }

    static SpyMockAppDataService() {
        const spy = SpyMockConfig.SpyConfig.dataService;
        spy.getSystemConfiguration.and.returnValue(of(MockAppData.SystemConfigurations));
        spy.getSystemConfigurationData.and.returnValue(MockAppData.SystemConfigurations);
        spy.getConfigurations.and.returnValue(of(MockAppData.Configurations));
        spy.getConfigurationsData.and.returnValue(MockAppData.Configurations);
        spy.getVehicleType.and.returnValue(of(MockAppData.VehicleTypes));
        spy.getVehicleTypeData.and.returnValue(MockAppData.VehicleTypes);
        spy.getVehicles.and.returnValue(of(MockAppData.Vehicles));
        spy.getVehiclesData.and.returnValue(MockAppData.Vehicles);
        spy.getOperationType.and.returnValue(of(MockAppData.OperationTypes));
        spy.getOperationTypeData.and.returnValue(MockAppData.OperationTypes);
        spy.getOperations.and.returnValue(of(MockAppData.Operations));
        spy.getOperationsData.and.returnValue(MockAppData.Operations);
        spy.getMaintenance.and.returnValue(of(MockAppData.Maintenances));
        spy.getMaintenanceData.and.returnValue(MockAppData.Maintenances);
        spy.getMaintenanceElement.and.returnValue(of(MockAppData.MaintenanceElements));
        spy.getMaintenanceElementData.and.returnValue(MockAppData.MaintenanceElements);
        spy.getMaintenanceFreq.and.returnValue(of(MockAppData.MaintenanceFreqs));
        spy.getMaintenanceFreqData.and.returnValue(MockAppData.MaintenanceFreqs);
        return spy;
    }
}
