import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {getUploadUrl} from '../../fileStorage/attachmentUtils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
      cors({
        credentials: true,
        origin: '*'
      })
  )
  .handler(async(event) => {
    console.log('Processing event: ', event)
    const todoId = event.pathParameters.todoId
    const url = await getUploadUrl(todoId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  })