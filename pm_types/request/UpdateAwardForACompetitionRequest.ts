/*
Update Award for a competition
POST: {{host}}/competition/:compId/add/award
*/
export interface UpdateAwardForACompetition { 
  name: string; 
  description: string; 
}