import { IVehicleModel } from "./IVehicleModel";

export interface IVehicleBrand{
    vehicleBrandId:number;
    brandName:string;
    models:IVehicleModel[];
}