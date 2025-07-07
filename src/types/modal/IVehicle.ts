import { IAddress } from "../address/IAddress";
import { IFineType } from "../fine/IFineType";
import { IColor } from "../IColor";
import { IMedia } from "../IMedia";
import { IVehicleBrand } from "../vehicle-brand/IVehicleBrand";
import { IVehicleModel } from "../vehicle-brand/IVheicleModel";

export interface IVehicle{
    vehicleId:number;
    patente: string;
    brand: IVehicleBrand;
    model: IVehicleModel;
    color: IColor;
    fineType: IFineType;
    date: Date;
    severity: ISeverity;
    address: IAddress;
    description: string;
    media:IMedia[];
}