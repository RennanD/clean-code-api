export class InvalidParamError extends Error {
  constructor(private paramName: string) {
    super(`Invalid Param: ${paramName}`);
    this.name = 'InvalidParamError';
  }
}
