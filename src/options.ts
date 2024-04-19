export type AnimeField = 'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios';
export type DetailedAnimeField = 'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios' | 'pictures' | 'background' | 'related_anime' | 'related_manga' | 'recommendations' | 'statistics'

export interface ErrorResponse {
    status: number;
    error: string;
    message?: string;
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

export interface AnimeListOptions {
    q: string;
    limit?: number;
    offset?: number;
    fields?: Array<AnimeField>;
}

export interface DetailedAnimeOptions {
    fields?: Array<DetailedAnimeField>;
}

export interface AnimeRankingOptions {
    ranking_type: 'all' | 'airing' | 'upcoming' | 'tv' | 'ova' | 'movie' | 'special' | 'bypopularity' | 'favorite';
    limit?: number;
    offset?: number;
    fields?: Array<AnimeField>;
}

export interface SeasonalAnimeOptions {
    sort?: 'anime_score' | 'anime_num_list_users';
    limit?: number;
    offset?: number;
    fields?: Array<AnimeField>;
}

export interface SuggestedAnimeOptions {
    limit?: number;
    offset?: number;
    fields?: Array<AnimeField>;
}

export interface UserAnimeListOptions {
    status?: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
    sort?: 'list_score' | 'list_updated_at' | 'anime_title' | 'anime_start_date' | 'anime_id';
    limit?: number;
    offset?: number;
}

export interface ForumDetailsOptions {
    limit?: number;
    offset?: number;
}

export interface ForumTopicOptions {
    board_id?: number;
    subboard_id?: number;
    limit?: number;
    offset?: number;
    sort?: 'recent';
    q?: string;
    topic_user_name?: string;
    user_name?: string;
}