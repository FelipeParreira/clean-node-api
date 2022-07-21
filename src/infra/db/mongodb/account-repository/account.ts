import { AccountModel } from '../../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccount {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const accountData = { ...account }
    await accountCollection.insertOne(accountData)

    return MongoHelper.map(accountData)
  }
}
