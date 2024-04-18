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

export interface ListStatus {
    status?: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
    score: number;
    num_episodes_watched: number;
    is_rewatching: boolean;
    start_date?: string;
    finish_date?: string;
    priority: number;
    num_times_rewatched: number;
    rewatch_value: number;
    tags: Array<string>;
    comments: string;
    updated_at: string;
}

export interface RelatedAnime {
    node: AnimeData;
    relation_type: 'sequel' | 'prequel' | 'alternative_setting' | 'alternative_version' | 'side_story' | 'parent_story' | 'summary' | 'full_story';
    relation_type_formatted: string;
}

export interface RelatedManga {
    node;
    relation_type: 'sequel' | 'prequel' | 'alternative_setting' | 'alternative_version' | 'side_story' | 'parent_story' | 'summary' | 'full_story';
    relation_type_formatted: string;
}

export interface Recommendations {
    node: AnimeData;
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

export interface AnimeData {
    id: number;
    title: string;
    main_picture?: Picture;
}

export interface FieldedAnimeData extends AnimeData {
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
    created_at?: string;
    updated_at?: string;
    media_type?: 'unknown' | 'tv' | 'ova' | 'movie' | 'special' | 'ona' | 'music';
    status?: 'finished_airing' | 'currently_airing' | 'not_yet_aired';
    my_list_status?: ListStatus;
    num_episodes?: number;
    start_season?: Season;
    broadcast?: Broadcast;
    source?: 'other' | 'original' | 'manga' | '4_koma_manga' | 'web_manga' | 'digital_manga' | 'novel' | 'light_novel' | 'visual_novel' | 'game' | 'card_game' | 'book' | 'picture_book' | 'radio' | 'music';
    average_episode_duration?: number;
    rating?: 'g' | 'pg' | 'pg_13' | 'r' | 'r+' | 'rx';
    studios?: Array<Studio>;
}

export interface DetailedAnimeData extends FieldedAnimeData {
    pictures?: Array<Picture>;
    background?: string;
    related_anime?: Array<RelatedAnime>;
    related_manga?: Array<RelatedManga>;
    recommendations?: Array<Recommendations>;
    statistics?: Statistics;
}

export interface Ranking {
    rank: number;
    previous_rank?: number;
}

export interface RankedAnimeInstance {
    node: FieldedAnimeData;
    ranking: Ranking;
}

export interface AnimeListEntry {
    node: AnimeData;
    list_status: ListStatus;
}