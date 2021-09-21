import fs from 'fs';

interface CoverageNumbers {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}

export interface ICoverageNumbersGroup {
  lines: CoverageNumbers;
  statements: CoverageNumbers;
  functions: CoverageNumbers;
  branches: CoverageNumbers;
}

export type ILineCoverageGroup = ICoverageNumbersGroup & { path: string };
interface CoverageFileResults {
  summary: ICoverageNumbersGroup;
  files: ILineCoverageGroup[];
}

/**
 * @param coveragePath - Path to coverage file
 * @returns Coverage file results
 */
function parseCoverageFile(coveragePath: string): CoverageFileResults {
  try {
    const fileBuffer = fs.readFileSync(coveragePath);
    const [line1, ...otherLines] = fileBuffer.toString().split('\n,');
    return {
      summary: JSON.parse(`${line1}}`).total,
      files: otherLines?.map((line, index) => {
        let fileNumbersStr;
        let filePath;
        if (index === 0) {
          filePath = 'All Files';
          fileNumbersStr = line;
        } else {
          [filePath, fileNumbersStr] = line.split(': ');
        }
        const fileNumbers = JSON.parse(fileNumbersStr);
        return {
          path: filePath,
          ...fileNumbers,
        };
      }),
    };
  } catch {
    throw new Error('Error parsing coverage summary file');
  }
}

/**
 * @param coverageFilePath - Setting for path to coverage file (default used otherwise)
 * @returns Coverage percent and file info
 */
export default async function getCoveragePercent(
  coverageFilePath?: string,
): Promise<{ summary: ICoverageNumbersGroup; files: ILineCoverageGroup[] }> {
  // TODO: Look into if lcov.info should be used instead
  const coveragePath = coverageFilePath || 'coverage/coverage-summary.json';
  if (!fs.existsSync(coveragePath)) {
    // TODO: Add clear warning about coverage file missing
    throw new Error('Coverage summary file does not exist');
  }
  const { summary, files } = parseCoverageFile(coveragePath);
  // TODO: Add clear warning about making sure to use --coverageReporters="json-summary"
  if (!summary?.statements?.pct) {
    throw new Error('statements.pct not set within coverage summary file');
  }
  return { summary, files };

  // NOTE: the following are also options:
  // 1. const command = 'execCommand('npx nyc report -t coverage --report=json-summary');
  // 2. coverage-percentage package could be used here if only lcov is present
  // it internally uses lcov-parse
  // const percent = await execCommand(
  //   'npx coverage-percentage ./coverage/lcov.info --lcov',
  // );
  // return Number(parseFloat(percent).toFixed(2));
}
