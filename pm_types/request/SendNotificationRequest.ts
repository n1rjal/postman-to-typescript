/*
Send Notification
POST: {{host}}/fcm/send-test
*/
export interface SendNotification { 
  title: string; 
  body: string; 
}