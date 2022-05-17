# Password Validator

> A complete and comprehensive password validator

## Prerequisites

This project requires NodeJS (version 12 or later)

## Install

```sh
npm i hs-password-validator
```

Or if you prefer using Yarn:

```sh
yarn add hs-password-validator
```

## Usage

```ts
import PasswordValidator from 'hs-password-validator'

// Using only options
// Validate if a password has min length of characters
const validate = PasswordValidator({
  password: 'myTestingPassword',
  options: ['min']
})

console.log(validate)
/*
{
    "hasInvalidFields": false,
    "data": [
        {
            "validation": "min",
            "arguments": 10,
            "message": "Must contain at least 10 characters",
            "satisfied": true
        }
    ]
}
*/

// Validate if a password has at least one upper case character
const validateUppercase = PasswordValidator({
  password: 'mypasswordhasnouppercase',
  options: ['uppercase']
})

console.log(validateUppercase)
/*
{
    "hasInvalidFields": true,
    "data": [
        {
            "validation": "uppercase",
            "message": "At least one uppercase letter",
            "satisfied": false
        }
    ]
}
*/
```

### Configuration

By default all options works without any extra configuration but you may want change some of them.

```ts
const validate = PasswordValidator({
  password: 'ShortPassword',
  options: ['min'],
  config: { length: { minLength: 16 } }
})

console.log(validate)
/*
{
    "hasInvalidFields": true,
    "data": [
        {
            "validation": "min",
            "arguments": 16,
            "message": "Must contain at least 16 characters",
            "satisfied": false
        }
    ]
}
*/
```

## Multiples options

You can combine multiple options to validate a password.

```ts
const validate = PasswordValidator({
  password: 'MyPassword',
  options: ['min', 'uppercase', 'lowercase', 'number', 'symbol'],
  config: { length: { minLength: 8 } }
})

console.log(validate)
/*
{
    "hasInvalidFields": true,
    "data": [
        {
            "validation": "min",
            "arguments": 8,
            "message": "Must contain at least 8 characters",
            "satisfied": true
        },
        {
            "validation": "uppercase",
            "message": "At least one uppercase letter",
            "satisfied": true
        },
        {
            "validation": "lowercase",
            "message": "At least one lowercase letter",
            "satisfied": true
        },
        {
            "validation": "number",
            "message": "Must contain numbers",
            "satisfied": false
        },
        {
            "validation": "symbol",
            "message": "At least one special character",
            "satisfied": false
        }
    ]
}
*/
```

## Available options

| Option | Description |
| ------ | :---: |
| min | Minimun password length  |
| max | Maximun password length |
| uppercase | At least one uppercase |
| lowercase | At least one lowercase |
| symbol | At least one symbol |
| number | At least one number |
| space | Does not allow spaces |
| sequential | Does not allow sequential letters |
| strength | Password strength |

## Available configs

### Length

| Option | Description | Default |
| ------ | :---: | :---: |
| minLength | Minimun password length  | 10 |
| maxLength | Maximun password length  | 128 |

### Score Config

| Option | Description | Default |
| ------ | :---: | :---: |
| minAcceptable | Minimun strength allowed  | strong |
