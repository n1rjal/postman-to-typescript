/*
Get post by ID ResponseBody
*/
export interface GetPostByIDResponseBody { 
  views: number; 
  _id: string; 
  description: string; 
  user: { 
      is_admin: boolean; 
      _id: string; 
      email: string; 
      name: string; 
      bio: string; 
      phone: string; 
      profile_picture: string; 
      created_at: string; 
      updated_at: string; 
      __v: number; 
    }; 
  media: { 
      _id: string; 
      path: string; 
      filetype: string; 
      mimetype: string; 
      encoding: string; 
      __v: number; 
    }; 
  created_at: string; 
  updated_at: string; 
  __v: number; 
}