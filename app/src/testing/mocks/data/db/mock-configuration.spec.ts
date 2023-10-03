import {
    IConfigurationMaintenanceStorageModel, IConfigurationStorageModel, ISystemConfigurationStorageModel
} from '@models/index';

import { Constants } from '@utils/index';

import { MockDBMaintenance } from './mock-maintenance.spec';

export class MockDBConfiguration {

    /* SYSTEM CONFIGURATION */
    public static SystemConfigurations: ISystemConfigurationStorageModel[] = [
        { key: Constants.KEY_LAST_UPDATE_DB, value: 'v3.1.0', updated: new Date(), id: 1 },
        { key: Constants.KEY_CONFIG_DISTANCE, value: Constants.SETTING_DISTANCE_KM, updated: new Date(), id: 2 },
        { key: Constants.KEY_CONFIG_MONEY, value: Constants.SETTING_MONEY_EURO, updated: new Date(), id: 3 },
        { key: Constants.KEY_CONFIG_THEME, value: Constants.SETTING_THEME_DARK, updated: new Date(), id: 4 },
        { key: Constants.KEY_CONFIG_PRIVACY, value: Constants.DATABASE_NO, updated: new Date(), id: 5 },
        { key: Constants.KEY_CONFIG_SYNC_EMAIL, value: 'USER_TEST@gmail.com', updated: new Date(), id: 6 },
    ];

    /* CONFIGURATION */
    static Configurations: IConfigurationStorageModel[] = [
        {
            name: 'PRODUCTION', 
            description: 'PRODUCTION SETUP', 
            master: true, 
            id: 1
        },
        {
            name: 'HYOSUNG', 
            description: 'PRODUCTION SETUP HYOSUNG',
            master: true,
            id: 2
        },
        {
            name: 'KAWASAKI',
            description: 'PRODUCTION SETUP KAWASAKI',
            master: true,
            id: 3
        }
    ];

    static ConfigurationMaintenances: IConfigurationMaintenanceStorageModel[] = [
        { id: 1, idConfiguration: MockDBConfiguration.Configurations[0].id, idMaintenance: MockDBMaintenance.Maintenances[0].id },
        { id: 2, idConfiguration: MockDBConfiguration.Configurations[0].id, idMaintenance: MockDBMaintenance.Maintenances[1].id },
        { id: 3, idConfiguration: MockDBConfiguration.Configurations[0].id, idMaintenance: MockDBMaintenance.Maintenances[4].id },
        { id: 4, idConfiguration: MockDBConfiguration.Configurations[0].id, idMaintenance: MockDBMaintenance.Maintenances[5].id },
        { id: 5, idConfiguration: MockDBConfiguration.Configurations[1].id, idMaintenance: MockDBMaintenance.Maintenances[0].id },
        { id: 6, idConfiguration: MockDBConfiguration.Configurations[1].id, idMaintenance: MockDBMaintenance.Maintenances[1].id },
        { id: 7, idConfiguration: MockDBConfiguration.Configurations[1].id, idMaintenance: MockDBMaintenance.Maintenances[2].id },
        { id: 8, idConfiguration: MockDBConfiguration.Configurations[1].id, idMaintenance: MockDBMaintenance.Maintenances[3].id },
        { id: 9, idConfiguration: MockDBConfiguration.Configurations[1].id, idMaintenance: MockDBMaintenance.Maintenances[4].id },
        { id: 10, idConfiguration: MockDBConfiguration.Configurations[1].id, idMaintenance: MockDBMaintenance.Maintenances[5].id },
        { id: 11, idConfiguration: MockDBConfiguration.Configurations[1].id, idMaintenance: MockDBMaintenance.Maintenances[6].id },
        { id: 12, idConfiguration: MockDBConfiguration.Configurations[1].id, idMaintenance: MockDBMaintenance.Maintenances[7].id },
        { id: 13, idConfiguration: MockDBConfiguration.Configurations[1].id, idMaintenance: MockDBMaintenance.Maintenances[8].id },
        { id: 16, idConfiguration: MockDBConfiguration.Configurations[2].id, idMaintenance: MockDBMaintenance.Maintenances[1].id },
        { id: 17, idConfiguration: MockDBConfiguration.Configurations[2].id, idMaintenance: MockDBMaintenance.Maintenances[3].id },
        { id: 18, idConfiguration: MockDBConfiguration.Configurations[2].id, idMaintenance: MockDBMaintenance.Maintenances[6].id },
        { id: 19, idConfiguration: MockDBConfiguration.Configurations[2].id, idMaintenance: MockDBMaintenance.Maintenances[7].id },
        { id: 20, idConfiguration: MockDBConfiguration.Configurations[2].id, idMaintenance: MockDBMaintenance.Maintenances[8].id }
    ];
}