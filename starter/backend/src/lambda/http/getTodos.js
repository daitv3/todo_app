import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {getUserId} from '../utils.mjs'
import {getTodos} from '../../businessLogic/todos.mjs'

// TODO: Get all TODO items for a current user
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
    const userId = getUserId(event)

    const todos = await getTodos(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
  })