/*
Create a competition ResponseBody
*/
export interface CreateACompetitionResponseBody { 
  posts: unknown[]; 
  categories: string[]; 
  admins: { 
        is_admin: boolean; 
        is_merchant: boolean; 
        _id: string; 
        email: string; 
        name: string; 
        bio: string; 
        phone: string; 
        profile_picture: null; 
        created_at: string; 
        updated_at: string; 
        __v: number; 
      }[]; 
  moderators: unknown[]; 
  editors: unknown[]; 
  _id: string; 
  startDate: string; 
  endDate: string; 
  title: string; 
  description: string; 
  sponsors: unknown[]; 
  __v: number; 
}