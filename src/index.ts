import axios, { AxiosResponse } from 'axios';
import { ErrorResponse, OAuthRequest, TokenResponse, Anime, AnimeListEntry, AnimeListStatus, DetailedAnime, DetailedForumTopic, DetailedManga, ForumBoards, ForumTopic, Holder, Manga, MangaListEntry, MangaListStatus, Paged, PagedResponse, RankedInstance, UserInfo } from './types';
import parseFields, { AnimeFields, DetailedAnimeFields, UserAnimeListFields, MangaFields, DetailedMangaFields, UserMangaListFields, UserInfoFields } from './fields';
import { ParsedUrlQuery, stringify } from 'querystring';

/**
 * Parses a promise of an Axios response to a promise of an error or the mapped data
 *
 * @param call - a promise of an Axios response
 * @param map - a mapping of the data if there are no errors
 *
 * @returns a promise of an error or the mapped data
 */
function handlePromise<D>(call: Promise<AxiosResponse>, map: ((val) => D)): Promise<D | ErrorResponse> {
	return call
		.then(response => {
			return map(response.data);
		}, error => {
			if(error.response) {
				return {
					status: error.response.status,
					error: error.response.data.error,
					message: error.response.data.message,
				};
			}
			else {
				return {
					status: 500,
					error: 'unknown',
					message: 'error with no response',
				};
			}
		});
}

/**
 * Generates a pseudo-random code verifier according to the PKCE protocol
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7636#section-4.1 for procedure details
 *
 * @returns Base64URL string as a code verifier
 */
function codeVerifier(): string {
	const nums: Array<number> = [];
	for(let i: number = 0; i < 32; i++) {
		const rand: number = Math.floor(Math.random() * 256);
		nums.push(rand);
	}
	const ascii: string = String.fromCharCode(...nums);
	return Buffer.from(ascii).toString('base64url');
}

/**
 * Generates a code challenge from a code verifier
 * Only the 'plain' method is currently supported by the MyAnimeList API, so this is just an identity function
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7636#section-4.2 for procedure details
 *
 * @param verifier - a Base64URL string as a code verifier
 *
 * @returns the code challenge corresponding to the given verifier
 */
function codeChallenge(verifier: string): string {
	return verifier;
}

/**
 * Client wrapper for the official MyAnimeList API
 *
 * @see https://myanimelist.net/apiconfig/references/api/v2 for the official API documentation
 */
export default class MALClient {

	private client_id: string;
	/**
	 * Only used for user authorization, not needed otherwise
	 */
	private client_secret?: string;

	/**
	 * Creates a {@link MALClient} from a client ID and optionally a client secret
	 *
	 * A client ID and secret can be obtained by registering a client at {@link https://myanimelist.net/apiconfig}
	 *
	 * @param client_id - a client ID
	 * @param client_secret - a client secret, this can be omitted if user authorization (i.e., {@link requestAuthorization}, {@link retrieveAuthorizationToken}, or {@link refreshAuthorizationToken}) not used
	 */
	public constructor(client_id: string, client_secret?: string) {
		this.client_id = client_id;
		this.client_secret = client_secret;
	}

	/**
	 * Generates a URL for user authentication according to the OAuth 2.0 authentication procedure
	 *
	 * @see https://myanimelist.net/apiconfig/references/authorization for procedure details
	 * @see https://myanimelist.net/apiconfig/references/authorization#step-2-client-requests-oauth-20-authentication for parameter details
	 * @see retrieveAuthorizationToken for next steps in user authentication process
	 *
	 * @param verifier - code verifier, generated pseudo-randomly using {@link codeVerifier} if not given
	 * @param redirect_uri - URI to redirect to after user authentication. Optional if only one redirect URI registered, otherwise must exactly match a registered redirect URI.
	 * @param state - optional string to verify and prevent cross-site forgery. See {@link https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1} for details
	 *
	 * @returns a code verifer with its corresponding user authentication URL
	 */
	public requestAuthorization(verifier: string = codeVerifier(), redirect_uri?: string, state?: string): OAuthRequest {
		const params: ParsedUrlQuery = {
			'response_type': 'code',
			'client_id': this.client_id,
			'code_challenge': codeChallenge(verifier),
			'code_challenge_method': 'plain',
		};
		if(redirect_uri) {
			params['redirect_uri'] = redirect_uri;
		}
		if(state) {
			params['state'] = state;
		}
		const url: string = `https://myanimelist.net/v1/oauth2/authorize?${stringify(params)}`;
		return {
			'url': url,
			'code_verifier': verifier,
		};
	}

