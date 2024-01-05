/*
Error in use creation ResponseBody
*/
export interface ErrorInUseCreationResponseBody { 
  errors: { 
        msg: string; 
        param: string; 
        nestedErrors: { 
              value: string; 
              msg: string; 
              param: string; 
              location: string; 
            }[]; 
      }[]; 
}