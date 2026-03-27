import { createError, H3Error } from 'h3'
import { ZodError } from 'zod'
export default function (error:unknown) {
    if (error instanceof ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        message:"Некорректные данные",
        data: error.issues.map(x=>x.message)// Expose Zod validation issues to the client
      });
    }else if(error instanceof H3Error){
      if (!error.data)
        error.data=[]
      throw error
    }else{
      console.error(error)
      throw createError({
        statusCode: 500,
        statusMessage: "server error",
        message:"Ошибка на стороне сервера",
        data:[]
      });
    }
}
