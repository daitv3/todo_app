import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {updateTodo} from '../../businessLogic/todos.mjs'
import {getUserId} from '../utils.mjs'

// TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
export const handler = middy()
  .use(httpErrorHandler())
  .use(
      cors({
        credentials: true,
        origin: '*'
      })
  )
  .handler(async(event) => {
    console.log('Processing update todo event: ', event)
    const todoId = event.pathParameters.todoId
    const updatedTodoItem = JSON.parse(event.body)
    const userId = getUserId(event)

    const todos = await updateTodo(userId,todoId, updatedTodoItem)

    return {
      statusCode: 200,
      body: null
    }
  })