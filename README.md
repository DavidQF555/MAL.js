# MAL.js
A strongly-typed TypeScript wrapper for the official [MyAnimeList](https://myanimelist.net/) API. 

## Installation
```
npm install @davidqf555/mal.js
```

## Usage

A client ID can be registered [here](https://myanimelist.net/apiconfig). 

The documentation for the API can be found [here](https://myanimelist.net/apiconfig/references/api/v2). 

### Example
```js
import MALClient, { FieldsParser } from '@davidqf555/mal.js';

// Create client to access MyAnimeList API
const client = new MALCLient(client_id, client_secret);

// Generate URL for client to authenticate with randomly generated verifer
const { url, code_verifier } = client.requestAuthorization();

// Retrieve token after client authenticates and receives code
const { access_token } = await client.retrieveAuthorizationToken(code, code_verifier);

// Get anime list from a query
const { data } = await client.getAnimeList({ q: 'Sword Art Online', fields: new FieldsParser({ mean: true, rank: true }) });

// Get user anime list of access token owner
const { data } = await client.getUserAnimeList('@me', { status: 'watching' }, access_token);
```

### Client Methods

There is support for user authentication and every documented endpoint. 

#### User Authentication

The supported user authentication methods follow the OAuth 2.0 procedure outlined in the [MyAnimeList API documentation](https://myanimelist.net/apiconfig/references/authorization).

| Name | Description |
| - | - |
| `requestAuthorization` | Uses/Generates a code verifier to create a link for the user to authenticate |
| `retrieveAuthorizationToken` | Uses the code from the user redirect after authentication to generate both a refresh and access token |
| `refreshAuthorizationToken` | Uses a refresh token to refresh both the access and refresh tokens |

#### Endpoint Methods

Each method corresponds to a documented endpoint in the [MyAnimeList API](https://myanimelist.net/apiconfig/references/api/v2).

| Name | Endpoint |
| - | - |
| `getAnimeList` | `GET` [`/anime`](https://myanimelist.net/apiconfig/references/api/v2#operation/anime_get) |
| `getAnimeDetails` | `GET` [`/anime/{anime_id}`](https://myanimelist.net/apiconfig/references/api/v2#operation/anime_anime_id_get) |
| `getAnimeRanking` | `GET` [`/anime/ranking`](https://myanimelist.net/apiconfig/references/api/v2#operation/anime_ranking_get) |
| `getSeasonalAnime` | `GET` [`/anime/season/{year}/{season}`](https://myanimelist.net/apiconfig/references/api/v2#operation/anime_season_year_season_get) |
| `getSuggestedAnime` | `GET` [`/anime/suggestions`](https://myanimelist.net/apiconfig/references/api/v2#operation/anime_suggestions_get) |
| `updateAnimeListStatus` | `PATCH` [`/anime/{anime_id}/my_list_status`](https://myanimelist.net/apiconfig/references/api/v2#operation/anime_anime_id_my_list_status_put) |
| `deleteAnimeListItem` | `DELETE` [`/anime/{anime_id}/my_list_status`](https://myanimelist.net/apiconfig/references/api/v2#operation/anime_anime_id_my_list_status_delete) |
| `getUserAnimeList` | `GET` [`/users/{user_name}/animelist`](https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_animelist_get) |
| `getForumBoards` | `GET` [`/forum/boards`](https://myanimelist.net/apiconfig/references/api/v2#operation/forum_boards_get) |
| `getForumTopicDetails` | `GET` [`/forum/topic/{topic_id}`](https://myanimelist.net/apiconfig/references/api/v2#operation/forum_topic_get) |
| `getForumTopics` | `GET` [`/forum/topics`](https://myanimelist.net/apiconfig/references/api/v2#operation/forum_topics_get) |
| `getMangaList` | `GET` [`/manga`](https://myanimelist.net/apiconfig/references/api/v2#operation/manga_get) |
| `getMangaDetails` | `GET` [`/manga/{manga_id}`](https://myanimelist.net/apiconfig/references/api/v2#operation/manga_manga_id_get) |
| `getMangaRanking` | `GET` [`/manga/ranking`](https://myanimelist.net/apiconfig/references/api/v2#operation/manga_ranking_get) |
| `updateMangaListStatus` | `PATCH` [`/manga/{manga_id}/my_list_status`](https://myanimelist.net/apiconfig/references/api/v2#operation/manga_manga_id_my_list_status_put) |
| `deleteMangaListItem` | `DELETE` [`/manga/{manga_id}/my_list_status`](https://myanimelist.net/apiconfig/references/api/v2#operation/manga_manga_id_my_list_status_delete) |
| `getUserMangaList` | `GET` [`/users/{user_name}/mangalist`](https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_mangalist_get) |
| `getUserInfo` | `GET` [`/users/{user_name}`](https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_get) |