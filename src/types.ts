/** date formatted string (see {@link https://myanimelist.net/apiconfig/references/api/v2#section/Common-formats}) */
type Date = string;
/** date-time formatted string (see {@link https://myanimelist.net/apiconfig/references/api/v2#section/Common-formats}) */
type DateTime = string;

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

export interface Holder<T> {
    node: T;
}

export interface Paged<T> {
    data: T,
    previous?: () => Promise<Paged<T> | ErrorResponse>;
    next?: () => Promise<Paged<T> | ErrorResponse>;
}

export interface Paging {
    previous?: string;
    next?: string;
}

/**
 * T should always be an array according to the documentation
 * However, in practice, T is not always an array
 *
 * @see https://myanimelist.net/apiconfig/references/api/v2#section/Common-formats for documentation
 */
export interface PagedResponse<T> {
    data: T;
    paging: Paging;
}

export interface Picture {
    medium?: string;
    large?: string;
}

export interface AlternativeTitles {
    synonyms?: Array<string>;
    en?: string;
    ja?: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface AnimeListStatus {
    status?: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
    score?: number;
    num_watched_episodes?: number;
    is_rewatching?: boolean;
    start_date?: Date;
    finish_date?: Date;
    priority?: number;
    num_times_rewatched?: number;
    rewatch_value?: number;
    tags?: Array<string>;
    comments?: string;
    updated_at?: DateTime;
}

export interface Related<T> extends Holder<T> {
    relation_type: 'sequel' | 'prequel' | 'alternative_setting' | 'alternative_version' | 'side_story' | 'parent_story' | 'summary' | 'full_story';
    relation_type_formatted: string;
}

export interface Recommendations<T> extends Holder<T> {
    num_recommendations: number;
}

export interface Season {
    year: number;
    season: 'winter' | 'spring' | 'summer' | 'fall';
}

export interface Broadcast {
    day_of_the_week: string;
    start_time?: string;
}

export interface Studio {
    id: number;
    name: string;
}

export interface Status {
    watching: number;
    completed: number;
    on_hold: number;
    dropped: number;
    plan_to_watch: number;
}

export interface Statistics {
    num_list_users: number;
    status: Status;
}

export interface Anime {
    id: number;
    title: string;
    main_picture?: Picture;
    alternative_titles?: AlternativeTitles;
    start_date?: string;
    end_date?: string;
    synopsis?: string;
    mean?: number;
    rank?: number;
    popularity?: number;
    num_list_users?: number;
    num_scoring_users?: number;
    nsfw?: 'white' | 'gray' | 'black';
    genres?: Array<Genre>;
    created_at?: DateTime;
    updated_at?: DateTime;
    media_type?: 'unknown' | 'tv' | 'ova' | 'movie' | 'special' | 'ona' | 'music';
    status?: 'finished_airing' | 'currently_airing' | 'not_yet_aired';
    my_list_status?: AnimeListStatus;
    num_episodes?: number;
    start_season?: Season;
    broadcast?: Broadcast;
    source?: 'other' | 'original' | 'manga' | '4_koma_manga' | 'web_manga' | 'digital_manga' | 'novel' | 'light_novel' | 'visual_novel' | 'game' | 'card_game' | 'book' | 'picture_book' | 'radio' | 'music';
    average_episode_duration?: number;
    rating?: 'g' | 'pg' | 'pg_13' | 'r' | 'r+' | 'rx';
    studios?: Array<Studio>;
}

export interface DetailedAnime extends Anime {
    pictures?: Array<Picture>;
    background?: string;
    related_anime?: Array<Related<Anime>>;
    related_manga?: Array<Related<Manga>>;
    recommendations?: Array<Recommendations<Anime>>;
    statistics?: Statistics;
}

export interface Ranking {
    rank: number;
    previous_rank?: number;
}

export interface RankedInstance<T> extends Holder<T> {
    ranking: Ranking;
}

export interface AnimeListEntry extends Holder<Anime> {
    list_status: AnimeListStatus;
}

export interface ForumBoards {
    title: string;
    boards: Array<ForumBoard>
}

export interface ForumBoard {
    id: number;
    title: string;
    description: string;
    subboards: Array<ForumSubboard>;
}

export interface ForumSubboard {
    id: number;
    title: string;
}

export interface DetailedForumTopic {
    title: string;
    posts: Array<ForumPost>;
    poll?: Array<ForumTopicPoll>;
}

export interface ForumPost {
    id: number;
    number: number;
    created_at: DateTime;
    created_by: ForumPostAuthor;
    body: string;
    signature: string;
}

export interface ForumPostAuthor {
    id: number;
    name: string;
    forum_avator: string;
}

export interface ForumTopicPoll {
    id: number;
    question: string;
    close: boolean;
    options: Array<ForumTopicPollOption>
}

export interface ForumTopicPollOption {
    id: number;
    text: string;
    votes: number;
}

export interface ForumTopic {
    id: number;
    title: string;
    created_at: DateTime;
    created_by: ForumTopicAuthor;
    number_of_posts: number;
    last_post_created_at: DateTime;
    last_post_created_by: ForumTopicAuthor;
    is_locked: boolean;
}

export interface ForumTopicAuthor {
    id: number;
    name: string;
}

export interface MangaListStatus {
    status?: 'reading' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read';
    score?: number;
    num_volumes_read?: number;
    num_chapters_read?: number;
    is_rereading?: boolean;
    start_date?: Date;
    finish_date?: Date;
    priority?: number;
    num_times_reread?: number;
    reread_value?: number;
    tags?: Array<string>;
    comments?: string;
    updated_at?: DateTime;
}

export interface Author {
    id: number;
    first_name: string;
    last_name: string;
}

export interface AuthorRole extends Holder<Author> {
    role: string;
}

export interface Magazine {
    id: number;
    name: string;
}

export interface MagazineRole extends Holder<Magazine> {
    role: string;
}

export interface Manga {
    id: number;
    title: string;
    main_picture?: Picture;
    alternative_titles?: AlternativeTitles;
    start_date?: string;
    end_date?: string;
    synopsis?: string;
    mean?: number;
    rank?: number;
    popularity?: number;
    num_list_users?: number;
    num_scoring_users?: number;
    nsfw?: 'white' | 'gray' | 'black';
    genres?: Array<Genre>;
    created_at?: DateTime;
    updated_at?: DateTime;
    media_type?: 'unknown' | 'manga' | 'novel' | 'one_shot' | 'doujinshi' | 'manhwa' | 'manhua' | 'oel';
    status?: 'finished' | 'currently_publishing' | 'not_yet_published';
    my_list_status?: MangaListStatus;
    num_volumes?: number;
    num_chapters?: number;
    authors?: Array<AuthorRole>;
}

export interface DetailedManga extends Manga {
    pictures?: Array<Picture>;
    background?: string;
    related_anime?: Array<Related<Anime>>;
    related_manga?: Array<Related<Manga>>;
    recommendations?: Array<Recommendations<Manga>>;
    serialization?: Array<MagazineRole>;
}

export interface MangaListEntry extends Holder<Manga> {
    list_status?: MangaListStatus;
}

export interface AnimeStatistics {
    num_items_watching: number;
    num_items_completed: number;
    num_items_on_hold: number;
    num_items_dropped: number;
    num_items_plan_to_watch: number;
    num_items: number;
    num_days_watched: number;
    num_days_watching: number;
    num_days_completed: number;
    num_days_on_hold: number;
    num_days_dropped: number;
    num_days: number;
    num_episodes: number;
    num_times_rewatched: number;
    mean_score: number;
}

export interface UserInfo {
    id: number;
    name: string;
    picture: string;
    gender?: string;
    birthday?: Date;
    location?: string;
    joined_at: DateTime;
    anime_statistics?: AnimeStatistics;
    time_zone?: string;
    is_supported?: boolean;
}
