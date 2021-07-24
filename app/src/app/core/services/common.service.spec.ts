import { TestBed } from '@angular/core/testing';

import { CommonService } from './common.service';

describe('CommonService', () => {
    let service: CommonService;
    const mock: any[] = [
        { data: 'Hola', value: 5 },
        { data: 'adios', value: 1 },
        { data: 'david', value: 3 },
        { data: 'ana', value: 10 },
        { data: 'singapur', value: 8 },
        { data: 'singapur', value: 13 }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommonService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should order list desc', () => {
        const orderMock: any[] = service.orderBy(mock, 'value', false);
        expect(orderMock).toEqual([
            { data: 'adios', value: 1 },
            { data: 'david', value: 3 },
            { data: 'Hola', value: 5 },
            { data: 'singapur', value: 8 },
            { data: 'ana', value: 10 },
            { data: 'singapur', value: 13 }
        ]);
    });

    it('should order list asc', () => {
        const orderMock: any[] = service.orderBy(mock, 'value', true);
        expect(orderMock).toEqual([
            { data: 'singapur', value: 13 },
            { data: 'ana', value: 10 },
            { data: 'singapur', value: 8 },
            { data: 'Hola', value: 5 },
            { data: 'david', value: 3 },
            { data: 'adios', value: 1 }
        ]);
    });

    it('should group list', () => {
        const groupMock: any = service.groupBy(mock, 'data');
        expect(groupMock).toEqual({
            Hola: [ { data: 'Hola', value: 5 } ],
            adios: [ { data: 'adios', value: 1 } ],
            david: [ { data: 'david', value: 3 } ],
            ana: [ { data: 'ana', value: 10 } ],
            singapur: [ { data: 'singapur', value: 8 }, { data: 'singapur', value: 13 } ]
        });
    });

    it('should sum list', () => {
        const sumMock: number = service.sum(mock, 'value');
        expect(sumMock).toEqual(40);
    });

    it('should max list', () => {
        const maxMock: number = service.max(mock, 'value');
        expect(maxMock).toEqual(13);
    });

    it('should min list', () => {
        const minMock: number = service.min(mock, 'value');
        expect(minMock).toEqual(1);
    });
});
