import axios, { AxiosResponse } from 'axios';
import { AnimeListOptions, AnimeRankingOptions, DetailedAnimeOptions, ErrorResponse, OAuthRequest, SeasonalAnimeOptions, SuggestedAnimeOptions, TokenResponse, UserAnimeListOptions } from './options';
import { AnimeData, AnimeListEntry, DetailedAnimeData, RankedAnimeInstance } from './types';
import { ParsedUrlQuery, stringify } from 'querystring';

function handleResponse<D>(response: AxiosResponse, map: ((val) => D)): (D | ErrorResponse) {
	if(response.status == 200) {
		return map(response.data);
	}
	else {
		const out: ErrorResponse = {
			status: response.status,
			error: response.data.error,
			message: response.data.message,
		};
		return out;
	}
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
		return axios.post('https://myanimelist.net/v1/oauth2/token', params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}).then(response => handleResponse(response, data => {
			return data as TokenResponse;
		}));
	}

	public async refreshAuthorizationToken(refresh_token: string): Promise<TokenResponse | ErrorResponse> {
		const params: object = {
			'client_id': this.client_id,
			'client_secret': this.client_secret,
			'grant_type': 'refresh_token',
			'refresh_token': refresh_token,
		};
		return axios.post('https://myanimelist.net/v1/oauth2/token', params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}).then(response => handleResponse(response, data => {
			return data as TokenResponse;
		}));
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

	public async getAnimeList(options: AnimeListOptions, token?: string): Promise<Array<AnimeData> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return axios.get('https://api.myanimelist.net/v2/anime', {
			params: params,
			headers: this.createHeader(token),
		}).then(response => handleResponse(response, data => {
			const nodes: Array<AnimeData> = [];
			for(const val of data.data) {
				nodes.push(val.node as AnimeData);
			}
			return nodes;
		}));
	}

	public async getAnimeDetails(id: number, options?: DetailedAnimeOptions, token?: string): Promise<DetailedAnimeData | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return axios.get(`https://api.myanimelist.net/v2/anime/${id}`, {
			params: params,
			headers: this.createHeader(token),
		}).then(response => handleResponse(response, data => {
			return data as DetailedAnimeData;
		}));
	}

	public async getAnimeRanking(options: AnimeRankingOptions, token?: string): Promise<Array<RankedAnimeInstance> | ErrorResponse> {
		const params: object = Object.assign({}, options);
		if(options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return axios.get('https://api.myanimelist.net/v2/anime/ranking', {
			params: params,
			headers: this.createHeader(token),
		}).then(response => handleResponse(response, data => {
			return data.data as Array<RankedAnimeInstance>;
		}));
	}

	public async getSeasonalAnime(year: number, season: 'winter' | 'spring' | 'summer' | 'fall', options?: SeasonalAnimeOptions, token?: string): Promise<Array<AnimeData> | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return axios.get(`https://api.myanimelist.net/v2/anime/season/${year}/${season}`, {
			params: params,
			headers: this.createHeader(token),
		}).then(response => handleResponse(response, data => {
			const nodes: Array<AnimeData> = [];
			for(const val of data.data) {
				nodes.push(val.node as AnimeData);
			}
			return nodes;
		}));
	}

	public async getSuggestedAnime(token: string, options?: SuggestedAnimeOptions): Promise<Array<AnimeData> | ErrorResponse> {
		const params: object = options ? Object.assign({}, options) : {};
		if(options && options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return axios.get('https://api.myanimelist.net/v2/anime/suggestions', {
			params: params,
			headers: this.createHeader(token),
		}).then(response => handleResponse(response, data => {
			const nodes: Array<AnimeData> = [];
			for(const val of data.data) {
				nodes.push(val.node as AnimeData);
			}
			return nodes;
		}));
	}

	public async getUserAnimeList(username: string = '@me', options?: UserAnimeListOptions, token?: string): Promise<Array<AnimeListEntry> | ErrorResponse> {
		return axios.get(`https://api.myanimelist.net/v2/users/${username}/animelist`, {
			params: options,
			headers: this.createHeader(token),
		}).then(response => handleResponse(response, data => {
			return data.data as Array<AnimeListEntry>;
		}));
	}

}