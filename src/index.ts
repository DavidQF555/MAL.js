import axios, { AxiosResponse } from 'axios';
import { AnimeDetailsOptions, AnimeListOptions, ErrorResponse } from './options';
import { AnimeData, DetailedAnimeData } from './types';

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
                const instances: Array<AnimeData> = [];
                for(const obj of data.data) {
                    const node: AnimeData = obj.node;
                    instances.push(node);
                }
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

}