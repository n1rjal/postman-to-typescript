/*
Create a comment ResponseBody
*/
export interface CreateACommentResponseBody { 
  _id: string; 
  user: { 
      is_admin: boolean; 
      _id: string; 
      email: string; 
      name: string; 
      bio: string; 
      phone: string; 
      profile_picture: null; 
      created_at: string; 
      updated_at: string; 
      __v: number; 
    }; 
  body: string; 
  created_at: string; 
  updated_at: string; 
  __v: number; 
}