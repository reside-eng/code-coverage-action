# code-coverage-action

> Comments and uploads code coverage

## Use

1. Make sure to have an npm script for running your tests in package.json:

```json

```

1. Call action in your workflow:

```yml
name: Verify

on: [pull_request]

jobs:
  build:
    name: build
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest]
        node-version: [14.x]
    if: github.actor != 'dependabot[bot]'
    outputs:
      project: ${{ steps.set-environment.outputs.project }}
      env: ${{ steps.set-environment.outputs.env }}
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2.3.4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2.4.0
        with:
          node-version: ${{ matrix.node-version }}
          cache: "yarn"

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Verify lint
        run: yarn lint

      - name: Test
        run: yarn test --coverage --coverageReporters="json-summary"

      - name: Report Coverage
        uses: reside-eng/code-coverage-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```
