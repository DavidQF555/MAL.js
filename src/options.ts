import { AnimeFields, DetailedAnimeFields, DetailedMangaFields, MangaFields, UserAnimeListFields, UserInfoFields, UserMangaListFields } from './fields';

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
    fields?: AnimeFields;
}

export interface DetailedAnimeOptions {
    fields?: DetailedAnimeFields;
}

export interface AnimeRankingOptions {
    ranking_type: 'all' | 'airing' | 'upcoming' | 'tv' | 'ova' | 'movie' | 'special' | 'bypopularity' | 'favorite';
    limit?: number;
    offset?: number;
    fields?: AnimeFields;
}

export interface SeasonalAnimeOptions {
    sort?: 'anime_score' | 'anime_num_list_users';
    limit?: number;
    offset?: number;
    fields?: AnimeFields;
}

export interface SuggestedAnimeOptions {
    limit?: number;
    offset?: number;
    fields?: AnimeFields;
}

export interface UserAnimeListOptions {
    status?: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
    sort?: 'list_score' | 'list_updated_at' | 'anime_title' | 'anime_start_date' | 'anime_id';
    limit?: number;
    offset?: number;
    fields?: UserAnimeListFields;
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
    fields?: MangaFields;
}

export interface DetailedMangaOptions {
    fields?: DetailedMangaFields;
}

export interface MangaRankingOptions {
    ranking_type: 'all' | 'manga' | 'novels' | 'oneshots' | 'doujin' | 'manhwa' | 'manhua' | 'bypopularity' | 'favorite';
    limit?: number;
    offset?: number;
    fields?: MangaFields;
}

export interface UserMangaListOptions {
    status?: 'reading' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read';
    sort?: 'list_score' | 'list_updated_at' | 'manga_title' | 'manga_start_date' | 'manga_id';
    limit?: number;
    offset?: number;
    fields?: UserMangaListFields;
}

export interface UserInfoOptions {
    fields?: UserInfoFields;
}