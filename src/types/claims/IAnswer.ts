import { IQuestion } from "../form/IQuestion";

export interface IAnswer{
    id:number;
    input_string: string;
    input_text: null|string;
    input_date: null|string;
    input_datetime: null|string;
    options: any[];
    latitude: number|null;
    longitude: number|null;
    item_id: number|null;
    person_id: null|number;
    address_id: null|number;
    question_id: number;
    owner_type: null|string;
    owner_id: null|number;
    answerable_type: string;
    answerable_id: number;
    created_at: string;
    updated_at: string;
    tag: null;
    question:IQuestion;
}import { IQuestion } from "../form/IQuestion";

export interface IAnswer {
  id: number;
  input_string: string;
  input_text: null | string;
  input_date: null | string;
  input_datetime: null | string;
  options: any[];
  latitude: number | null;
  longitude: number | null;
  item_id: number | null;
  person_id: null | number;
  address_id: null | number;
  question_id: number;
  owner_type: null | string;
  owner_id: null | number;
  answerable_type: string;
  answerable_id: number;
  created_at: string;
  updated_at: string;
  tag: null;
  question: IQuestion;
  isSynced: boolean; // ← Campo nuevo
}