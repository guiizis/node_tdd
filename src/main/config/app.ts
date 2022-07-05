import express from 'express'
import setupMiddleares from './middleares'
import setupRoots from './routes'

const app = express()

setupMiddleares(app)
setupRoots(app)

export default app
