import {
    ConfigurationModel, SystemConfigurationModel
} from '@models/index';
import { CalendarService, IconService } from '@services/index';

import { Constants } from '@utils/index';

import { MockAppMaintenance } from './mock-maintenance.spec';

export class MockAppConfiguration {
    public static readonly iconService: IconService = new IconService();
    public static readonly calendarService: CalendarService = new CalendarService(null);

    /* SYSTEM CONFIGURATION */
    public static readonly SystemConfigurations: SystemConfigurationModel[] = [
        new SystemConfigurationModel(Constants.KEY_LAST_UPDATE_DB, 'v3.1.0', new Date(), 1),
        new SystemConfigurationModel(Constants.KEY_CONFIG_DISTANCE, Constants.SETTING_DISTANCE_KM, new Date(), 2),
        new SystemConfigurationModel(Constants.KEY_CONFIG_MONEY, Constants.SETTING_MONEY_EURO, new Date(), 3),
        new SystemConfigurationModel(Constants.KEY_CONFIG_THEME, Constants.SETTING_THEME_DARK, new Date(), 4),
        new SystemConfigurationModel(Constants.KEY_CONFIG_PRIVACY, Constants.DATABASE_NO, new Date(), 5),
        new SystemConfigurationModel(Constants.KEY_CONFIG_SYNC_EMAIL, 'USER_TEST@gmail.com', new Date(), 6),
    ];

    /* CONFIGURATION */
    public static readonly Configurations: ConfigurationModel[] = [
        new ConfigurationModel({
            name: 'DB.PRODUCTION', 
            nameKey: 'PRODUCTION',
            description: 'DB.PRODUCTION SETUP', 
            descriptionKey: 'PRODUCTION SETUP',
            master: true, 
            listMaintenance: [
                MockAppMaintenance.Maintenances[0],
                MockAppMaintenance.Maintenances[1],
                MockAppMaintenance.Maintenances[4],
                MockAppMaintenance.Maintenances[5]
            ],
            id: 1
        }),
        new ConfigurationModel({
            name: 'DB.HYOSUNG', 
            nameKey: 'HYOSUNG', 
            description: 'PRODUCTION SETUP HYOSUNG',
            descriptionKey: 'PRODUCTION SETUP HYOSUNG',
            master: true,
            listMaintenance: MockAppMaintenance.Maintenances,
            id: 2
        }),
        new ConfigurationModel({
            name: 'DB.KAWASAKI',
            nameKey: 'KAWASAKI', 
            description: 'PRODUCTION SETUP KAWASAKI',
            descriptionKey: 'PRODUCTION SETUP KAWASAKI',
            master: true,
            listMaintenance: [
                MockAppMaintenance.Maintenances[1],
                MockAppMaintenance.Maintenances[3],
                MockAppMaintenance.Maintenances[6],
                MockAppMaintenance.Maintenances[7],
                MockAppMaintenance.Maintenances[8]
            ],
            id: 3
        })
    ];
}