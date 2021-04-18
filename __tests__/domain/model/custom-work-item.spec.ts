import faker from 'faker';
import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import CustomWorkItem from '../../../src/domain/model/custom-work-item';

describe('workItem is invalid', () => {
  it.each([
    [undefined],
    [null],
  ])('work item is %p then should throw error', (workItem: any) => {
    expect.hasAssertions();
    let error: unknown;

    try {
      CustomWorkItem.from(workItem);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;

    expect(knownError).toBeDefined();
    expect(knownError.message).toStrictEqual('Invalid source work item');
  });

  it.each([
    [undefined],
    [null],
  ])('id property is %p then should throw error', (id: unknown) => {
    expect.hasAssertions();
    let error: unknown;
    const workItem = {
      id,
    } as WorkItem;

    try {
      CustomWorkItem.from(workItem);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;

    expect(knownError).toBeDefined();
    expect(knownError.message).toStrictEqual('Invalid source work item');
  });

  it.each([
    [undefined],
    [null],
  ])('fields property is %p then should throw error', (fields: unknown) => {
    expect.hasAssertions();
    let error: unknown;
    const workItem = {
      id: faker.datatype.number(),
      fields,
    } as WorkItem;

    try {
      CustomWorkItem.from(workItem);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;

    expect(knownError).toBeDefined();
    expect(knownError.message).toStrictEqual('Invalid source work item');
  });

  it.each([
    [undefined],
    [null],
    [''],
    [' '],
  ])('url is %p then should throw error', (url: unknown) => {
    expect.hasAssertions();
    let error: unknown;
    const workItem = {
      id: faker.datatype.number(),
      fields: {},
      url,
    } as WorkItem;

    try {
      CustomWorkItem.from(workItem);
    } catch (e) {
      error = e;
    }

    const knownError = error as Error;

    expect(knownError).toBeDefined();
    expect(knownError.message).toStrictEqual('Invalid source work item');
  });
});

describe('workItem is valid', () => {
  it('should return a valid CustomWorkItem', () => {
    expect.hasAssertions();

    const workItem = {
      id: faker.datatype.number(),
      fields: {},
      url: faker.internet.url(),
    } as WorkItem;

    const customWorkItem = CustomWorkItem.from(workItem);

    expect(customWorkItem).toBeDefined();
  });
});
