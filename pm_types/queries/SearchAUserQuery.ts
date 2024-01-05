/*
Search a user
GET: {{host}}/user/search?name=60ab66259b15db3d5716e0dd&ulimit=2&uskip=0
*/
export interface SearchAUser { 
  name: string; 
  ulimit: string; 
  uskip: string; 
}