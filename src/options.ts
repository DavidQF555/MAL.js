export interface ErrorResponse {
    status: number;
    error: string;
    message: string;
}

export interface AnimeListOptions {
    q: string;
    limit?: number;
    offset?: number;
    fields?: Array<'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios'>
}

export interface AnimeDetailsOptions {
    id: number,
    fields?: Array<'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios' | 'pictures' | 'background' | 'related_anime' | 'related_manga' | 'recommendations' | 'statistics'>
}

export interface AnimeRankingOptions {
    ranking_type: 'all' | 'airing' | 'upcoming' | 'tv' | 'ova' | 'movie' | 'special' | 'bypopularity' | 'favorite';
    limit?: number;
    offset?: number;
    fields?: Array<'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios'>
}

export interface SeasonalAnimeOptions {
    year: number;
    season: 'winter' | 'spring' | 'summer' | 'fall';
    sort?: 'anime_score' | 'anime_num_list_users';
    limit?: number;
    offset?: number;
    fields?: Array<'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios'>
}