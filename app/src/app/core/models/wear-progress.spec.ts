import { WearVehicleProgressBarViewModel } from "@models/index";

describe('WearProgressModels', () => {

    it('should initialize wearvehicleprogressbar model', () => {
        let base: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel();
        expect(base.idVehicle).toEqual(-1);
    });
});
