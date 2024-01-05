/*
Get likes to a comment
GET: {{host}}/comment/:commentId/likes?llimit=10&lskip=0
*/
export interface GetLikesToAComment { 
  llimit: string; 
  lskip: string; 
}