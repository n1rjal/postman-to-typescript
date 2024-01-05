/*
Get all requests from one time to another
GET: {{host}}/report/time-stamps?startDate=05-22-2021&endDate=07-30-2021
*/
export interface GetAllRequestsFromOneTimeToAnother { 
  startDate: string; 
  endDate: string; 
}