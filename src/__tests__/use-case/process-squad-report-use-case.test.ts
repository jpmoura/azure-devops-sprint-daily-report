import faker from 'faker';
import { mocked, MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import AzureDevOpsConfigurationDto from '../../domain/interface/azure-devops-configuration-dto';
import EmailConfigurationDto from '../../domain/interface/email-configuration-dto';
import ProcessSquadReportRequest from '../../domain/use-case/request/process-squad-report-request';
import BuildDailyReportResponse from '../../domain/use-case/response/build-daily-report-response';
import BuildDailyReportUseCase from '../../use-case/build-daily-report-use-case';
import ProcessSquadReportUseCase from '../../use-case/process-squad-report-use-case';
import SendEmailUseCase from '../../use-case/send-email-use-case';

function setupSendEmailUseCaseMock(executeMock: jest.Mock<any, any>): MockedObjectDeep<typeof SendEmailUseCase> {
  const sendEmailUseCaseMock = mocked(SendEmailUseCase, true);

  sendEmailUseCaseMock.prototype.execute = executeMock;

  return sendEmailUseCaseMock;
}

function setupBuildDailyReportUseCaseMock(executeMock: jest.Mock<any, any>): MockedObjectDeep<typeof BuildDailyReportUseCase> {
  const buildDailyReportUseCaseMock = mocked(BuildDailyReportUseCase, true);

  buildDailyReportUseCaseMock.prototype.execute = executeMock;

  return buildDailyReportUseCaseMock;
}

function buildValidAzureDevopsConfigurationDto(): AzureDevOpsConfigurationDto {
  return {
    authentication: {
      password: faker.internet.password(),
      pat: faker.datatype.uuid(),
      user: faker.internet.userName(),
    },
    hasCustomBurndown: faker.datatype.boolean(),
    organization: faker.datatype.string(),
    project: faker.datatype.string(),
    team: faker.datatype.string(),
  };
}

function buildValidEmailConfigurationDto(): EmailConfigurationDto {
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
  };
}

const sut = new ProcessSquadReportUseCase();

