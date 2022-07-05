import express from 'express'
import setupMiddleares from './middleares'

const app = express()

setupMiddleares(app)

export default app
