import { ActionDBEnum, TypeOfTableEnum } from "../../utils";

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
    master: boolean;
}

/* MAPPERS */

export interface IMapperModel {
    table: string;
    type: TypeOfTableEnum;
    get: IGetBehaviourMapperModel;
    save: ISaveBehaviourMapperModel;
}

export interface IGetBehaviourMapperModel {
    getDataFunction: () => any;
    mapperFunction: (data: any, ...args: any) => any;
    setFunction: (data: any[]) => any;
    relatedTable: IMapperRelatedModel[];
}

export interface IMapperRelatedModel {
    foreignKey: string;
    foreignKeyRel: string;
    getDataRelatedTableFunction: () => any[],
    getDataRelatedTableRefFunction: () => any[],
    customMapperBeforeStorage: (data: any[], related: any[]) => any[]
}

export interface ISaveBehaviourMapperModel {
    saveMapperFunction: (data: any) => any
}

export interface ISaveBehaviourModel {
    action: ActionDBEnum;
    table: string;
    data: any[];
    prop?: string;
}


/* INTERFACE RELATED DTOS STORAGE */

export interface IOperationMaintenanceElementStorageModel extends IBaseStorageModel {
    idOperation: number;
    idMaintenanceElement: number;
    price: number;
}

export interface IConfigurationMaintenanceStorageModel extends IBaseStorageModel {
    idConfiguration: number;
    idMaintenance: number;
}

export interface IMaintenanceElementRelStorageModel extends IBaseStorageModel {
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
