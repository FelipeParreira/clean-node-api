import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../../../presentation/controllers/login/login/login-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeDbAuthentication } from '../../../usecases/account/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const authenticator = makeDbAuthentication()
  const validationComposite = makeLoginValidation()
  const controller = new LoginController(validationComposite, authenticator)
  return makeLogControllerDecorator(controller)
}
