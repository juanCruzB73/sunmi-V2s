import { unSyncedAnswer } from "./unSyncedAnswer";

export interface unSyncedClaim{
    id: number;
    form_id: number;
    incident_id: number;
    area_id: number;
    isSynced: boolean;
    answers_attributes:unSyncedAnswer[];
}