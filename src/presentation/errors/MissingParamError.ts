export class MissingParamError extends Error {
  constructor(private paramName: string) {
    super(`Missin Param: ${paramName}`);
    this.name = 'MissingParamError';
  }
}
