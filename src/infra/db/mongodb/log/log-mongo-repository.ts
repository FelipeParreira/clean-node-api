import { MongoHelper } from '../helpers/mongo-helper'
import { LogErrorRepository } from '../../../../data/protocols/db/log/log-error-repository'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollention = await MongoHelper.getCollection('errors')
    await errorCollention.insertOne({
      stack,
      date: new Date()
    })
  }
}
