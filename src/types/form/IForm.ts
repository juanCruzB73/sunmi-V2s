import { IQuestion } from "./IQuestion";

/*
{
        "id": 66,
        "name": "multas",
        "publish": false,
        "description": "multas test",
        "incident_id": 66,
        "user_id": 1,
        "created_at": "2025-07-14T11:24:02.272-03:00",
        "updated_at": "2025-07-14T11:24:02.272-03:00",
        "area_id": 79,
        "visible_app": true,
        "questions": [
            {
                "id": 240,
                "name": "patente",
                "type": "string",
                "owner": "",
                "required": true,
                "order": 1,
                "description": "",
                "filters": {},
                "catalog_id": null,
                "panel_id": 78,
                "created_at": "2025-07-14T11:26:48.412-03:00",
                "updated_at": "2025-07-14T11:26:48.412-03:00",
                "show_list": false
            }
*/
export interface IForm{
    id:number;
    name:string;
    publish:boolean;
    description: string;
    incident_id:number;
    user_id:number;
    created_at:string;
    updated_at:string;
    area_id:79;
    visible_app:boolean;
    question:IQuestion[]
}