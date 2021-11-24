import { getOctokit } from '@actions/github';
import { getInput } from '@actions/core';
// NOTE: Import below is child dependency of @actions/github which is only used for a type (which is not exported)
// eslint-disable-next-line import/no-unresolved
import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';

/**
 * Get Github Rest Client
 *
 * @returns Github Rest client
 */
export default function getRestClient(): RestEndpointMethods {
  const octokit = getOctokit(getInput('github-token'));
  return octokit.rest;
}
