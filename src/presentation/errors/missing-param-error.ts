export class MissingParamError extends Error {
  constructor(private paramName: string) {
    super(`Missing Param: ${paramName}`);
    this.name = 'MissingParamError';
  }
}
