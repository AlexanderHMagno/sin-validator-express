# SIN Validator API

This project is an Express server that provides an API to validate Canadian Social Insurance Numbers (SINs) using the Luhn algorithm. The API endpoint is available at `/api/validate/{SIN}`.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoint](#api-endpoint)
- [Error Handling](#error-handling)
- [Testing](#testing)

## Installation

To get started, clone the repository and install the dependencies using PNPM:

```bash
git clone
cd sin-validator-express
pnpm install
```

## Usage

To run the server in development mode, use the following command:

```bash
pnpm run dev
```

## API Endpoint

### Validate SIN

Endpoint: /api/validate/{SIN}
Method: GET

Description: This endpoint returns a JSON object indicating whether the provided SIN is valid.
Response Structure:

```json
{
  "isValid": boolean,
  "errors": string[]
}
```

### Example Request

To validate a SIN, make a GET request to the endpoint with a valid SIN:

```bash
CURL http://localhost:3001/api/validate/046454286
```

### Example Response

For a valid SIN:

```json
{
  "isValid": true
}
```

For an invalid SIN:

```json
{
  "isValid": false,
  "errors": [
    "Well Well, it looks like your SIN doesn't have 9 digits, try again"
  ]
}
```

## Error Handling

The API returns appropriate HTTP status codes for various error scenarios:

```
400 Bad Request: When the SIN does not pass validation checks.
500 Internal Server Error: When an unexpected error occurs.
```

## Testing

This project includes unit tests using Jest. You can run the tests with the following command:

```bash
pnpm run test
```
