import faker from 'faker';
import Mail from 'nodemailer/lib/mailer';
import { mocked, MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { Logger } from 'tslog';
import SendEmailRequest from '../../src/domain/use-case/request/send-email-request';
import SendEmailUseCase from '../../src/use-case/send-email-use-case';

function setupNodemailerMock(sendMailMock: jest.Mock<any, any>): MockedObjectDeep<typeof Mail> {
  const nodemailerMock = mocked(Mail, true);

  nodemailerMock.prototype.sendMail = sendMailMock;

  return nodemailerMock;
}

function buildValidSendEmailRequest(): SendEmailRequest {
  return {
    authentication: {
      password: faker.internet.password(),
      user: faker.internet.userName(),
    },
    carbonCopyRecipients: [faker.internet.email()],
    recipients: [faker.internet.email()],
    server: {
      host: faker.internet.url(),
      port: faker.datatype.number(),
    },
    htmlContent: faker.datatype.string(),
    subject: faker.datatype.string(),
  };
}

const sut = new SendEmailUseCase();

const logger = mocked(Logger, true);
jest.spyOn(logger.prototype, 'error').mockImplementation();

describe('request is invalid', () => {
  describe('authentication property is not valid', () => {
    it.each([
      [undefined],
      [null],
    ])('authentication is %p then should throw error', async (authentication: unknown) => {
      expect.hasAssertions();

      const request = {
        authentication,
      } as SendEmailRequest;
      let error: unknown;
      const sendMailMock = jest.fn();
      setupNodemailerMock(sendMailMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('authentication');
      expect(sendMailMock).not.toHaveBeenCalled();
    });

    it.each([
      [undefined],
      [null],
      [''],
      [' '],
    ])('user is %p then should throw error', async (user: unknown) => {
      expect.hasAssertions();

      const request = {
        authentication: {
          user,
        },
      } as SendEmailRequest;
      let error: unknown;
      const sendMailMock = jest.fn();
      setupNodemailerMock(sendMailMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('user');
      expect(sendMailMock).not.toHaveBeenCalled();
    });
  });

  describe('server property is no valid', () => {
    it.each([
      [undefined],
      [null],
    ])('server is %p then should throw error', async (server: unknown) => {
      expect.hasAssertions();

      const request = {
        authentication: {
          user: faker.internet.userName(),
        },
        server,
      } as SendEmailRequest;
      let error: unknown;
      const sendMailMock = jest.fn();
      setupNodemailerMock(sendMailMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('server');
      expect(sendMailMock).not.toHaveBeenCalled();
    });

    it.each([
      [undefined],
      [null],
      [''],
      [' '],
    ])('host is %p then should throw error', async (host: unknown) => {
      expect.hasAssertions();

      const request = {
        authentication: {
          user: faker.internet.userName(),
        },
        server: {
          host,
        },
      } as SendEmailRequest;
      let error: unknown;
      const sendMailMock = jest.fn();
      setupNodemailerMock(sendMailMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('host');
      expect(sendMailMock).not.toHaveBeenCalled();
    });

    it('port is negative number then should throw error', async () => {
      expect.hasAssertions();

      const request = {
        authentication: {
          user: faker.internet.userName(),
        },
        server: {
          host: faker.internet.url(),
          port: faker.datatype.number(-1),
        },
      } as SendEmailRequest;
      let error: unknown;
      const sendMailMock = jest.fn();
      setupNodemailerMock(sendMailMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('port');
      expect(sendMailMock).not.toHaveBeenCalled();
    });
  });

  it.each([
    [[undefined]],
    [[null]],
    [['']],
    [[' ']],
    [[faker.datatype.string()]],
  ])('carbonCopyRecipients is %p then should throw error', async (carbonCopyRecipients: unknown) => {
    expect.hasAssertions();

    const request = {
      authentication: {
        user: faker.internet.userName(),
      },
      server: {
        host: faker.internet.url(),
        port: faker.datatype.number({ min: 0 }),
      },
      carbonCopyRecipients,
    } as SendEmailRequest;
    let error: unknown;
    const sendMailMock = jest.fn();
    setupNodemailerMock(sendMailMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;
    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('carbonCopyRecipients');
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it.each([
    [undefined],
    [null],
    [[undefined]],
    [[null]],
    [['']],
    [[' ']],
    [[faker.datatype.string()]],
  ])('recipients is %p then should throw error', async (recipients: unknown) => {
    expect.hasAssertions();

    const request = {
      authentication: {
        user: faker.internet.userName(),
      },
      server: {
        host: faker.internet.url(),
        port: faker.datatype.number({ min: 0 }),
      },
      recipients,
    } as SendEmailRequest;
    let error: unknown;
    const sendMailMock = jest.fn();
    setupNodemailerMock(sendMailMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;
    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('recipients');
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it.each([
    [undefined],
    [null],
    [''],
    [' '],
  ])('htmlContent is %p then should throw error', async (htmlContent: unknown) => {
    expect.hasAssertions();

    const request = {
      authentication: {
        user: faker.internet.userName(),
      },
      server: {
        host: faker.internet.url(),
        port: faker.datatype.number({ min: 0 }),
      },
      recipients: [faker.internet.email()],
      htmlContent,
    } as SendEmailRequest;
    let error: unknown;
    const sendMailMock = jest.fn();
    setupNodemailerMock(sendMailMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;
    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('htmlContent');
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it.each([
    [undefined],
    [null],
    [''],
    [' '],
  ])('subject is %p then should throw error', async (subject: unknown) => {
    expect.hasAssertions();

    const request = {
      authentication: {
        user: faker.internet.userName(),
      },
      server: {
        host: faker.internet.url(),
        port: faker.datatype.number({ min: 0 }),
      },
      recipients: [faker.internet.email()],
      htmlContent: faker.datatype.string(),
      subject,
    } as SendEmailRequest;
    let error: unknown;
    const sendMailMock = jest.fn();
    setupNodemailerMock(sendMailMock);

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;
    expect(knownError).toBeDefined();
    expect(knownError.message).toContain('subject');
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});

describe('request is valid', () => {
  it('error while sending email then should throw error', async () => {
    expect.hasAssertions();

    const request = buildValidSendEmailRequest();
    let error: unknown;
    const sendMailMock = jest.fn();
    setupNodemailerMock(sendMailMock);
    sendMailMock.mockRejectedValue(new Error());

    try {
      await sut.execute(request);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;
    expect(knownError).toBeDefined();
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  it('carbonCopyRecipients is empty and email sent successfully then should return void', async () => {
    expect.hasAssertions();

    const request = buildValidSendEmailRequest();
    request.carbonCopyRecipients = undefined;
    const sendMailMock = jest.fn();
    setupNodemailerMock(sendMailMock);

    await sut.execute(request);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  it('carbonCopyRecipients is filled and email sent successfully then should return void', async () => {
    expect.hasAssertions();

    const request = buildValidSendEmailRequest();
    const sendMailMock = jest.fn();
    setupNodemailerMock(sendMailMock);

    await sut.execute(request);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });
});
