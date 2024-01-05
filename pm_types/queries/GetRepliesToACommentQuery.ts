/*
Get Replies to a comment
GET: {{host}}/comment/:commentId/replies?rlimit=10&rskip=0
*/
export interface GetRepliesToAComment { 
  rlimit: string; 
  rskip: string; 
}