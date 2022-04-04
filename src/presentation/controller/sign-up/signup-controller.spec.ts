import { InvalidParamError } from '../../errors/invalid-param-error';
import { MissingParamError } from '../../errors/missing-param-error';
import { ServerError } from '../../errors/server-error';
import { IEmailValidator } from '../../protocols/email-validator';
import { SignUpController } from './signup-controller';

type IMakeSut = {
  sut: SignUpController;
  emailValidator: IEmailValidator;
};

const makeSut = (): IMakeSut => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return !!email;
    }
  }

  const emailValidatorStub = new EmailValidatorStub();

  const sut = new SignUpController(emailValidatorStub);

  return { sut, emailValidator: emailValidatorStub };
};

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_name',
        passwordConfirmation: 'any_name',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('should return 400 if no email is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name.com',
        password: 'any_name',
        passwordConfirmation: 'any_name',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return 400 if no password is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any_name',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });

  it('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidator } = makeSut();

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('should call email validator with correct email', () => {
    const { sut, emailValidator } = makeSut();

    const isValidSpy = jest.spyOn(emailValidator, 'isValid');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
  });

  it('should return 500 if email validator throws', () => {
    class EmailValidatorStub implements IEmailValidator {
      isValid(email: string): boolean {
        throw new Error();
      }
    }

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const emailValidatorStub = new EmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub);

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
