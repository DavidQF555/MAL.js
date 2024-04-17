import axios, { AxiosResponse } from 'axios';
import { AnimeField, DetailedAnimeField, ErrorResponse } from './options';
import { AnimeData, AnimeListEntry, DetailedAnimeData, RankedAnimeInstance } from './types';

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

export default class MALClient {

	private client_id: string;

	public constructor(client_id: string) {
		this.client_id = client_id;
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

	public getAnimeList(query: string, limit?: number, offset?: number, fields?: Array<AnimeField>, token?: string): Promise<Array<AnimeData> | ErrorResponse> {
		const params: object = {
			q: query,
			limit: limit,
			offset: offset,
		};
		if(fields && fields.length > 0) {
			params['fields'] = fields.join(',');
		}
		return axios.get('https://api.myanimelist.net/v2/anime', {
			params: params,
			headers: this.createHeader(token),
		}).then(response => {
			return handleResponse(response, data => {
				const nodes: Array<AnimeData> = [];
				for(const val of data.data) {
					nodes.push(val.node as AnimeData);
				}
				return nodes;
			});
		});
	}

	public getAnimeDetails(id: number, fields?: Array<DetailedAnimeField>, token?: string): Promise<DetailedAnimeData | ErrorResponse> {
		const params: object = {};
		if(fields && fields.length > 0) {
			params['fields'] = fields.join(',');
		}
		return axios.get(`https://api.myanimelist.net/v2/anime/${id}`, {
			params: params,
			headers: this.createHeader(token),
		}).then(response => {
			return handleResponse(response, data => {
				return data as DetailedAnimeData;
			});
		});
	}

	public getAnimeRanking(ranking_type: 'all' | 'airing' | 'upcoming' | 'tv' | 'ova' | 'movie' | 'special' | 'bypopularity' | 'favorite', limit?: number, offset?: number, fields?: Array<AnimeField>, token?: string): Promise<Array<RankedAnimeInstance> | ErrorResponse> {
		const params: object = {
			ranking_type: ranking_type,
			limit: limit,
			offset: offset,
		};
		if(fields && fields.length > 0) {
			params['fields'] = fields.join(',');
		}
		return axios.get('https://api.myanimelist.net/v2/anime/ranking', {
			params: params,
			headers: this.createHeader(token),
		}).then(response => {
			return handleResponse(response, data => {
				return data.data as Array<RankedAnimeInstance>;
			});
		});
	}

	public getSeasonalAnime(year: number, season: 'winter' | 'spring' | 'summer' | 'fall', sort?: 'anime_score' | 'anime_num_list_users', limit?: number, offset?: number, fields?: Array<AnimeField>, token?: string): Promise<Array<AnimeData> | ErrorResponse> {
		const params: object = {
			sort: sort,
			limit: limit,
			offset: offset,
		};
		if(fields && fields.length > 0) {
			params['fields'] = fields.join(',');
		}
		return axios.get(`https://api.myanimelist.net/v2/anime/season/${year}/${season}`, {
			params: params,
			headers: this.createHeader(token),
		}).then(response => {
			return handleResponse(response, data => {
				const nodes: Array<AnimeData> = [];
				for(const val of data.data) {
					nodes.push(val.node as AnimeData);
				}
				return nodes;
			});
		});
	}

	public getSuggestedAnime(token: string, limit?: number, offset?: number, fields?: Array<AnimeField>): Promise<Array<AnimeData> | ErrorResponse> {
		const params: object = {
			limit: limit,
			offset: offset,
		};
		if(fields && fields.length > 0) {
			params['fields'] = fields.join(',');
		}
		return axios.get('https://api.myanimelist.net/v2/anime/suggestions', {
			params: params,
			headers: this.createHeader(token),
		}).then(response => {
			return handleResponse(response, data => {
				const nodes: Array<AnimeData> = [];
				for(const val of data.data) {
					nodes.push(val.node as AnimeData);
				}
				return nodes;
			});
		});
	}

	public getUserAnimeList(username?: string, status?: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch', sort?: 'list_score' | 'list_updated_at' | 'anime_title' | 'anime_start_date' | 'anime_id', limit?: number, offset?: number, token?: string): Promise<Array<AnimeListEntry> | ErrorResponse> {
		const params: object = {
			status: status,
			sort: sort,
			limit: limit,
			offset: offset,
		};
		return axios.get(`https://api.myanimelist.net/v2/users/${username || '@me'}/animelist`, {
			params: params,
			headers: this.createHeader(token),
		}).then(response => {
			return handleResponse(response, data => {
				return data.data as Array<AnimeListEntry>;
			});
		});
	}

}