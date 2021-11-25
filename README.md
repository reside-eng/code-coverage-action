# code-coverage-action

> Comments and uploads code coverage for global reporting

[![NPM version][npm-image]][npm-url]
[![Build Status][build-status-image]][build-status-url]
[![Code Coverage][coverage-image]][coverage-url]
[![License][license-image]][license-url]
[![semantic-release][semantic-release-icon]][semantic-release-url]
[![Code Style][code-style-image]][code-style-url]

## Use

1. Call action in your workflow after running tests with coverage report generation:

```yml
name: Verify

on: [pull_request]

jobs:
  build:
    name: build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14.x]
    if: github.actor != 'dependabot[bot]'
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

[npm-image]: https://img.shields.io/npm/v/@side/code-coverage-action.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@side/code-coverage-action
[build-status-image]: https://img.shields.io/github/workflow/status/reside-eng/code-coverage-action/Publish?style=flat-square
[build-status-url]: https://github.com/reside-eng/code-coverage-action/actions
[coverage-image]: https://img.shields.io/codecov/c/github/reside-eng/code-coverage-action.svg?style=flat-square
[coverage-url]: https://codecov.io/gh/reside-eng/code-coverage-action
[license-image]: https://img.shields.io/npm/l/@side/code-coverage-action.svg?style=flat-square
[license-url]: https://github.com/reside-eng/code-coverage-action/blob/main/LICENSE
[code-style-image]: https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square
[code-style-url]: https://github.com/airbnb/javascript
[semantic-release-icon]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
