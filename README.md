[![Build Status](https://travis-ci.org/MadeoIT/NotAnotherTodo_ReactNodeJs.svg?branch=master)](https://travis-ci.org/MadeoIT/NotAnotherTodo_ReactNodeJs)
[![Coverage Status](https://coveralls.io/repos/github/MadeoIT/NotAnotherTodo_ReactNodeJs/badge.svg?branch=master)](https://coveralls.io/github/MadeoIT/NotAnotherTodo_ReactNodeJs?branch=master)

# NOT ANOTHER TODO

This is not a normal todo, but is a wrapper around it and it includes the following features:
* Multitenancy shared database architecture with JWT data separation for each query.
* Local authentication, google authentication.
* Account email confirmation and passoword rest email.
* Geolocation for log in and email alert
* Block account option
* Rate limiter
* JWT token, refresh token and csrf token
* Two factor authentication

## Getting Started

### Development
Create a config.json and copy the following code, this is the config for sequelize
```
{
  "development": {
    "username": "postgres",
    "password": null,
    "database": "todoTenant",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "operatorsAliases": false
  }
}
```

Then run
```
npm install sequelize 
```

* yarn
* yarn run

### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

```
yarn test
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* React and Redux - Client framework and state management library
* Expressjs - The web framework used
* Sequelize - ORM
* PostgreSQL - Database

## Authors

* **Matteo Gioioso** 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details