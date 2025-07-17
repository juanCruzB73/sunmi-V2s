import { IQuestionOption } from "./IQuestionOption";

export interface IQuestion{
    id: number;
    name: string;
    type: string;
    owner: string;
    required: boolean;
    order: number;
    description: string;
    filters: Record<string, unknown>;
    catalog_id: number | null;
    panel_id: number;
    created_at: string;
    updated_at: string;
    show_list: boolean;
    question_options?:IQuestionOption[]
}