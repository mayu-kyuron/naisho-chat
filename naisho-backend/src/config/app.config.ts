require('dotenv').config()

export const HTTP_HOST = process.env.HTTP_HOST
export const HTTP_PORT = process.env.HTTP_PORT

export const DB_HOST = process.env.DATABASE_HOST
export const DB_PORT = process.env.DATABASE_PORT
export const DB_USERNAME = process.env.DATABASE_USERNAME
export const DB_PASSWORD = process.env.DATABASE_PASSWORD
export const DB_NAME = process.env.DATABASE_NAME

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
