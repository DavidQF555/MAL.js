import axios, { AxiosResponse } from 'axios';
import { AnimeListOptions, AnimeRankingOptions, DetailedAnimeOptions, DetailedMangaOptions, ErrorResponse, ForumDetailsOptions, ForumTopicOptions, MangaListOptions, MangaRankingOptions, OAuthRequest, SeasonalAnimeOptions, SuggestedAnimeOptions, TokenResponse, UserAnimeListOptions } from './options';
import { AnimeData, AnimeListEntry, DetailedAnimeData, DetailedForumTopic, DetailedMangaData, FieldedAnimeData, ForumBoards, ForumTopic, ListStatus, MangaData, RankedInstance } from './types';
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

	public requestAuth(redirect_uri?: string, state?: string): OAuthRequest {
		const verifier: string = codeVerifier();
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

	public async getAnimeList(options: AnimeListOptions, token?: string): Promise<Array<FieldedAnimeData> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/anime', {
			params: params,
			headers: this.createHeader(token),
		}), data => {
			const nodes: Array<AnimeData> = [];
			for(const val of data.data) {
				nodes.push(val.node as AnimeData);
			}
			return nodes;
		});
	}

	public async getAnimeDetails(id: number, options?: DetailedAnimeOptions, token?: string): Promise<DetailedAnimeData | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/anime/${id}`, {
			params: params,
			headers: this.createHeader(token),
		}), data => data as DetailedAnimeData);
	}

	public async getAnimeRanking(options: AnimeRankingOptions, token?: string): Promise<Array<RankedInstance<FieldedAnimeData>> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/anime/ranking', {
			params: params,
			headers: this.createHeader(token),
		}), data => data.data as Array<RankedInstance<FieldedAnimeData>>);
	}

	public async getSeasonalAnime(year: number, season: 'winter' | 'spring' | 'summer' | 'fall', options?: SeasonalAnimeOptions, token?: string): Promise<Array<AnimeData> | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/anime/season/${year}/${season}`, {
			params: params,
			headers: this.createHeader(token),
		}), data => {
			const nodes: Array<AnimeData> = [];
			for(const val of data.data) {
				nodes.push(val.node as AnimeData);
			}
			return nodes;
		});
	}

	public async getSuggestedAnime(token: string, options?: SuggestedAnimeOptions): Promise<Array<FieldedAnimeData> | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/anime/suggestions', {
			params: params,
			headers: this.createHeader(token),
		}), data => {
			const nodes: Array<AnimeData> = [];
			for(const val of data.data) {
				nodes.push(val.node as AnimeData);
			}
			return nodes;
		});
	}

	public async updateAnimeListStatus(token: string, anime_id: number, status: ListStatus): Promise<ListStatus | ErrorResponse> {
		return handlePromise(axios.put(`https://api.myanimelist.net/v2/anime/${anime_id}/my_list_status`, status, {
			headers: {
				...this.createHeader(token),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}), data => data as ListStatus);
	}

	public async deleteAnimeListItem(token: string, anime_id: number): Promise<void | ErrorResponse> {
		return handlePromise(axios.delete(`https://api.myanimelist.net/v2/anime/${anime_id}/my_list_status`, {
			headers: this.createHeader(token),
		}), () => undefined);
	}

	public async getUserAnimeList(username: string = '@me', options?: UserAnimeListOptions, token?: string): Promise<Array<AnimeListEntry> | ErrorResponse> {
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/users/${username}/animelist`, {
			params: options,
			headers: this.createHeader(token),
		}), data => data.data as Array<AnimeListEntry>);
	}

	public async getForumBoard(token?: string): Promise<ForumBoards | ErrorResponse> {
		return handlePromise(axios.get('https://api.myanimelist.net/v2/forum/boards', {
			headers: this.createHeader(token),
		}), data => data as ForumBoards);
	}

	public async getForumTopicDetails(topic_id: number, options?: ForumDetailsOptions, token?: string): Promise<Array<DetailedForumTopic> | ErrorResponse> {
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/forum/topic/${topic_id}`, {
			params: options,
			headers: this.createHeader(token),
		}), data => data.data as Array<DetailedForumTopic>);
	}

	public async getForumTopics(options: ForumTopicOptions, token?: string): Promise<Array<ForumTopic> | ErrorResponse> {
		return handlePromise(axios.get('https://api.myanimelist.net/v2/forum/topics', {
			params: options,
			headers: this.createHeader(token),
		}), data => data.data as Array<ForumTopic>);
	}

	public async getMangaList(options: MangaListOptions, token?:string): Promise<Array<MangaData> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options && options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/manga', {
			params: params,
			headers: this.createHeader(token),
		}), data => {
			const nodes: Array<MangaData> = [];
			for(const val of data.data) {
				nodes.push(val.node as MangaData);
			}
			return nodes;
		});
	}

	public async getMangaDetails(id: number, options?: DetailedMangaOptions, token?: string): Promise<DetailedMangaData | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return handlePromise(axios.get(`https://api.myanimelist.net/v2/manga/${id}`, {
			params: params,
			headers: this.createHeader(token),
		}), data => data as DetailedMangaData);
	}

	public async getMangaRanking(options: MangaRankingOptions, token?: string): Promise<Array<RankedInstance<MangaData>> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options && options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return handlePromise(axios.get('https://api.myanimelist.net/v2/manga/ranking', {
			params: params,
			headers: this.createHeader(token),
		}), data => data.data as Array<RankedInstance<MangaData>>);

	}

}