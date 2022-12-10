import {
    BaseCodeDescriptionModel, BaseDescriptionModel, BaseIconCodeDescriptionModel, BaseIconNameDescriptionModel, BaseMaintenanceModel,
    BaseModel, BaseNameDescriptionModel, BaseNameModel, BaseWarningIconModel, ModalInputModel, ModalOutputModel
} from "@models/index";
import { ModalOutputEnum, PageEnum, WarningWearEnum } from "@utils/index";

describe('CommonModel', () => {

    it('should initialize base model', () => {
        expect(new BaseModel().id).toEqual(1);
        expect(new BaseModel(2).id).toEqual(2);
    });

    it('should initialize modalinput model', () => {
        let base: ModalInputModel<number, string> = new ModalInputModel<number, string>();
        expect(base.isCreate).toEqual(true);
        expect(base.data).toEqual(null);
        expect(base.dataList).toEqual([]);
        expect(base.parentPage).toEqual(PageEnum.HOME);
        base = new ModalInputModel<number, string>({
            isCreate: false,
            data: 5, 
            dataList: ['david'],
            parentPage: PageEnum.CONFIGURATION
        });
        expect(base.isCreate).toEqual(false);
        expect(base.data).toEqual(5);
        expect(base.dataList[0]).toEqual('david');
        expect(base.parentPage).toEqual(PageEnum.CONFIGURATION);
    });

    it('should initialize modaloutput model', () => {
        let base: ModalOutputModel<number, string> = new ModalOutputModel<number, string>();
        expect(base.action).toEqual(ModalOutputEnum.SAVE);
        expect(base.data).toEqual(null);
        expect(base.dataList).toEqual([]);
        base = new ModalOutputModel<number, string>({
            action: ModalOutputEnum.CANCEL,
            data: 5, 
            dataList: ['david'],
        });
        expect(base.action).toEqual(ModalOutputEnum.CANCEL);
        expect(base.data).toEqual(5);
        expect(base.dataList[0]).toEqual('david');
    });

    it('should initialize basename model', () => {
        let base: BaseNameModel = new BaseNameModel();
        expect(base.id).toEqual(1);
        expect(base.name).toEqual(null);
        base = new BaseNameModel('david', 2);
        expect(base.id).toEqual(2);
        expect(base.name).toEqual('david');
    });

    it('should initialize basedescription model', () => {
        let base: BaseDescriptionModel = new BaseDescriptionModel();
        expect(base.id).toEqual(1);
        expect(base.description).toEqual(null);
        base = new BaseDescriptionModel('david', 2);
        expect(base.id).toEqual(2);
        expect(base.description).toEqual('david');
    });

    it('should initialize basenamedescription model', () => {
        let base: BaseNameDescriptionModel = new BaseNameDescriptionModel();
        expect(base.id).toEqual(1);
        expect(base.name).toEqual(null);
        expect(base.description).toEqual(null);
        base = new BaseNameDescriptionModel('david', 'description', 2);
        expect(base.id).toEqual(2);
        expect(base.name).toEqual('david');
        expect(base.description).toEqual('description');
    });

    it('should initialize baseiconnamedescription model', () => {
        let base: BaseIconNameDescriptionModel = new BaseIconNameDescriptionModel();
        expect(base.id).toEqual(1);
        expect(base.name).toEqual(null);
        expect(base.description).toEqual(null);
        expect(base.icon).toEqual(undefined);
        base = new BaseIconNameDescriptionModel('david', 'description', 2);
        expect(base.id).toEqual(2);
        expect(base.name).toEqual('david');
        expect(base.description).toEqual('description');
        expect(base.icon).toEqual(undefined);
    });

    it('should initialize basecodedescription model', () => {
        let base: BaseCodeDescriptionModel = new BaseCodeDescriptionModel();
        expect(base.id).toEqual(1);
        expect(base.code).toEqual(null);
        expect(base.description).toEqual(null);
        base = new BaseCodeDescriptionModel('david', 'description', 2);
        expect(base.id).toEqual(2);
        expect(base.code).toEqual('david');
        expect(base.description).toEqual('description');
    });

    it('should initialize baseiconcodedescription model', () => {
        let base: BaseIconCodeDescriptionModel = new BaseIconCodeDescriptionModel();
        expect(base.id).toEqual(1);
        expect(base.code).toEqual(null);
        expect(base.description).toEqual(null);
        expect(base.icon).toEqual(undefined);
        base = new BaseIconCodeDescriptionModel('david', 'description', 2);
        expect(base.id).toEqual(2);
        expect(base.code).toEqual('david');
        expect(base.description).toEqual('description');
        expect(base.icon).toEqual(undefined);
    });

    it('should initialize basewarningicon model', () => {
        let base: BaseWarningIconModel = new BaseWarningIconModel();
        expect(base.warning).toEqual(WarningWearEnum.SUCCESS);
        expect(base.warningIcon).toEqual('');
        expect(base.warningIconClass).toEqual('');
    });

    it('should initialize basemaintenance model', () => {
        let base: BaseMaintenanceModel = new BaseMaintenanceModel();
        expect(base.id).toEqual(1);
        expect(base.description).toEqual(null);
        expect(base.fromKm).toEqual(0);
        expect(base.toKm).toEqual(null);
        expect(base.km).toEqual(null);
        expect(base.time).toEqual(null);
        expect(base.init).toEqual(false);
        expect(base.wear).toEqual(false);
        base = new BaseMaintenanceModel('david', 100, 12, true, true, 10, 200, 3);
        expect(base.id).toEqual(3);
        expect(base.description).toEqual('david');
        expect(base.fromKm).toEqual(10);
        expect(base.toKm).toEqual(200);
        expect(base.km).toEqual(100);
        expect(base.time).toEqual(12);
        expect(base.init).toEqual(true);
        expect(base.wear).toEqual(true);
    });
});