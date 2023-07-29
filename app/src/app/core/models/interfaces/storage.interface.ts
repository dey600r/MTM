import { TypeOfTableEnum } from "../../utils";

/* INTERFACE BASE */
export interface IBaseStorageModel {
    id: number;
}

export interface IBaseCodeStorageModel extends IBaseStorageModel {
    code: string;
}

export interface IBaseNameStorageModel extends IBaseStorageModel {
    name: string;
}

export interface IBaseDescriptionStorageModel extends IBaseStorageModel {
    description: string;
}

export interface IBaseMasterStorageModel extends IBaseStorageModel {
    master: string;
}

/* MAPPERS */

export interface IMapperModel {
    table: string;
    type: TypeOfTableEnum;
    mapperFunction: (data: any, ...args: any) => any;
    observerFunction: (data: any[]) => any;
    relatedTable: IMapperRelatedModel[];
}

export interface IMapperRelatedModel {
    foreignKey: string;
    foreignKeyRel: string;
    getDataRelatedTableFunction: () => any[],
    getDataRelatedTableRefFunction: () => any[],
    customMapperBeforeStorage: (data: any[], related: any[]) => any[]
}

/* INTERFACE RELATED DTOS STORAGE */

export interface IOperationMaintenanceElementStorageModel {
    idOperation: number;
    idMaintenanceElement: number;
    price: number;
}

export interface IConfigurationMaintenanceStorageModel {
    idConfiguration: number;
    idMaintenance: number;
}

export interface IMaintenanceElementRelStorageModel {
    idMaintenance: number;
    idMaintenanceElement: number;
}

/* INTERFACE MASTER DTOS STORAGE */

export interface IVehicleTypeStorageModel extends IBaseCodeStorageModel, IBaseDescriptionStorageModel {}

export interface IOperationTypeStorageModel extends IBaseCodeStorageModel, IBaseDescriptionStorageModel {}

export interface IMaintenanceFreqStorageModel extends IBaseCodeStorageModel, IBaseDescriptionStorageModel {}

/* INTERFACE USER DTOS STORAGE */

export interface ISystemConfigurationStorageModel extends IBaseStorageModel {
    key: string;
    value: string;
    updated: Date;

}

export interface IMaintenanceElementStorageModel extends IBaseNameStorageModel, IBaseDescriptionStorageModel, IBaseMasterStorageModel {
    price: number;
}

export interface IConfigurationStorageModel extends IBaseNameStorageModel, IBaseDescriptionStorageModel, IBaseMasterStorageModel {}

export interface IVehicleStorageModel extends IBaseStorageModel {
    model: string;
    brand: string;
    year: number;
    km: number;
    idConfiguration: number;
    idVehicleType: number;
    kmsPerMonth: number;
    dateKms: Date;
    datePurchase: Date;
    active: string;
}

export interface IMaintenanceStorageModel extends IBaseDescriptionStorageModel {
    idMaintenanceFrec: number;
    km: number;
    time: number;
    init: boolean;
    wear: boolean;
    fromKm: number;
    toKm: number;
    master: boolean;
}

export interface IOperationStorageModel extends IBaseDescriptionStorageModel {
    details: string;
    idOperationType: number;
    idVehicle: number;
    km: number;
    date: Date;
    location: string;
    owner: string;
    price: number;
    document: string;
}
