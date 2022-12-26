import { SystemConfigurationModel } from "@models/index";

describe('SystemConfigurationModel', () => {

    it('should initialize system configuration model', () => {
        let base: SystemConfigurationModel = new SystemConfigurationModel();
        expect(base.id).toEqual(1);
        expect(base.key).toEqual('');
        expect(base.value).toEqual('');
        expect(base.updated.toDateString()).toEqual(new Date().toDateString());
        const date = new Date(2022, 2 , 12);
        base = new SystemConfigurationModel('key', 'value', date, 4);
        expect(base.id).toEqual(4);
        expect(base.key).toEqual('key');
        expect(base.value).toEqual('value');
        expect(base.updated.toDateString()).toEqual(date.toDateString());
    });
});