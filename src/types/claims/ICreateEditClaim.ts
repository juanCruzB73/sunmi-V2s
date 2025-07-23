export interface ICreateEditClaim{
    claim: {
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