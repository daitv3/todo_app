import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {getUploadUrl} from '../../fileStorage/attachmentUtils.mjs'
import {getUserId} from '../utils.mjs'
import {updateAttchmentTodo} from '../../businessLogic/todos.mjs'

const bucketName = process.env.TODOS_ATTACHMENT_S3_BUCKET
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

    const userId = getUserId(event)
    const attchmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`;
    await updateAttchmentTodo(userId, todoId, attchmentUrl)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  })