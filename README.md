# MAL.js
A strong-typed TypeScript wrapper for the official [MyAnimeList](https://myanimelist.net/) API. The documentation for the API can be found [here](https://myanimelist.net/apiconfig/references/api/v2). There is support for every documented endpoint and [authenticating](https://myanimelist.net/apiconfig/references/authorization) users. 

## Installation
```
npm install @davidqf555/mal.js
```

## Usage

#### Example
```js
import MALClient from '@davidqf555/mal.js';

// Create client to access MyAnimeList API
const client = MALCLient(client_id, client_secret);

// Generate URL for client to authenticate with randomly generated verifer
const { url, code_verifier } = client.requestAuthorization();

// Retrieve token after client authenticates and receives code
const { access_token } = await client.retrieveAuthorizationToken(code, verifier);

// Get anime list from a query
const { data } = await client.getAnimeList({ q: 'Sword Art Online' });

// Get user anime list of access token owner
const { data } = await client.getUserAnimeList('@me', { status: 'watching' }, access_token);
```