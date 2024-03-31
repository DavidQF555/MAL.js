type AnimeField = 'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios';
type DetailedAnimeField = 'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios' | 'pictures' | 'background' | 'related_anime' | 'related_manga' | 'recommendations' | 'statistics'

export interface ErrorResponse {
    status: number;
    error: string;
    message: string;
}

export interface AnimeListOptions {
    q: string;
    limit?: number;
    offset?: number;
    fields?: Array<AnimeField>;
}

export interface AnimeDetailsOptions {
    id: number,
    fields?: Array<DetailedAnimeField>;
}

export interface AnimeRankingOptions {
    ranking_type: 'all' | 'airing' | 'upcoming' | 'tv' | 'ova' | 'movie' | 'special' | 'bypopularity' | 'favorite';
    limit?: number;
    offset?: number;
    fields?: Array<AnimeField>;
}

export interface SeasonalAnimeOptions {
    year: number;
    season: 'winter' | 'spring' | 'summer' | 'fall';
    sort?: 'anime_score' | 'anime_num_list_users';
    limit?: number;
    offset?: number;
    fields?: Array<AnimeField>;
}

export interface UserAnimeListOptions {
    username: string;
    status?: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
    sort?: 'list_score' | 'list_updated_at' | 'anime_title' | 'anime_start_date' | 'anime_id';
    limit?: number;
    offset?: number;
}