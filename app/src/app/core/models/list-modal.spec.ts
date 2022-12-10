import { ListDataModalModel, ListModalModel } from "@models/index";

describe('ListModalModels', () => {

    it('should initialize list modal model', () => {
        let base: ListModalModel = new ListModalModel('david', true, []);
        expect(base.titleHeader).toEqual('david');
        expect(base.active).toEqual(true);
        expect(base.listData).toEqual([]);
    });

    it('should initialize list data modal model', () => {
        let base: ListDataModalModel = new ListDataModalModel(1, 'david', 'description', 'detail', 'icon', true, false);
        expect(base.id).toEqual(1);
        expect(base.title).toEqual('david');
        expect(base.description).toEqual('description');
        expect(base.detail).toEqual('detail');
        expect(base.icon).toEqual('icon');
        expect(base.selected).toEqual(true);
        expect(base.disabled).toEqual(false);
    });
});
