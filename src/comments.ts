import { WebhookPayload } from '@actions/github/lib/interfaces';
import { getInput, warning } from '@actions/core';
import * as github from '@actions/github';
import { ICoverageNumbersGroup, ILineCoverageGroup } from './coverage';
import githubApiClient from './githubApiClient';

/**
 * @param row - Coverage info row
 * @returns Row of coverage number columns
 */
function rowToColumns(row: ICoverageNumbersGroup | ILineCoverageGroup) {
  const columns = ['statements', 'branch', 'functions', 'lines'];
  return columns.map(
    (fieldName) => row?.[fieldName as keyof ICoverageNumbersGroup]?.pct,
  );
}

/**
 * @param summary - Coverage summary
 * @param lines - Coverage lines info
 * @returns Comment with markdown table containing coverage summary
 */
function linesToComment(
  summary: ICoverageNumbersGroup,
  lines: ILineCoverageGroup[],
) {
  // order: statements, branch, functions, lines, uncovered
  // TODO: add uncovered line numbers
  const content = [
    ['All Files', ...rowToColumns(summary)],
    ...lines.map((row) => [row.path, ...rowToColumns(row)]),
  ];
  return `
  File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------|---------|----------|---------|---------|-------------------
${content.map((contentRow) => contentRow.join(' | ')).join('\n')}
------------------|---------|----------|---------|---------|-------------------
  `;
}

/**
 * @param summary - Coverage summary
 * @param lines - Coverage lines info
 * @returns Comment string
 */
export function generateComment(
  summary: ICoverageNumbersGroup,
  lines: ILineCoverageGroup[],
): string {
  return `<p>Total Coverage: <code>${summary.statements?.pct} %</code></p>
  <details><summary>Coverage report</summary>

  ${linesToComment(summary, lines)}

  </details>`;
}

/**
 * @param input - Input name
 * @returns Boolean or undefined
 */
function getBooleanInput(input: string): boolean | undefined {
  switch (getInput(input)) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return undefined;
  }
}

/**
 * @param payload - Request payload
 * @returns Issue number
 */
function getIssueNumber(payload: WebhookPayload): number | undefined {
  return payload?.pull_request?.number || payload?.issue?.number;
}

/**
 * @param issueNumber - Number of PR issue
 */
async function deletePreviousComments(issueNumber: number) {
  const gitHub = githubApiClient();
  const { data: comments } = await gitHub.issues.listComments({
    ...github.context.repo,
    per_page: 100,
    issue_number: issueNumber,
  });

  await Promise.all(
    comments
      .filter(
        (comment) =>
          comment.user?.login === 'github-actions[bot]' &&
          comment.body?.includes('Total Coverage'),
      )
      .map((comment) =>
        gitHub.issues.deleteComment({
          ...github.context.repo,
          comment_id: comment.id,
        }),
      ),
  );
}

/**
 * @param comment - Coverage comment
 */
export async function createComment(comment: string): Promise<void> {
  const issueNumber = getIssueNumber(github.context.payload);
  if (!issueNumber) {
    warning('Issue number not found. Impossible to create a comment');
    return;
  }

  const deletePrev = getBooleanInput('delete-previous');
  if (deletePrev) {
    await deletePreviousComments(issueNumber);
  }

  await githubApiClient().issues.createComment({
    repo: github.context.repo.repo,
    owner: github.context.repo.owner,
    body: comment,
    issue_number: issueNumber,
  });
}
