import { BaseModel } from '../common/index';
import { ConfigurationModel } from '../pages/index';
import { VehicleTypeModel } from './vehicle-type.model';

export class VehicleModel extends BaseModel {
    model: string;
    brand: string;
    year: number;
    km: number;
    kmEstimated: number; //Calculated
    configuration: ConfigurationModel;
    vehicleType: VehicleTypeModel;
    kmsPerMonth: number;
    dateKms: Date;
    datePurchase: Date;
    active: boolean;
    
    public get $getName(): string {
        return `${this.brand} ${this.model}`;
    }

    constructor(data: Partial<VehicleModel> = {}) {
        super(data.id);
        this.model = (data.model ? data.model : null);
        this.brand = (data.brand ? data.brand : null);
        this.year = (data.year !== undefined ? data.year : null);
        this.km = (data.km !== undefined ? data.km : null);
        this.kmEstimated = (data.kmEstimated !== undefined ? data.kmEstimated : null);
        this.configuration = (data.configuration ? data.configuration : new ConfigurationModel());
        this.vehicleType = (data.vehicleType ? data.vehicleType : new VehicleTypeModel());
        this.kmsPerMonth = (data.kmsPerMonth !== undefined ? data.kmsPerMonth : null);
        this.dateKms = (data.dateKms ? data.dateKms : new Date());
        this.datePurchase = (data.datePurchase ? data.datePurchase : new Date());
        this.active = (data.active !== undefined ? data.active : true);
    }

    
}
