/*
Get all compeditions ResponseBody
*/
export interface GetAllCompeditionsResponseBody { 
  _id: string; 
  posts: unknown[]; 
  categories: string[]; 
  admins: string[]; 
  moderators: unknown[]; 
  editors: unknown[]; 
  startDate: string; 
  endDate: string; 
  title: string; 
  description: string; 
  sponsors: unknown[]; 
  __v: number; 
}