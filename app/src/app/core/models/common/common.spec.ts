import {
    BaseCodeDescriptionModel, BaseDescriptionModel, BaseIconCodeDescriptionModel, BaseIconNameDescriptionModel, BaseMaintenanceModel,
    BaseModel, BaseNameDescriptionModel, BaseNameModel, BaseWarningIconModel, BodySkeletonInputModel, BodySkeletonLabelsInputModel,
    HeaderInputModel, HeaderOutputModel, HeaderSegmentInputModel, ModalInputModel, ModalOutputModel, SkeletonInputModel
} from "@models/index";
import { HeaderOutputEnum, ModalOutputEnum, ModalTypeEnum, PageEnum, WarningWearEnum } from "@utils/index";

describe('CommonModel', () => {

    it('should initialize base model', () => {
        expect(new BaseModel().id).toEqual(1);
        expect(new BaseModel(2).id).toEqual(2);
    });

    it('should initialize modalinput model', () => {
        let base: ModalInputModel<number, string> = new ModalInputModel<number, string>();
        expect(base.type).toEqual(ModalTypeEnum.CREATE);
        expect(base.data).toEqual(null);
        expect(base.dataList).toEqual([]);
        expect(base.parentPage).toEqual(PageEnum.HOME);
        base = new ModalInputModel<number, string>({
            type: ModalTypeEnum.UPDATE,
            data: 5, 
            dataList: ['david'],
            parentPage: PageEnum.CONFIGURATION
        });
        expect(base.type).toEqual(ModalTypeEnum.UPDATE);
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
        base = new BaseMaintenanceModel({
            description: 'david',
            km: 100, 
            time: 12,
            init: true, 
            wear: true,
            fromKm: 10,
            toKm: 200,
            id: 3
        });
        expect(base.id).toEqual(3);
        expect(base.description).toEqual('david');
        expect(base.fromKm).toEqual(10);
        expect(base.toKm).toEqual(200);
        expect(base.km).toEqual(100);
        expect(base.time).toEqual(12);
        expect(base.init).toEqual(true);
        expect(base.wear).toEqual(true);
    });

    it('should initialize headerInput model', () => {
        let input: HeaderInputModel = new HeaderInputModel();
        expect(input.title).toEqual('');
        expect(input.iconButtonLeft).toEqual('');
        expect(input.iconButtonRight).toEqual('');
        expect(input.dataSegment.length).toEqual(0);
        input = new HeaderInputModel({
            title: 'david',
            iconButtonLeft: 'home', 
            iconButtonRight: 'cog',
            dataSegment: [
                new HeaderSegmentInputModel({ id: 1, name: 'first', icon: 'seg', selected: true, progressColor: 'class', progressValue: 10 }),
                new HeaderSegmentInputModel({ id: 2, name: 'second', icon: 'icon', selected: false, progressColor: 'class', progressValue: 20 }),
            ]
        });
        expect(input.title).toEqual('david');
        expect(input.iconButtonLeft).toEqual('home');
        expect(input.iconButtonRight).toEqual('cog');
        expect(input.dataSegment.length).toEqual(2);
        expect(input.dataSegment[0].id).toEqual(1);
        expect(input.dataSegment[0].name).toEqual('first');
        expect(input.dataSegment[0].icon).toEqual('seg');
        expect(input.dataSegment[0].selected).toBeTrue();
        expect(input.dataSegment[0].progressColor).toEqual('class');
        expect(input.dataSegment[0].progressValue).toEqual(10);
        expect(input.dataSegment[1].id).toEqual(2);
        expect(input.dataSegment[1].name).toEqual('second');
        expect(input.dataSegment[1].icon).toEqual('icon');
        expect(input.dataSegment[1].selected).toBeFalse();
        expect(input.dataSegment[1].progressColor).toEqual('class');
        expect(input.dataSegment[1].progressValue).toEqual(20);
    });

    it('should initialize modalheaderoutput model', () => {
        let output: HeaderOutputModel = new HeaderOutputModel(HeaderOutputEnum.BUTTON_LEFT);
        expect(output.type).toEqual(HeaderOutputEnum.BUTTON_LEFT);
        expect(output.data).toEqual(null);
        output = new HeaderOutputModel(HeaderOutputEnum.SEGMENT, 1);
        expect(output.type).toEqual(HeaderOutputEnum.SEGMENT);
        expect(output.data).toEqual(1);
    });

    it('should initialize skeletoninput model', () => {
        let input = new SkeletonInputModel();
        expect(input.time).toEqual(0);
        expect(input.itemsHeader).toEqual([]);
        expect(input.body.avatar).toEqual(false);
        expect(input.body.items).toEqual([]);
        expect(input.body.itemsLabel).toEqual([]);
        input = new SkeletonInputModel({
            time: 600, 
            itemsHeader: [1, 3, 1, 3, 1, 3],
            body: new BodySkeletonInputModel({
                items: [1, 2, 3, 4, 5, 6], 
                avatar: true, 
                itemsLabel: [ new BodySkeletonLabelsInputModel({ 
                    h3Width: 40, 
                    h2Width: 30, 
                    pWidth: [70, 70],
                    divWidth: 50,
                    divPWidth: [25, 25]
                })] 
            })
        });
        expect(input.time).toEqual(600);
        expect(input.itemsHeader).toEqual([1, 3, 1, 3, 1, 3]);
        expect(input.body.avatar).toEqual(true);
        expect(input.body.items).toEqual([1, 2, 3, 4, 5, 6]);
        expect(input.body.itemsLabel[0].h3Width).toEqual(40);
        expect(input.body.itemsLabel[0].h2Width).toEqual(30);
        expect(input.body.itemsLabel[0].pWidth).toEqual([70, 70]);
        expect(input.body.itemsLabel[0].divWidth).toEqual(50);
        expect(input.body.itemsLabel[0].divPWidth).toEqual([25, 25]);
    });

    it('should initialize bodyskeletonlabelsinput model', () => {
        let input = new BodySkeletonLabelsInputModel();
        expect(input.h3Width).toEqual(0);
        expect(input.h2Width).toEqual(0);
        expect(input.pWidth).toEqual([]);
        expect(input.divWidth).toEqual(0);
        expect(input.divPWidth).toEqual([]);
        input = new BodySkeletonLabelsInputModel({ 
            h3Width: 40, 
            h2Width: 30, 
            pWidth: [70, 70],
            divWidth: 50,
            divPWidth: [25, 25]
        });
        expect(input.h3Width).toEqual(40);
        expect(input.h2Width).toEqual(30);
        expect(input.pWidth).toEqual([70, 70]);
        expect(input.divWidth).toEqual(50);
        expect(input.divPWidth).toEqual([25, 25]);
    });
});