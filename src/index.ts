import axios from 'axios';
import { AnimeListOptions } from './options';
import { AnimeListResults, AnimeListResultsInstance, ErrorResponse } from './results';

export class MALClient {

    private client_id: string;

    public constructor(client_id: string) {
        this.client_id = client_id;
    }

    public getAnimeList(options: AnimeListOptions): Promise<AnimeListResults | ErrorResponse> {
        return axios.get('https://api.myanimelist.net/v2/anime', {
            params: options,
            headers: {
                'X-MAL-CLIENT-ID': this.client_id
            }
        })
        .then(response => {
            if(response.status == 200) {
                const instances: Array<AnimeListResultsInstance> = [];
                for(const obj of response.data.data) {
                    const node: AnimeListResultsInstance = obj.node;
                    instances.push(node);
                }
                const out: AnimeListResults = {
                    instances: instances
                }
                return out;
            }
            else {
                const out: ErrorResponse = {
                    status: response.status,
                    error: response.data.error,
                    message: response.data.message
                }
                return out;
            }
        });
    }

}