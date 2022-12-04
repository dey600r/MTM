import { TestBed } from '@angular/core/testing';

// MODELS
import { VehicleModel } from '@models/index';

import { CommonService } from './common.service';

describe('CommonService', () => {
    let service: CommonService;
    const mockWithNull: any[] = [
        { data: 'Hola', value: 5 },
        { data: 'adios', value: 1 },
        { data: 'david', value: 3 },
        { data: 'ana', value: 10 },
        { data: 'nothing', value: null },
        { data: 'undefined', value: undefined },
        { data: 'singapur', value: 8 },
        { data: 'singapur', value: 13 }
    ];

    const mock: any[] = [
        { data: 'Hola', value: 5 },
        { data: 'adios', value: 1 },
        { data: 'david', value: 3 },
        { data: 'ana', value: 10 },
        { data: 'singapur', value: 8 },
        { data: 'singapur', value: 13 }
    ];

    const mockNumbers: number[] = [ 4, 2, 2, 6, 1, -5, 10];

    beforeEach(() => {
        TestBed.configureTestingModule({}).compileComponents();
        service = TestBed.inject(CommonService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should order list complex desc', () => {
        const orderMock: any[] = service.orderBy(mockWithNull, 'value', false);
        expect(orderMock).toEqual([
            { data: 'nothing', value: null },
            { data: 'undefined', value: undefined },
            { data: 'adios', value: 1 },
            { data: 'david', value: 3 },
            { data: 'Hola', value: 5 },
            { data: 'singapur', value: 8 },
            { data: 'ana', value: 10 },
            { data: 'singapur', value: 13 }
        ]);
    });

    it('should order list complex asc', () => {
        const orderMock: any[] = service.orderBy(mockWithNull, 'value', true);
        expect(orderMock).toEqual([
            { data: 'singapur', value: 13 },
            { data: 'ana', value: 10 },
            { data: 'singapur', value: 8 },
            { data: 'Hola', value: 5 },
            { data: 'david', value: 3 },
            { data: 'adios', value: 1 },
            { data: 'nothing', value: null },
            { data: 'undefined', value: undefined },
        ]);
    });

    it('should order list desc', () => {
        const orderMock: any[] = service.orderBy(mockNumbers);
        expect(orderMock).toEqual([-5, 1, 2, 2, 4, 6, 10]);
    });

    it('should not order list empty', () => {
        const orderMock1: any[] = service.orderBy(null, 'value', true);
        const orderMock2: any[] = service.orderBy(undefined, 'value', true);
        expect(orderMock1).toEqual([]);
        expect(orderMock2).toEqual([]);
    });

    it('should compare values', () => {
        expect(service.compareData(null, null)).toEqual(0);
        expect(service.compareData(null, 0)).toEqual(-1);
        expect(service.compareData(0, null)).toEqual(1);
        expect(service.compareData('hola1', 'hola')).toEqual(1);
    });

    it('should group list complex', () => {
        const groupMock: any = service.groupBy(mockWithNull, 'data');
        expect(groupMock).toEqual({
            Hola: [ { data: 'Hola', value: 5 } ],
            adios: [ { data: 'adios', value: 1 } ],
            david: [ { data: 'david', value: 3 } ],
            ana: [ { data: 'ana', value: 10 } ],
            singapur: [ { data: 'singapur', value: 8 }, { data: 'singapur', value: 13 } ],
            nothing: [ { data: 'nothing', value: null }],
            undefined: [ { data: 'undefined', value: undefined }]
        });
    });

    it('should not grouper list empty', () => {
        const groupMock1: any[] = service.groupBy(null, 'data');
        const groupMock2: any[] = service.groupBy(undefined, 'data');
        expect(groupMock1).toEqual([]);
        expect(groupMock2).toEqual([]);
    });

    it('should sum list complex', () => {
        const sumMock: number = service.sum(mock, 'value');
        expect(sumMock).toEqual(40);
    });

    it('should sum list', () => {
        const sumMock: number = service.sum(mockNumbers);
        expect(sumMock).toEqual(20);
    });

    it('should not sum list empty', () => {
        const sumMock1: number = service.sum(null, 'value');
        const sumMock2: number = service.sum(undefined, 'value');
        expect(sumMock1).toEqual(0);
        expect(sumMock2).toEqual(0);
    });

    it('should max list complex', () => {
        const maxMock: number = service.max(mock, 'value');
        expect(maxMock).toEqual(13);
    });

    it('should max list', () => {
        const maxMock: number = service.max(mockNumbers);
        expect(maxMock).toEqual(10);
    });

    it('should not max list empty', () => {
        const maxMock1: number = service.max(null, 'value');
        const maxMock2: number = service.max(undefined, 'value');
        expect(maxMock1).toEqual(null);
        expect(maxMock2).toEqual(null);
    });

    it('should min list complex', () => {
        const minMock: number = service.min(mock, 'value');
        expect(minMock).toEqual(1);
    });

    it('should min list', () => {
        const minMock: number = service.min(mockNumbers);
        expect(minMock).toEqual(-5);
    });

    it('should not min list empty', () => {
        const minMock1: number = service.min(null, 'value');
        const minMock2: number = service.min(undefined, 'value');
        expect(minMock1).toEqual(null);
        expect(minMock2).toEqual(null);
    });

    it('should get name of class', () => {
        expect(service.nameOf(() => new VehicleModel().km)).toEqual('km');
    });
});
