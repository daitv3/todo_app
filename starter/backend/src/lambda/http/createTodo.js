import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {getUserId} from '../utils.mjs'
import {createTodo} from '../../businessLogic/todos.mjs'
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
    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)

    const newItem = await createTodo(newTodo, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  })
