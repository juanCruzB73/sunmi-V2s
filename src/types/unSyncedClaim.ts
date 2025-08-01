import { unSyncedAnswer } from "./unSyncedAnswer";

export interface unSyncedClaim{
    status: string;
    panel_id: number;
    type: string;
    date: string;
    removed_at: null;
    removed: any;
    reason: null;
    user_id: number;
    removed_user_id: null;
    status_type_id: number;
    created_at: string;
    updated_at: string;
    id: number;
    form_id: number;
    incident_id: number;
    area_id: number;
    isSynced: boolean;
    main_panel_id:number;
    answers_attributes:unSyncedAnswer[];
}