describe('request is invalid', () => {
  describe('azureDevOps property is invalid', () => {
    it.each([
      [undefined],
      [null],
    ])('azureDevOps is %p then should throw error', async (azureDevOps: unknown) => {
      expect.hasAssertions();

      const request = {
        azureDevOps,
        email: buildValidEmailConfigurationDto(),
      } as ProcessSquadReportRequest;
      let error: unknown;
      const sendEmailUseCaseExecuteMock = jest.fn();
      const buildDailyReportUseCaseExecuteMock = jest.fn();
      setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
      setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('azureDevOps');
      expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
      expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
    });

    it.each([
      [undefined],
      [null],
    ])('hasCustomBurndown is %p then should throw error', async (hasCustomBurndown: unknown) => {
      expect.hasAssertions();

      const request = {
        azureDevOps: {
          hasCustomBurndown,
        },
        email: buildValidEmailConfigurationDto(),
      } as ProcessSquadReportRequest;
      let error: unknown;
      const sendEmailUseCaseExecuteMock = jest.fn();
      const buildDailyReportUseCaseExecuteMock = jest.fn();
      setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
      setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('hasCustomBurndown');
      expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
      expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
    });

    it.each([
      [undefined],
      [null],
      [''],
      [' '],
    ])('organization is %p then should throw error', async (organization: unknown) => {
      expect.hasAssertions();

      const request = {
        azureDevOps: {
          hasCustomBurndown: faker.datatype.boolean(),
          organization,
        },
        email: buildValidEmailConfigurationDto(),
      } as ProcessSquadReportRequest;
      let error: unknown;
      const sendEmailUseCaseExecuteMock = jest.fn();
      const buildDailyReportUseCaseExecuteMock = jest.fn();
      setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
      setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('organization');
      expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
      expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
    });

    it.each([
      [undefined],
      [null],
      [''],
      [' '],
    ])('project is %p then should throw error', async (project: unknown) => {
      expect.hasAssertions();

      const request = {
        azureDevOps: {
          hasCustomBurndown: faker.datatype.boolean(),
          organization: faker.datatype.string(),
          project,
        },
        email: buildValidEmailConfigurationDto(),
      } as ProcessSquadReportRequest;
      let error: unknown;
      const sendEmailUseCaseExecuteMock = jest.fn();
      const buildDailyReportUseCaseExecuteMock = jest.fn();
      setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
      setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('project');
      expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
      expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
    });

    it.each([
      [undefined],
      [null],
      [''],
      [' '],
    ])('team is %p then should throw error', async (team: unknown) => {
      expect.hasAssertions();

      const request = {
        azureDevOps: {
          hasCustomBurndown: faker.datatype.boolean(),
          organization: faker.datatype.string(),
          project: faker.datatype.string(),
          team,
        },
        email: buildValidEmailConfigurationDto(),
      } as ProcessSquadReportRequest;
      let error: unknown;
      const sendEmailUseCaseExecuteMock = jest.fn();
      const buildDailyReportUseCaseExecuteMock = jest.fn();
      setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
      setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('team');
      expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
      expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
    });

    describe('authentication property is invalid', () => {
      it.each([
        [undefined],
        [null],
      ])('authentication is %p then should throw error', async (authentication: unknown) => {
        expect.hasAssertions();

        const request = {
          azureDevOps: {
            hasCustomBurndown: faker.datatype.boolean(),
            organization: faker.datatype.string(),
            project: faker.datatype.string(),
            team: faker.datatype.string(),
            authentication,
          },
          email: buildValidEmailConfigurationDto(),
        } as ProcessSquadReportRequest;
        let error: unknown;
        const sendEmailUseCaseExecuteMock = jest.fn();
        const buildDailyReportUseCaseExecuteMock = jest.fn();
        setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
        setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

        try {
          await sut.execute(request);
        } catch (e) {
          error = e;
        }

        const knownError = error as Error;
        expect(knownError).toBeDefined();
        expect(knownError.message).toContain('authentication');
        expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
        expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
      });

      it.each([
        [undefined],
        [null],
        [''],
        [' '],
      ])('pat is %p then should throw error', async (pat: unknown) => {
        expect.hasAssertions();

        const request = {
          azureDevOps: {
            hasCustomBurndown: faker.datatype.boolean(),
            organization: faker.datatype.string(),
            project: faker.datatype.string(),
            team: faker.datatype.string(),
            authentication: {
              pat,
            },
          },
          email: buildValidEmailConfigurationDto(),
        } as ProcessSquadReportRequest;
        let error: unknown;
        const sendEmailUseCaseExecuteMock = jest.fn();
        const buildDailyReportUseCaseExecuteMock = jest.fn();
        setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
        setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

        try {
          await sut.execute(request);
        } catch (e) {
          error = e;
        }

        const knownError = error as Error;
        expect(knownError).toBeDefined();
        expect(knownError.message).toContain('pat');
        expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
        expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
      });

      it.each([
        [undefined],
        [null],
        [''],
        [' '],
      ])('hasCustomBurndown is true and user is %p then should throw error', async (user: unknown) => {
        expect.hasAssertions();

        const request = {
          azureDevOps: {
            hasCustomBurndown: true,
            organization: faker.datatype.string(),
            project: faker.datatype.string(),
            team: faker.datatype.string(),
            authentication: {
              pat: faker.datatype.string(),
              user,
            },
          },
          email: buildValidEmailConfigurationDto(),
        } as ProcessSquadReportRequest;
        let error: unknown;
        const sendEmailUseCaseExecuteMock = jest.fn();
        const buildDailyReportUseCaseExecuteMock = jest.fn();
        setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
        setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

        try {
          await sut.execute(request);
        } catch (e) {
          error = e;
        }

        const knownError = error as Error;
        expect(knownError).toBeDefined();
        expect(knownError.message).toContain('user');
        expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
        expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
      });

      it.each([
        [undefined],
        [null],
        [''],
        [' '],
      ])('hasCustomBurndown is true and password is %p then should throw error', async (password: unknown) => {
        expect.hasAssertions();

        const request = {
          azureDevOps: {
            hasCustomBurndown: true,
            organization: faker.datatype.string(),
            project: faker.datatype.string(),
            team: faker.datatype.string(),
            authentication: {
              pat: faker.datatype.string(),
              user: faker.datatype.string(),
              password,
            },
          },
          email: buildValidEmailConfigurationDto(),
        } as ProcessSquadReportRequest;
        let error: unknown;
        const sendEmailUseCaseExecuteMock = jest.fn();
        const buildDailyReportUseCaseExecuteMock = jest.fn();
        setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
        setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

        try {
          await sut.execute(request);
        } catch (e) {
          error = e;
        }

        const knownError = error as Error;
        expect(knownError).toBeDefined();
        expect(knownError.message).toContain('password');
        expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
        expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('email property is invalid', () => {
    it.each([
      [undefined],
      [null],
    ])('email is %p then should throw error', async (email: unknown) => {
      expect.hasAssertions();

      const request = {
        azureDevOps: buildValidAzureDevopsConfigurationDto(),
        email,
      } as ProcessSquadReportRequest;
      let error: unknown;
      const sendEmailUseCaseExecuteMock = jest.fn();
      const buildDailyReportUseCaseExecuteMock = jest.fn();
      setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
      setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('email');
      expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
      expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
    });

    describe('authentication property is not valid', () => {
      it.each([
        [undefined],
        [null],
      ])('authentication is %p then should throw error', async (authentication: unknown) => {
        expect.hasAssertions();

        const request = {
          azureDevOps: buildValidAzureDevopsConfigurationDto(),
          email: {
            authentication,
          },
        } as ProcessSquadReportRequest;
        let error: unknown;
        const sendEmailUseCaseExecuteMock = jest.fn();
        const buildDailyReportUseCaseExecuteMock = jest.fn();
        setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
        setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

        try {
          await sut.execute(request);
        } catch (e) {
          error = e;
        }

        const knownError = error as Error;
        expect(knownError).toBeDefined();
        expect(knownError.message).toContain('authentication');
        expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
        expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
      });

      it.each([
        [undefined],
        [null],
        [''],
        [' '],
      ])('user is %p then should throw error', async (user: unknown) => {
        expect.hasAssertions();

        const request = {
          azureDevOps: buildValidAzureDevopsConfigurationDto(),
          email: {
            authentication: {
              user,
            },
          },
        } as ProcessSquadReportRequest;
        let error: unknown;
        const sendEmailUseCaseExecuteMock = jest.fn();
        const buildDailyReportUseCaseExecuteMock = jest.fn();
        setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
        setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

        try {
          await sut.execute(request);
        } catch (e) {
          error = e;
        }

        const knownError = error as Error;
        expect(knownError).toBeDefined();
        expect(knownError.message).toContain('user');
        expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
        expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
      });
    });

    describe('server property is no valid', () => {
      it.each([
        [undefined],
        [null],
      ])('server is %p then should throw error', async (server: unknown) => {
        expect.hasAssertions();

        const request = {
          azureDevOps: buildValidAzureDevopsConfigurationDto(),
          email: {
            authentication: {
              user: faker.internet.userName(),
            },
            server,
          },
        } as ProcessSquadReportRequest;
        let error: unknown;
        const sendEmailUseCaseExecuteMock = jest.fn();
        const buildDailyReportUseCaseExecuteMock = jest.fn();
        setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
        setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

        try {
          await sut.execute(request);
        } catch (e) {
          error = e;
        }

        const knownError = error as Error;
        expect(knownError).toBeDefined();
        expect(knownError.message).toContain('server');
        expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
        expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
      });

      it.each([
        [undefined],
        [null],
        [''],
        [' '],
      ])('host is %p then should throw error', async (host: unknown) => {
        expect.hasAssertions();

        const request = {
          azureDevOps: buildValidAzureDevopsConfigurationDto(),
          email: {
            authentication: {
              user: faker.internet.userName(),
            },
            server: {
              host,
            },
          },
        } as ProcessSquadReportRequest;
        let error: unknown;
        const sendEmailUseCaseExecuteMock = jest.fn();
        const buildDailyReportUseCaseExecuteMock = jest.fn();
        setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
        setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

        try {
          await sut.execute(request);
        } catch (e) {
          error = e;
        }

        const knownError = error as Error;
        expect(knownError).toBeDefined();
        expect(knownError.message).toContain('host');
        expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
        expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
      });

      it('port is negative number then should throw error', async () => {
        expect.hasAssertions();

        const request = {
          azureDevOps: buildValidAzureDevopsConfigurationDto(),
          email: {
            authentication: {
              user: faker.internet.userName(),
            },
            server: {
              host: faker.internet.url(),
              port: faker.datatype.number(-1),
            },
          },
        } as ProcessSquadReportRequest;
        let error: unknown;
        const sendEmailUseCaseExecuteMock = jest.fn();
        const buildDailyReportUseCaseExecuteMock = jest.fn();
        setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
        setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

        try {
          await sut.execute(request);
        } catch (e) {
          error = e;
        }

        const knownError = error as Error;
        expect(knownError).toBeDefined();
        expect(knownError.message).toContain('port');
        expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
        expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
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
        azureDevOps: buildValidAzureDevopsConfigurationDto(),
        email: {
          authentication: {
            user: faker.internet.userName(),
          },
          server: {
            host: faker.internet.url(),
            port: faker.datatype.number({ min: 0 }),
          },
          carbonCopyRecipients,
        },
      } as ProcessSquadReportRequest;
      let error: unknown;
      const sendEmailUseCaseExecuteMock = jest.fn();
      const buildDailyReportUseCaseExecuteMock = jest.fn();
      setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
      setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('carbonCopyRecipients');
      expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
      expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
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
        azureDevOps: buildValidAzureDevopsConfigurationDto(),
        email: {
          authentication: {
            user: faker.internet.userName(),
          },
          server: {
            host: faker.internet.url(),
            port: faker.datatype.number({ min: 0 }),
          },
          recipients,
        },
      } as ProcessSquadReportRequest;
      let error: unknown;
      const sendEmailUseCaseExecuteMock = jest.fn();
      const buildDailyReportUseCaseExecuteMock = jest.fn();
      setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
      setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);

      try {
        await sut.execute(request);
      } catch (e) {
        error = e;
      }

      const knownError = error as Error;
      expect(knownError).toBeDefined();
      expect(knownError.message).toContain('recipients');
      expect(sendEmailUseCaseExecuteMock).not.toHaveBeenCalled();
      expect(buildDailyReportUseCaseExecuteMock).not.toHaveBeenCalled();
    });
  });
});

describe('request is valid', () => {
  it('iteration does not have a name then should use short email subject and send the report it then should return void', async () => {
    expect.hasAssertions();

    const request = {
      azureDevOps: buildValidAzureDevopsConfigurationDto(),
      email: buildValidEmailConfigurationDto(),
    } as ProcessSquadReportRequest;
    const sendEmailUseCaseExecuteMock = jest.fn();
    const buildDailyReportUseCaseExecuteMock = jest.fn();
    setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
    setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);
    buildDailyReportUseCaseExecuteMock.mockResolvedValue({
      report: faker.datatype.string(),
    } as BuildDailyReportResponse);

    await sut.execute(request);

    expect(sendEmailUseCaseExecuteMock).toHaveBeenCalledTimes(1);
    expect(buildDailyReportUseCaseExecuteMock).toHaveBeenCalledTimes(1);
  });

  it('iteration does have a name then should use it in email subject and send the report then should return void', async () => {
    expect.hasAssertions();

    const request = {
      azureDevOps: buildValidAzureDevopsConfigurationDto(),
      email: buildValidEmailConfigurationDto(),
    } as ProcessSquadReportRequest;
    const sendEmailUseCaseExecuteMock = jest.fn();
    const buildDailyReportUseCaseExecuteMock = jest.fn();
    setupSendEmailUseCaseMock(sendEmailUseCaseExecuteMock);
    setupBuildDailyReportUseCaseMock(buildDailyReportUseCaseExecuteMock);
    buildDailyReportUseCaseExecuteMock.mockResolvedValue({
      report: faker.datatype.string(),
      iterationName: faker.datatype.string(),
    } as BuildDailyReportResponse);

    await sut.execute(request);

    expect(sendEmailUseCaseExecuteMock).toHaveBeenCalledTimes(1);
    expect(buildDailyReportUseCaseExecuteMock).toHaveBeenCalledTimes(1);
  });
});
