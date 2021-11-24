import * as core from '@actions/core';
import { createComment } from '../src/comments';

jest.mock('@actions/github', () => ({
  context: {
    payload: {},
  },
}));
jest.mock('@actions/core');

const mockCore = core as jest.Mocked<typeof core>;

describe('Comments utils', () => {
  describe('createComment', () => {
    it('Should exit with a warning if issue number is not found', async () => {
      await createComment('');
      expect(mockCore.warning).toHaveBeenCalledWith(
        'Issue number not found. Impossible to create a comment',
      );
    });
  });
});
