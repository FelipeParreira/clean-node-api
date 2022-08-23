export class EmailInUseError extends Error {
  constructor () {
    super('The provided email address is already in use')
    this.name = 'EmailInUseError'
  }
}
