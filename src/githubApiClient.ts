import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { getOctokit } from '@actions/github';
import { getInput } from '@actions/core';

/**
 *
 */
export default function getRestClient(): RestEndpointMethods {
  const octokit = getOctokit(getInput('github-token'));
  return octokit.rest;
}
