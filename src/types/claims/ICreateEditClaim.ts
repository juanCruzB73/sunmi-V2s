export interface ICreateEditClaim{
    claim: {
      panel_id: number;
      main_panel_id: number;
      type: string;
      date: string;
      removed_at: null;
      removed: boolean;
      reason: null;
      user_id: number;
      removed_user_id: null;
      status_type_id: number;
      created_at: string;
      status: string;
      id?:number,
      form_id: number;
      incident_id: number;
      //status_type_id: number;
      area_id: number;
      answers_attributes: {
        id?:number;
        input_string: string;
        question_id: string;
      }[];
    };
}