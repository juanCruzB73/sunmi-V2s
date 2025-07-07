import { ICity } from "./ICity";

export interface IAddress{
    addressId:number;
    streetName:string;
    streetNumber:string;
    lat:number
    logn:number;
    city:ICity;
}