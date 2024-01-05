/*
Add Awards for a competition
PUT: {{host}}/competition/:compId/award/:awardId
*/
export interface AddAwardsForACompetition { 
  name: string; 
  description: string; 
}