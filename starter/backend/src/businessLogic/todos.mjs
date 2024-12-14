import * as uuid from 'uuid'
import {TodoAccess} from '../dataLayer/todosAccess.mjs'

const bucketName = process.env.TODOS_ATTACHMENT_S3_BUCKET
const todoAccess = new TodoAccess()

export async function getTodos(userId) {
    return todoAccess.getTodos(userId)
}

export async function createTodo(newTodo, userId) {
    const todoId = uuid.v4()
    const isDone = newTodo.done ?? false

    return await todoAccess.createTodo({
        todoId: todoId,
        userId:  userId,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
        name: newTodo.name,
        dueDate: newTodo.dueDate,
        done: isDone,
        createdAt: new Date().toISOString()
    })
}

export async function updateTodo(userId, todoId, todoUpdtData) {
    return await todoAccess.updateTodo(userId, todoId, todoUpdtData)
}

export async function deleteTodo(userId, todoId) {
    return await todoAccess.deleteTodo(userId, todoId)
}

