/*
Calculate Winners
POST: {{host}}/competition/:compId/calculate/winners
*/
export interface CalculateWinners { 
  name: string; 
  count: number; 
  prizes: string[]; 
}