# Simple browser authorization manager (SBAM)

**SBAM** is a library for managing authentication in the client-side part of an application. It provides a simple interface for working with the user's local session, including token storage, validation, and basic login and logout operations.

## Main Features

- **Session Storage**: SBAM stores the user session in the browser's local storage (localStorage or sessionStorage).

- **Token Validation**: The library allows you to validate the user's token.

- **Setting and Getting Token**: You can easily set and get tokens using this library.

- **Logout**: The library also provides a simple way for users to log out by removing data from local storage.

- **Custom Token Type**: You can override the token type to use a custom object instead of a string.

- **Custom Token Validation**: Allows the user to define their own logic for validating a custom token.

## Code Examples

### Installation and Usage


```javascript
import SBAM from 'sbam-js';

// Create an instance of SBAM
const authManager = new SBAM();

// User login
const userToken = 'exampleToken123';
if (authManager.login(userToken)) {
    console.log('User successfully logged in');
}

// Get the user token
const token = authManager.token;
console.log('Current user token:', token);

// User logout
if (authManager.logout()) {
    console.log('User successfully logged out');
}
```

### Configuration with Custom Token Type and Validation


```javascript
import SBAM from 'sbam-js';

// Define custom token type (for example, IJWT)
interface IJWT {
    userId: number;
    username: string;
    // Add other fields for your custom token
}

// Create an instance of SBAM with custom token type
const authManager = new SBAM<IJWT>();

// User login with custom token
const customToken: IJWT = { userId: 1, username: 'exampleUser' };
if (authManager.login(customToken)) {
    console.log('User successfully logged in');
}

// Custom token validation
function customTokenValidation(token: IJWT | null): boolean {
    // Your token validation logic
    if (token && token.userId && token.username) {
        return true;
    }
    return false;
}

// Set custom validation function
authManager.validateToken = customTokenValidation;

// User logout
if (authManager.logout()) {
    console.log('User successfully logged out');
}
```

## Installation

You can install the library using NPM:

```shell
npm install sbam-js
```
or
```shell
yarn add sbam-js
```


## License

This project is licensed by [MIT License](LICENSE).
