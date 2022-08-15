import { SignUpController } from '../../presentation/controllers/signup/signup'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../presentation/protocols/controller'
import { LogControllerDecorator } from '../decorators/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository
  )
  const validationComposite = makeSignUpValidation()
  const controller = new SignUpController(
    dbAddAccount,
    validationComposite
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
