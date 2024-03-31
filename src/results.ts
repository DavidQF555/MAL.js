export interface ErrorResponse {
    status: number;
    error: string;
    message: string;
}

export interface Picture {
    medium: string;
    large: string;
}

export interface AnimeListResultsInstance {
    id: number;
    title: string;
    picture: Picture;
}

export interface AnimeListResults {
    instances: Array<AnimeListResultsInstance>
}