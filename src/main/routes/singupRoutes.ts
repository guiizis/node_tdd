/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/expressRoutesAdapter'
import { makeSingUpController } from '../factories/singup'

export default (router: Router): void => {
  router.post('/singup', adaptRoute(makeSingUpController()))
}
