# sauto-api-nodejs

Node.js (Typescript) promise based wrapper over Sauto XML-RPC API. All methods are implemented with the same name as the original XML-RPC API provides.

## How to install

```
npm install sauto-api-nodejs
```

## Setup

```
import SautoApi from 'sauto-api-nodejs';

const login = 'import',
    password = 'test',
    config = {
        host: "import.sauto.cz",
        port: 80,
        path: "/RPC2"
    },
    swKey = 'testkey-571769';

const sautoApi = new SautoApi(config, login, password, swKey);
```

## Usage

```
sautoApi
  .login()
  .then(() => {
    return sautoApi.listOfCars();
  })
  .then(() => {
    return sautoApi.logout();
  });
```
