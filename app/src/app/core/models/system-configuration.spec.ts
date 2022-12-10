import { SystemConfigurationModel } from "@models/index";

describe('SystemConfigurationModel', () => {

    it('should initialize system configuration model', () => {
        let base: SystemConfigurationModel = new SystemConfigurationModel();
        expect(base.id).toEqual(1);
        expect(base.key).toEqual('');
        expect(base.value).toEqual('');
        expect(base.updated).toEqual(new Date());
        base = new SystemConfigurationModel('key', 'value', new Date(2022, 2 , 12), 4);
        expect(base.id).toEqual(4);
        expect(base.key).toEqual('key');
        expect(base.value).toEqual('value');
        expect(base.updated).toEqual(new Date(2022, 2, 12));
    });
});