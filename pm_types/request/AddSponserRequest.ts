/*
Add Sponser
POST: {{host}}/competition/:competitionId/add/sponser
*/
export interface AddSponser { 
  companyID: string; 
  sponser_type: string; 
}