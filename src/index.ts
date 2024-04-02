import axios, { AxiosResponse } from 'axios';
import { AnimeDetailsOptions, AnimeListOptions, AnimeRankingOptions, ErrorResponse, SeasonalAnimeOptions, UserAnimeListOptions } from './options';
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

export class MALClient {

	private client_id: string;

	public constructor(client_id: string) {
		this.client_id = client_id;
	}

	public getAnimeList(options: AnimeListOptions): Promise<Array<AnimeData> | ErrorResponse> {
		const params: object = {
			q: options.q,
			limit: options.limit,
			offset: options.offset,
		};
		if(options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return axios.get('https://api.myanimelist.net/v2/anime', {
			params: params,
			headers: {
				'X-MAL-CLIENT-ID': this.client_id,
			},
		}).then(response => {
			return handleResponse(response, data => {
				return data.data as Array<AnimeData>;
			});
		});
	}

	public getAnimeDetails(options: AnimeDetailsOptions): Promise<DetailedAnimeData | ErrorResponse> {
		const params: object = {};
		if(options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return axios.get(`https://api.myanimelist.net/v2/anime/${options.id}`, {
			params: params,
			headers: {
				'X-MAL-CLIENT-ID': this.client_id,
			},
		}).then(response => {
			return handleResponse(response, data => {
				return data as DetailedAnimeData;
			});
		});
	}

	public getAnimeRanking(options: AnimeRankingOptions): Promise<Array<RankedAnimeInstance> | ErrorResponse> {
		const params: object = {
			ranking_type: options.ranking_type,
			limit: options.limit,
			offset: options.offset,
		};
		if(options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return axios.get('https://api.myanimelist.net/v2/anime/ranking', {
			params: params,
			headers: {
				'X-MAL-CLIENT-ID': this.client_id,
			},
		}).then(response => {
			return handleResponse(response, data => {
				return data.data as Array<RankedAnimeInstance>;
			});
		});
	}

	public getSeasonalAnime(options: SeasonalAnimeOptions): Promise<Array<AnimeData> | ErrorResponse> {
		const params: object = {
			sort: options.sort,
			limit: options.limit,
			offset: options.offset,
		};
		if(options.fields && options.fields.length > 0) {
			params['fields'] = options.fields.join(',');
		}
		return axios.get(`https://api.myanimelist.net/v2/anime/season/${options.year}/${options.season}`, {
			params: params,
			headers: {
				'X-MAL-CLIENT-ID': this.client_id,
			},
		}).then(response => {
			return handleResponse(response, data => {
				return data.data as Array<AnimeData>;
			});
		});
	}

	public getUserAnimeList(options: UserAnimeListOptions): Promise<Array<AnimeListEntry> | ErrorResponse> {
		const params: object = {
			status: options.status,
			sort: options.sort,
			limit: options.limit,
			offset: options.offset,
		};
		return axios.get(`https://api.myanimelist.net/v2/users/${options.username}/animelist`, {
			params: params,
			headers: {
				'X-MAL-CLIENT-ID': this.client_id,
			},
		}).then(response => {
			return handleResponse(response, data => {
				return data.data as Array<AnimeListEntry>;
			});
		});
	}

}