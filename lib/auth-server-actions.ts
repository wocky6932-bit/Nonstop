'use server'

import * as mysqlServer from './mysql-server'

export async function createUserAction(userData: any) {
    return await mysqlServer.createUser(userData)
}

export async function authenticateUserAction(email: string, password: string) {
    return await mysqlServer.authenticateUser(email, password)
}

export async function updateUserAction(userId: string, updates: any) {
    return await mysqlServer.updateUser(userId, updates)
}

export async function getUserByEmailAction(email: string) {
    return await mysqlServer.getUserByEmail(email)
}

export async function createOrderAction(orderData: any) {
    return await mysqlServer.createOrder(orderData)
}
