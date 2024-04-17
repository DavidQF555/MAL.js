export type AnimeField = 'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios';
export type DetailedAnimeField = 'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios' | 'pictures' | 'background' | 'related_anime' | 'related_manga' | 'recommendations' | 'statistics'

export interface ErrorResponse {
    status: number;
    error: string;
    message: string;
}

export interface OAuthRequest {
    url: string;
    code_verifier: string;
}

export interface TokenResponse {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
}