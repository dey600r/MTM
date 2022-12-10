import { InfoVehicleConfigurationModel } from "@models/index";

describe('InfoVehicleModels', () => {

    it('should initialize infovehicleconfiguration model', () => {
        let base: InfoVehicleConfigurationModel = new InfoVehicleConfigurationModel();
        expect(base.idVehicle).toEqual(-1);
    });
});
