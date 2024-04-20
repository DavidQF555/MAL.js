export type AnimeField = 'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios';
export type DetailedAnimeField = 'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_episodes' | 'start_season' | 'broadcast' | 'source' | 'average_episode_duration' | 'rating' | 'studios' | 'pictures' | 'background' | 'related_anime' | 'related_manga' | 'recommendations' | 'statistics'

export type MangaField = 'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_volumes' | 'num_chapters' | 'authors';
export type DetailedMangaField = 'id' | 'title' | 'main_picture' | 'alternative_titles' | 'start_date' | 'end_date' | 'synopsis' | 'mean' | 'rank' | 'popularity' | 'num_list_users' | 'num_scoring_users' | 'nsfw' | 'genres' | 'created_at' | 'updated_at' | 'media_type' | 'status' | 'my_list_status' | 'num_volumes' | 'num_chapters' | 'authors' | 'pictures' | 'background' | 'related_anime' | 'related_manga' | 'recommendations' | 'serialization';

export type UserField = 'id' | 'name' | 'picture' | 'gender' | 'birthday' | 'location' | 'joined_at' | 'anime_statistics' | 'time_zone' | 'is_supported';

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

export interface MangaListOptions {
    q: string;
    limit?: number;
    offset?: number;
    fields?: Array<MangaField>
}

export interface DetailedMangaOptions {
    fields?: Array<DetailedMangaField>;
}

export interface MangaRankingOptions {
    ranking_type: 'all' | 'manga' | 'novels' | 'oneshots' | 'doujin' | 'manhwa' | 'manhua' | 'bypopularity' | 'favorite';
    limit?: number;
    offset?: number;
    fields?: Array<MangaField>;
}

export interface UserMangaListOptions {
    status?: 'reading' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read';
    sort?: 'list_score' | 'list_updated_at' | 'manga_title' | 'manga_start_date' | 'manga_id';
    limit?: number;
    offset?: number;
}

export interface UserInfoOptions {
    fields?: Array<UserField>
}