	/**
	 * Exchanges authentication code for refresh and access tokens
	 *
	 * An authentication code and code verifier can be obtained by generating a code verifier and authentication URL using {@link requestAuthorization}, a user authenticating, and then retrieving the authentication code from the redirected user
	 * Note: it is recommended to verify that the callback state matches the passed in state (i.e. from {@link requestAuthorization}) before retrieving the tokens
	 *
	 * @see https://myanimelist.net/apiconfig/references/authorization#step-6-exchange-authorization-code-for-refresh-and-access-tokens for procedure details
	 * @see refreshAuthorizationToken for refreshing access tokens
	 *
	 * @param auth_code - an authentication code
	 * @param verifier - a code verifier
	 * @param redirect_uri - the redirect URI that was a parameter when the user initially authenticated (i.e. from {@link requestAuthorization}). Can be omitted if no redirect URI was passed
	 *
	 * @returns a promise of an error or both the refresh and access tokens
	 */
	public async retrieveAuthorizationToken(auth_code: string, verifier: string, redirect_uri?: string): Promise<TokenResponse | ErrorResponse> {
		const params: object = {
			'client_id': this.client_id,
			'grant_type': 'authorization_code',
			'code': auth_code,
			'code_verifier': verifier,
			'client_secret': this.client_secret,
			'redirect_uri': redirect_uri,
		};
		return handlePromise(axios.post('https://myanimelist.net/v1/oauth2/token', params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}), data => data as TokenResponse);
	}

	/**
	 * Refreshes an access token with a refresh token
	 *
	 * Note: it is recommended to replace both the refresh and access tokens after refreshing
	 *
	 * @see https://myanimelist.net/apiconfig/references/authorization#refreshing-an-access-token for procedure details
	 * @see retrieveAuthorizationToken for initially retrieving refresh and access tokens
	 *
	 * @param refresh_token - a refresh token
	 *
	 * @returns a promise of an error or both new refresh and access tokens
	 */
	public async refreshAuthorizationToken(refresh_token: string): Promise<TokenResponse | ErrorResponse> {
		const params: object = {
			'client_id': this.client_id,
			'client_secret': this.client_secret,
			'grant_type': 'refresh_token',
			'refresh_token': refresh_token,
		};
		return handlePromise(axios.post('https://myanimelist.net/v1/oauth2/token', params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}), data => data as TokenResponse);
	}

	/**
	 * Creates basic header for authorization
	 *
	 * @see https://myanimelist.net/apiconfig/references/api/v2#section/Authentication
	 *
	 * @param token - token to use for authorization, otherwise just uses the client ID
	 *
	 * @returns a header object
	 */
	private createHeader(token?: string): object {
		if(token) {
			return {
				'Authorization': `Bearer ${token}`,
			};
		}
		return {
			'X-MAL-CLIENT-ID': this.client_id,
		};
	}

	private createPaged<T, S>(data: PagedResponse<T>, map: (val: Array<T>) => Array<S>, token?: string): Paged<S> {
		const paged: object = { data: map(data.data) };
		if(data.paging.previous) {
			paged['previous'] = () => handlePromise(axios.get(data.paging.previous, {
				headers: this.createHeader(token),
			}), val => this.createPaged(val, map, token));
		}
		if(data.paging.next) {
			paged['next'] = () => handlePromise(axios.get(data.paging.next, {
				headers: this.createHeader(token),
			}), val => this.createPaged(val, map, token));
		}
		return paged as Paged<S>;
	}

	/**
	 * Gets an anime list from a query
	 *
	 * @see getAnimeDetails to get more details from an anime entry ID
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/anime_get for endpoint documentation
	 *
	 * @param options - query parameters of access
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or a paged list of anime objects
	 */
	public async getAnimeList(options: {
		/** query to search for */
		q: string;
		/** max number of anime entries to return, max and default of 100 */
		limit?: number;
		/** offset of anime entries to return, default of 0 */
		offset?: number;
		/** whether NSFW anime entries are shown, defaults to false (see {@link https://myanimelist.net/apiconfig/references/api/v2#section/Common-parameters}) */
		nsfw?: boolean;
		/** the fields that are present for each anime entry (see {@link parseFields}) */
		fields?: AnimeFields;
	}, token?: string): Promise<Paged<Anime> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/anime', {
			params: params,
			headers: this.createHeader(token),
		}), data => {
			const map = (response: Array<Holder<Anime>>) => {
				const nodes: Array<Anime> = [];
				for(const val of response) {
					nodes.push(val.node as Anime);
				}
				return nodes;
			};
			return this.createPaged(data, map, token);
		});
	}

	/**
	 * Gets the details of an anime from its ID
	 *
	 * @see getAnimeList to search for anime entries and obtain their IDs
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/anime_anime_id_get for endpoint documentation
	 *
	 * @param id - ID of anime to locate
	 * @param options - query parameter of access, can be omitted
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or a detailed anime entry
	 */
	public async getAnimeDetails(id: number, options?: {
		/** The fields that are present in the detailed anime entry (see {@link parseFields}) */
		fields?: DetailedAnimeFields;
	}, token?: string): Promise<DetailedAnime | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/anime/${id}`, {
			params: params,
			headers: this.createHeader(token),
		}), data => data as DetailedAnime);
	}

	/**
	 * Gets a list of anime entries from a ranking
	 *
	 * @see getAnimeDetails to get more details from an anime entry ID
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/anime_ranking_get for endpoint documentation
	 *
	 * @param options - query parameters of access
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or a paged list of ranked anime objects
	 */
	public async getAnimeRanking(options: {
		/** type of ranking */
		ranking_type: 'all' | 'airing' | 'upcoming' | 'tv' | 'ova' | 'movie' | 'special' | 'bypopularity' | 'favorite';
		/** max number of anime entries to return, max and default of 100 */
		limit?: number;
		/** offset of anime entries to return, default of 0 */
		offset?: number;
		/** the fields that are present for each anime entry (see {@link parseFields}) */
		fields?: AnimeFields;
	}, token?: string): Promise<Paged<RankedInstance<Anime>> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/anime/ranking', {
			params: params,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<RankedInstance<Anime>>, token));
	}

	/**
	 * Gets a list of anime from a season
	 *
	 * @see getAnimeDetails to get more details from an anime entry ID
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/anime_season_year_season_get for endpoint documentation
	 *
	 * @param year - year to search
	 * @param season - season to search
	 * @param options - query parameters of access, can be omitted, not sure if there is a 'nsfw' field
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or a paged list of anime objects
	 */
	public async getSeasonalAnime(year: number, season: 'winter' | 'spring' | 'summer' | 'fall', options?: {
		/** how the paged list is sorted descending */
		sort?: 'anime_score' | 'anime_num_list_users';
		/** max number of anime entries to return, max and default of 100 */
		limit?: number;
		/** offset of anime entries to return, default of 0 */
		offset?: number;
		/** the fields that are present for each anime entry (see {@link parseFields}) */
		fields?: AnimeFields;
	}, token?: string): Promise<Paged<Anime> | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/anime/season/${year}/${season}`, {
			params: params,
			headers: this.createHeader(token),
		}), data => {
			const map = (response: Array<Holder<Anime>>) => {
				const nodes: Array<Anime> = [];
				for(const val of response) {
					nodes.push(val.node as Anime);
				}
				return nodes;
			};
			return this.createPaged(data, map, token);
		});
	}

	/**
	 * Gets the suggested anime of an authenticated user
	 *
	 * @see getAnimeDetails to get more details from an anime entry ID
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/anime_suggestions_get for endpoint documentation
	 *
	 * @param token - token of the authenticated user
	 * @param options - query parameters of access, can be omitted, not sure if there is a 'nsfw' field
	 *
	 * @returns a promise of an error or paged list of anime objects
	 */
	public async getSuggestedAnime(token: string, options?: {
		/** max number of anime entries to return, max and default of 100 */
		limit?: number;
		/** offset of anime entries to return, default of 0 */
		offset?: number;
		/** the fields that are present for each anime entry (see {@link parseFields}) */
		fields?: AnimeFields;
	}): Promise<Paged<Anime> | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/anime/suggestions', {
			params: params,
			headers: this.createHeader(token),
		}), data => {
			const map = (response: Array<Holder<Anime>>) => {
				const nodes: Array<Anime> = [];
				for(const val of response) {
					nodes.push(val.node as Anime);
				}
				return nodes;
			};
			return this.createPaged(data, map, token);
		});
	}

	/**
	 * Adds a status to an anime entry in authenticated user's anime list. Updates status if already present in list
	 *
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/anime_anime_id_my_list_status_put for endpoint documentation
	 *
	 * @param token - token of the authenticated user
	 * @param anime_id - ID of anime entry to update
	 * @param status - status to update to (see {@link AnimeListStatus}), only updates specified fields
	 *
	 * @returns a promise of an error or new status after updating
	 */
	public async updateAnimeListStatus(token: string, anime_id: number, status: AnimeListStatus): Promise<AnimeListStatus | ErrorResponse> {
		return handlePromise(axios.put(`https://api.myanimelist.net/v2/anime/${anime_id}/my_list_status`, status, {
			headers: {
				...this.createHeader(token),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}), data => data as AnimeListStatus);
	}

	/**
	 * Deletes an anime entry from an authenticated user's anime list
	 *
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/anime_anime_id_my_list_status_delete for endpoint documentation
	 *
	 * @param token - token of the authenticated user
	 * @param anime_id - ID of anime entry to delete
	 *
	 * @returns a promise of an error or void if successfully deleted
	 */
	public async deleteAnimeListItem(token: string, anime_id: number): Promise<void | ErrorResponse> {
		return handlePromise(axios.delete(`https://api.myanimelist.net/v2/anime/${anime_id}/my_list_status`, {
			headers: this.createHeader(token),
		}), () => undefined);
	}

	/**
	 * Gets a user's anime list
	 *
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_animelist_get for endpoint documentation
	 *
	 * @param username - username of user, defaults to '@me' for the user corresponding to the token
	 * @param options - query parameters of access
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or paged list of user anime list entries
	 */
	public async getUserAnimeList(username: string = '@me', options?: {
		/** anime list entry status filter */
		status?: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
		/** how the paged list is sorted */
		sort?: 'list_score' | 'list_updated_at' | 'anime_title' | 'anime_start_date' | 'anime_id';
		/** max number of anime list entries to return, max and default of 100 */
		limit?: number;
		/** offset of anime list entries to return, default of 0 */
		offset?: number;
		/** whether NSFW anime list entries are shown, defaults to false (see {@link https://myanimelist.net/apiconfig/references/api/v2#section/Common-parameters}) */
		nsfw?: boolean;
		/** the fields that are present for each anime list entry (see {@link parseFields}) */
		fields?: UserAnimeListFields;
	}, token?: string): Promise<Paged<AnimeListEntry> | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/users/${username}/animelist`, {
			params: params,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<AnimeListEntry>, token));
	}

	/**
	 * Gets the forum boards
	 *
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/forum_boards_get for endpoint documentation
	 *
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or an array of forum board objects
	 */
	public async getForumBoards(token?: string): Promise<Array<ForumBoards> | ErrorResponse> {
		return handlePromise(axios.get('https://api.myanimelist.net/v2/forum/boards', {
			headers: this.createHeader(token),
		}), data => data.categories as Array<ForumBoards>);
	}

	/**
	 * Gets the details of a forum topic from its ID
	 *
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/forum_topic_get for endpoint documentation
	 *
	 * @param topic_id - ID of forum topic to locate
	 * @param options - query parameters of access
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or paged list of detailed forum topic objects
	 */
	public async getForumTopicDetails(topic_id: number, options?: {
		/** max number of forum topics to return, max and default of 100 */
		limit?: number;
		/** offset of forum topics to return, default of 0 */
		offset?: number;
	}, token?: string): Promise<Paged<DetailedForumTopic> | ErrorResponse> {
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/forum/topic/${topic_id}`, {
			params: options,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<DetailedForumTopic>, token));
	}

	/**
	 * Gets a list of forum topics
	 *
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/forum_topics_get for endpoint documentation
	 *
	 * @param options - query parameters of access
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or paged list of forum topic objects
	 */
	public async getForumTopics(options: {
		/** ID of the board to search */
		board_id?: number;
		/** ID of the subboard to search */
		subboard_id?: number;
		/** max number of forum topics to return, max and default of 100 */
		limit?: number;
		/** offset of forum topics to return, default of 0 */
		offset?: number;
		/** how to sort the topics, only 'recent' supported */
		sort?: 'recent';
		/** query to search for */
		q?: string;
		/** TODO: Fill later */
		topic_user_name?: string;
		user_name?: string;
	}, token?: string): Promise<Paged<ForumTopic> | ErrorResponse> {
		return handlePromise(axios.get('https://api.myanimelist.net/v2/forum/topics', {
			params: options,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<ForumTopic>, token));
	}

	/**
	 * Gets a manga list from a query
	 *
	 * @see getMangaDetails to get more details from a manga entry ID
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/manga_get for endpoint documentation
	 *
	 * @param options - query parameters for access
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or paged list of manga objects
	 */
	public async getMangaList(options: {
		/** query to search for */
		q: string;
		/** max number of manga entries to return, max and default of 100 */
		limit?: number;
		/** offset of manga entries to return, default of 0 */
		offset?: number;
		/** whether NSFW manga entries are shown, defaults to false (see {@link https://myanimelist.net/apiconfig/references/api/v2#section/Common-parameters}) */
		nsfw?: boolean;
		/** the fields that are present for each manga entry (see {@link parseFields}) */
		fields?: MangaFields;
	}, token?:string): Promise<Paged<Manga> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/manga', {
			params: params,
			headers: this.createHeader(token),
		}), data => {
			const map = (response: Array<Holder<Manga>>) => {
				const nodes: Array<Manga> = [];
				for(const val of response) {
					nodes.push(val.node as Manga);
				}
				return nodes;
			};
			return this.createPaged(data, map, token);
		});
	}

	/**
	 * Gets the details of a manga from its ID
	 *
	 * @see getMangaList to search for manga entries and obtain their IDs
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/manga_manga_id_get for endpoint documentation
	 *
	 * @param id - ID of manga to locate
	 * @param options - query parameters of access, can be omitted
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or detailed manga entry
	 */
	public async getMangaDetails(id: number, options?: {
		/** The fields that are present in the detailed manga entry (see {@link parseFields}) */
		fields?: DetailedMangaFields;
	}, token?: string): Promise<DetailedManga | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/manga/${id}`, {
			params: params,
			headers: this.createHeader(token),
		}), data => data as DetailedManga);
	}

	/**
	 * Gets a list of manga entries from a ranking
	 *
	 * @see getMangaDetails to get more details from a manga entry ID
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/manga_ranking_get for endpoint documentation
	 *
	 * @param options - query parameters of access
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or paged list of ranked manga objects
	 */
	public async getMangaRanking(options: {
		/** type of ranking */
		ranking_type: 'all' | 'manga' | 'novels' | 'oneshots' | 'doujin' | 'manhwa' | 'manhua' | 'bypopularity' | 'favorite';
		/** max number of manga entries to return, max and default of 100 */
		limit?: number;
		/** offset of manga entries to return, default of 0 */
		offset?: number;
		/** the fields that are present for each manga entry (see {@link parseFields}) */
		fields?: MangaFields;
	}, token?: string): Promise<Paged<RankedInstance<Manga>> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/manga/ranking', {
			params: params,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<RankedInstance<Manga>>, token));
	}

	/**
	 * Adds a status to a manga entry in authenticated user's manga list. Updates status if already present in list
	 *
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/manga_manga_id_my_list_status_put for endpoint documentation
	 *
	 * @param token - token of the authenticated user
	 * @param manga_id - ID of manga entry to update
	 * @param status - status to update to (see {@link MangaListStatus}), only updates specified fields
	 *
	 * @returns a promise of an error or new status after updating
	 */
	public async updateMangaListStatus(token: string, manga_id: number, status: MangaListStatus): Promise<MangaListStatus | ErrorResponse> {
		return handlePromise(axios.put(`https://api.myanimelist.net/v2/manga/${manga_id}/my_list_status`, status, {
			headers: {
				...this.createHeader(token),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}), data => data as MangaListStatus);
	}

	/**
	 * Deletes a manga entry from an authenticated user's manga list
	 *
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/manga_manga_id_my_list_status_delete for endpoint documentation
	 *
	 * @param token - token of the authenticated user
	 * @param manga_id - ID of manga entry to delete
	 *
	 * @returns a promise of an error or void if successfully deleted
	 */
	public async deleteMangaListItem(token: string, manga_id: number): Promise<void | ErrorResponse> {
		return handlePromise(axios.delete(`https://api.myanimelist.net/v2/manga/${manga_id}/my_list_status`, {
			headers: this.createHeader(token),
		}), () => undefined);
	}

	/**
	 * Gets a user's manga list
	 *
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_mangalist_get for endpoint documentation
	 *
	 * @param username - username of user, defaults to '@me' for the user corresponding to the token
	 * @param options - query parameters of access
	 * @param token - token if want access from authenticated user's perspective
	 *
	 * @returns a promise of an error or paged list of user manga list entries
	 */
	public async getUserMangaList(username: string = '@me', options?: {
		/** manga list entry status filter */
		status?: 'reading' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read';
		/** how the paged list is sorted */
		sort?: 'list_score' | 'list_updated_at' | 'manga_title' | 'manga_start_date' | 'manga_id';
		/** max number of manga list entries to return, max and default of 100 */
		limit?: number;
		/** offset of manga list entries to return, default of 0 */
		offset?: number;
		/** whether NSFW manga list entries are shown, defaults to false (see {@link https://myanimelist.net/apiconfig/references/api/v2#section/Common-parameters}) */
		nsfw?: boolean;
		/** the fields that are present for each manga list entry (see {@link parseFields}) */
		fields?: UserMangaListFields;
	}, token?: string): Promise<Paged<MangaListEntry> | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/users/${username}/mangalist`, {
			params: params,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<MangaListEntry>, token));
	}

	/**
	 * Gets an authenticated user's information
	 * Only accessing the user corresponding to the token is currently implemented in the endpoint
	 *
	 * @see https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_get for endpoint documentation
	 *
	 * @param token - token of the authenticated user
	 * @param options - query parameters of access, can be omitted
	 *
	 * @returns a promise of an error or a user info object
	 */
	public async getUserInfo(token: string, options?: {
		/** the fields that are present in the user info (see {@link parseFields}) */
		fields?: UserInfoFields;
	}): Promise<UserInfo | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/users/@me', {
			params: options,
			headers: this.createHeader(token),
		}), data => data as UserInfo);
	}

}