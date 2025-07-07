import { IAddress } from "../address/IAddress";
import { IFineType } from "../fine/IFineType";
import { IMedia } from "../IMedia";

export type ICommerce = {
  commerceId: number;
  rutcommerce: string;
  fineType: IFineType;
  severity: ISeverity;
  address:IAddress;
  description: string;
  date: Date;
  media:IMedia[];
};
