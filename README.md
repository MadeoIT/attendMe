[![Build Status](https://travis-ci.org/MadeoIT/NotAnotherTodo_ReactNodeJs.svg?branch=master)](https://travis-ci.org/MadeoIT/NotAnotherTodo_ReactNodeJs)
[![Coverage Status](https://coveralls.io/repos/github/MadeoIT/NotAnotherTodo_ReactNodeJs/badge.svg?branch=master)](https://coveralls.io/github/MadeoIT/NotAnotherTodo_ReactNodeJs?branch=master)

# NOT ANOTHER TODO
This project is not intended as a production ready application. It is just a demonstration of my coding ability =D.

This is not a normal todo, but is a wrapper around it and it includes the following features:
* Multitenancy shared database architecture with JWT data separation for each query.
* Local authentication, google authentication.
* Account email confirmation and password rest.
* Rate limiter.
* JWT token, refresh token and csrf token.

### Future features
* Geolocation for log in and email alert
* Block, delete account option
* Two factor authentication

## Built With
* React and Redux - Client framework and state management library
* Expressjs - The web framework used
* Sequelize - ORM
* PostgreSQL - Database

## Servers side architecture
The server is running on nodejs. The framework used is Expressjs with Sequelize as ORM.

The authentication flow is based on tokens, all the tokens are saved in the cookies with no sessions so that the system can be easily  scalable across multiple instances.
To avoid cross side request forgery the server will send, via header, another token (csrf-token) which will be saved in the localStorage in the client. 
The csrf-token is also saved in the token payload so that the server can compare them for each request.

The data separation, across the tenants, is achieved in the server side via token, every decoded payload contains tenant id which will be used to make the query and retrieve the data for each tenant.

### Tokens and Cookies
* Normal token: JWT token which will be verify for each request, but it will not be verified against the database to avoid performance bottleneck. This token expire every 15 minutes
* Refresh token: JWT token will be checked if the normal token is not valid or expired. This token will be verified against the database. This token expires every 7 days.
* The cookies will expire every 7 days of inactivity.

## Client side architecture
React and Redux have been used for the client side.
To handle all the request I have used a central middleware "api.js"; this middleware will handle all the async logic so that the action creators do not contain any logic at all only plain objects.
In addition to handle the token/refresh-token logic a second middleware "refreshToken.js" has been added. In case the normal token will expire (after 15 minutes) the second middleware will send a request to obtain a new token, if the refresh token is valid. Upon receiving  back both tokens the middleware will simply resend the previous request.


## Getting Started
### Development
* Clone the repository
* In the server/config production.json file and copy-paste this lines of code
```
{
  "encryption": {
    "saltRounds": 10,
    "jwtSk": "your json web token secret key",
    "jwtRefreshSk": "your json web token secret key (refresh token)",
    "jwtConfirmationSk": "your json web token secret key (other tokens for email confirmation or password reset)",
    "tokenExp": "token expirations (ex: 15m, 7 d)",
    "refreshTokenExp": "token expirations (ex: 15m, 7 d)",
    "confirmationTokenExp":  "token expirations (ex: 15m, 7 d)"
  },
  "googleAuth": {
    "clientID": "google client id",
    "clientSecret": "google client secret",
    "callbackURL": "/auth/google/callback"
  },
  "emailService": {
    "EMAIL_HOST": "any email host, ex: smtp.ethereal.email",
    "EMAIL_USER": "user name",
    "EMAIL_PASS": "password",
    "EMAIL_PORT": port (must be a integer)
  },
  "cookie": {
    "secure": false //leave this as default if you do not use https. In development mode the cookie secure option is disable
  },
  "origin": "http://localhost:3000" //server url
}
```
You can use etheral email to test emails but the app can be easily extended to any email or other notification service.Visit https://ethereal.email/ and make an account, is free!

#### With Docker
If you have docker run the command line in the main folder
```
docker-compose up
```
Once finished the installation just access localhost:8080.
If you are running docker tollbox then you should:
```
docker-machine ip
```
and then your app will be running at that IP address + port 8080. Usually is:
```
192.168.100:8080
```
#### Without Docker
Install postgres and modify the config.json "production" in the server/config folder accordingly to your database credentials
Then run on both the /server and the /client folder

```
yarn or npm install && yarn start or npm start
```

## Authors

* **Matteo Gioioso** 
gioioso.matteo@gmail.com

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
