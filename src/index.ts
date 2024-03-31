import axios, { AxiosResponse } from 'axios';
import { AnimeDetailsOptions, AnimeListOptions, AnimeRankingOptions, ErrorResponse, SeasonalAnimeOptions } from './options';
import { AnimeData, DetailedAnimeData, RankedAnimeInstance } from './types';

function handleResponse<D = any>(response: AxiosResponse<any>, map: ((val: any) => D)): (D | ErrorResponse) {
    if(response.status == 200) {
        return map(response.data);
    }
    else {
        const out: ErrorResponse = {
            status: response.status,
            error: response.data.error,
            message: response.data.message
        }
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
                'X-MAL-CLIENT-ID': this.client_id
            }
        })
        .then(response => {
            return handleResponse(response, data => {
                const instances: Array<AnimeData> = data.data;
                return instances;
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
                'X-MAL-CLIENT-ID': this.client_id
            }
        })
        .then(response => {
            return handleResponse(response, data => {
                const out: DetailedAnimeData = data;
                return out;
            })
        })
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
                'X-MAL-CLIENT-ID': this.client_id
            }
        })
        .then(response => {
            return handleResponse(response, data => {
                const instances: Array<RankedAnimeInstance> = data.data;
                return instances;
            })
        })
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
        return axios.get(`https://api.myanimelist.net/v2/season/${options.year}/${options.season}`, {
            params: params,
            headers: {
                'X-MAL-CLIENT-ID': this.client_id
            }
        })
        .then(response => {
            return handleResponse(response, data => {
                const instances: Array<AnimeData> = data.data;
                return instances;
            });
        });
    }

    // TODO: get suggested anime, requires main_auth

}