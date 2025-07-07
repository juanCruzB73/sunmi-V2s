import { IVehicleModel } from "./IVheicleModel";

export interface IVehicleBrand{
    vehicleBrandId:number;
    brandName:string;
    models:IVehicleModel[];
}