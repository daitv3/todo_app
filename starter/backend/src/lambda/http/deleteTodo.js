import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {deleteTodo} from '../../businessLogic/todos.mjs'
import {getUserId} from '../utils.mjs'

// TODO: Remove a TODO item by id --done
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
    const userId = getUserId(event)

    try {
      await deleteTodo(userId, todoId)
      return {
        statusCode: 204,
        body: null
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not delete todo' })
      };
    }
    
  })