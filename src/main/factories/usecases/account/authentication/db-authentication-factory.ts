import { DbAuthentication } from '../../../../../data/usecases/authentication/db-authentication'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { BCryptAdapter } from '../../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../../../config/env'
import { Authentication } from '../../../../../domain/usecases/authentication'

export const makeDbAuthentication = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository()
  const salt = 12
  const bcryptAdapter = new BCryptAdapter(salt)
  const jwtAdapter = new JWTAdapter(env.jwtSecret)
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
}
