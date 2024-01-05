/*
Get famous hashtags
GET: {{host}}/post/hashtags?hlimit=20&hskip=0
*/
export interface GetFamousHashtags { 
  hlimit: string; 
  hskip: string; 
}