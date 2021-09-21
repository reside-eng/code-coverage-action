import * as core from '@actions/core';
import { generateComment, createComment } from './comments';
import getCoveragePercent from './coverage';

/**
 * Run code-coverage-action - comments coverage number and
 * uploads coverage JSON to cloud storage.
 */
export default async function run(): Promise<void> {
  const coverageFilePath = core.getInput('coverage-file');
  const { summary, files } = await getCoveragePercent(coverageFilePath);
  const comment = generateComment(summary, files);
  await createComment(comment);
  // TODO: Upload to specific bucket of cloud storage
}
