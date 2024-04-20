import axios, { AxiosResponse } from 'axios';
import { AnimeListOptions, AnimeRankingOptions, DetailedAnimeOptions, DetailedMangaOptions, ErrorResponse, ForumDetailsOptions, ForumTopicOptions, MangaListOptions, MangaRankingOptions, OAuthRequest, SeasonalAnimeOptions, SuggestedAnimeOptions, TokenResponse, UserAnimeListOptions, UserInfoOptions, UserMangaListOptions } from './options';
import { Anime, AnimeListEntry, AnimeListStatus, DetailedAnime, DetailedForumTopic, DetailedManga, ForumBoards, ForumTopic, Holder, Manga, MangaListEntry, MangaListStatus, Paged, PagedResponse, RankedInstance, UserInfo } from './types';
import { ParsedUrlQuery, stringify } from 'querystring';

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

function parseFields(fields: object): string {
	const parts: Array<string> = [];
	for(const key in fields) {
		const value = fields[key];
		if(value) {
			if(typeof value === 'object') {
				const parsed: string = parseFields(value);
				parts.push(parsed ? `${key}{${parsed}}` : key);
			}
			else {
				parts.push(key);
			}
		}
	}
	return parts.join(',');
}

function codeVerifier(): string {
	const nums: Array<number> = [];
	for(let i: number = 0; i < 32; i++) {
		const rand: number = Math.floor(Math.random() * 256);
		nums.push(rand);
	}
	const ascii: string = String.fromCharCode(...nums);
	return Buffer.from(ascii).toString('base64url');
}

function codeChallenge(verifier: string): string {
	return verifier;
}

export default class MALClient {

	private client_id: string;
	private client_secret?: string;

	public constructor(client_id: string, client_secret?: string) {
		this.client_id = client_id;
		this.client_secret = client_secret;
	}

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

	public async getAnimeList(options: AnimeListOptions, token?: string): Promise<Paged<Anime> | ErrorResponse> {
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

	public async getAnimeDetails(id: number, options?: DetailedAnimeOptions, token?: string): Promise<DetailedAnime | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/anime/${id}`, {
			params: params,
			headers: this.createHeader(token),
		}), data => data as DetailedAnime);
	}

	public async getAnimeRanking(options: AnimeRankingOptions, token?: string): Promise<Paged<RankedInstance<Anime>> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/anime/ranking', {
			params: params,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<RankedInstance<Anime>>, token));
	}

	public async getSeasonalAnime(year: number, season: 'winter' | 'spring' | 'summer' | 'fall', options?: SeasonalAnimeOptions, token?: string): Promise<Paged<Anime> | ErrorResponse> {
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

	public async getSuggestedAnime(token: string, options?: SuggestedAnimeOptions): Promise<Paged<Anime> | ErrorResponse> {
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

	public async updateAnimeListStatus(token: string, anime_id: number, status: AnimeListStatus): Promise<AnimeListStatus | ErrorResponse> {
		return handlePromise(axios.put(`https://api.myanimelist.net/v2/anime/${anime_id}/my_list_status`, status, {
			headers: {
				...this.createHeader(token),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}), data => data as AnimeListStatus);
	}

	public async deleteAnimeListItem(token: string, anime_id: number): Promise<void | ErrorResponse> {
		return handlePromise(axios.delete(`https://api.myanimelist.net/v2/anime/${anime_id}/my_list_status`, {
			headers: this.createHeader(token),
		}), () => undefined);
	}

	public async getUserAnimeList(username: string = '@me', options?: UserAnimeListOptions, token?: string): Promise<Paged<AnimeListEntry> | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/users/${username}/animelist`, {
			params: params,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<AnimeListEntry>, token));
	}

	public async getForumBoards(token?: string): Promise<Array<ForumBoards> | ErrorResponse> {
		return handlePromise(axios.get('https://api.myanimelist.net/v2/forum/boards', {
			headers: this.createHeader(token),
		}), data => data.categories as Array<ForumBoards>);
	}

	public async getForumTopicDetails(topic_id: number, options?: ForumDetailsOptions, token?: string): Promise<Paged<DetailedForumTopic> | ErrorResponse> {
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/forum/topic/${topic_id}`, {
			params: options,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<DetailedForumTopic>, token));
	}

	public async getForumTopics(options: ForumTopicOptions, token?: string): Promise<Paged<ForumTopic> | ErrorResponse> {
		return handlePromise(axios.get('https://api.myanimelist.net/v2/forum/topics', {
			params: options,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<ForumTopic>, token));
	}

	public async getMangaList(options: MangaListOptions, token?:string): Promise<Paged<Manga> | ErrorResponse> {
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

	public async getMangaDetails(id: number, options?: DetailedMangaOptions, token?: string): Promise<DetailedManga | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/manga/${id}`, {
			params: params,
			headers: this.createHeader(token),
		}), data => data as DetailedManga);
	}

	public async getMangaRanking(options: MangaRankingOptions, token?: string): Promise<Paged<RankedInstance<Manga>> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/manga/ranking', {
			params: params,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<RankedInstance<Manga>>, token));
	}

	public async updateMangaListStatus(token: string, manga_id: number, status: MangaListStatus): Promise<MangaListStatus | ErrorResponse> {
		return handlePromise(axios.put(`https://api.myanimelist.net/v2/manga/${manga_id}/my_list_status`, status, {
			headers: {
				...this.createHeader(token),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}), data => data as MangaListStatus);
	}

	public async deleteMangaListItem(token: string, manga_id: number): Promise<void | ErrorResponse> {
		return handlePromise(axios.delete(`https://api.myanimelist.net/v2/manga/${manga_id}/my_list_status`, {
			headers: this.createHeader(token),
		}), () => undefined);
	}

	public async getUserMangaList(username: string = '@me', options?: UserMangaListOptions, token?: string): Promise<Paged<MangaListEntry> | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields) {
			params['fields'] = parseFields(options.fields);
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/users/${username}/mangalist`, {
			params: params,
			headers: this.createHeader(token),
		}), data => this.createPaged(data, val => val as Array<MangaListEntry>, token));
	}

	public async getUserInfo(token: string, options?: UserInfoOptions): Promise<UserInfo | ErrorResponse> {
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