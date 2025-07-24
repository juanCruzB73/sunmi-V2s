import { IAnswer } from "./IAnswer";

export interface IClaim{
    id: number;
    status: string;
    panel_id:number;
    type: string;
    date: string;
    removed_at: null;
    removed: boolean;
    reason: null;
    user_id: number;
    removed_user_id: null;
    //status_type_id: number;
    form_id: number;
    incident_id: number;
    created_at: string;
    updated_at: string;
    area_id: number;
    isSynced: boolean;
    answers:IAnswer[];
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
    main_panel_id:number;
}
>>>>>>> fbc09aa (update And delete from app to api updated)
=======
    main_panel_id:number;
}
>>>>>>> juanbranch
