/*
Get all posts
GET: {{host}}/post/all?plimit=10&pskip=0&user_id=608ed6155e3e994e00ef15e0&comp_id&order=DESC&sort_by=created_at
*/
export interface GetAllPosts { 
  plimit: string; 
  pskip: string; 
  user_id: string; 
  comp_id: null; 
  order: string; 
  sort_by: string; 
}