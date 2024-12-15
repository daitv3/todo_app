import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodoAccess {
    constructor (
        documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE,
        userIdIndex = process.env.TODOS_USER_ID_INDEX
    ) {
        this.documentClient = documentClient;
        this.todosTable = todosTable;
        this.dynamoDBDocument = DynamoDBDocument.from(this.documentClient)
        this.userIdIndex = userIdIndex
    }

    async getTodos(userId) {
        console.log(`Getting all todos by userid login: ${userId}`)

        const result = await this.dynamoDBDocument.query({
            TableName: this.todosTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
          })

        console.log(`result: ${result}`)
        return result.Items
    }

    async createTodo(todo) {
        console.log(`creating a todo with id ${todo.todoId}`)

        await this.dynamoDBDocument.put({
            TableName: this.todosTable,
            Item: todo
        })

        return todo;
    }

    async updateTodo(userId, todoId, todoUpdtData) {
        console.log(`update a todo with id ${todoId}`)

        await this.dynamoDBDocument.update({
            TableName: this.todosTable,
            Key: { todoId: todoId, userId: userId },
            UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done'
            },
            ExpressionAttributeValues: {
                ':name': todoUpdtData.name,
                ':dueDate': todoUpdtData.dueDate,
                ':done': todoUpdtData.done
            },
            ReturnValues: 'UPDATED_NEW'
        })

    }

    async updateAttchmentTodo(userId, todoId, attachmentUrl) {
        console.log(`update a todo attachmentUrl with id ${todoId}`)

        await this.dynamoDBDocument.update({
            TableName: this.todosTable,
            Key: { todoId: todoId, userId: userId },
            UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
            ExpressionAttributeNames: {
                '#attachmentUrl': 'attachmentUrl'
            },
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            },
            ReturnValues: 'UPDATED_NEW'
        })

    }

    async deleteTodo(userId, todoId) {
        console.log(`delete a todo with id ${todoId}`)

        await this.dynamoDBDocument.delete({
            TableName: this.todosTable,
            Key: { todoId:  todoId, userId: userId }
        })
    }
}