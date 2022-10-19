/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/expressRoutesAdapter'
import { makeSingUpController } from '../factories/singup/singupFactory'

export default (router: Router): void => {
  router.post('/singup', adaptRoute(makeSingUpController()))
}
