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
    status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
    score?: number;
    num_episodes_watched?: number;
    is_rewatching?: boolean;
    start_date?: string;
    finish_date?: string;
    priority?: number;
    num_times_rewatched?: number;
    rewatch_value?: number;
    tags?: Array<string>;
    comments?: string;
    updated_at?: string;
}

export interface Related<T> {
    node: T;
    relation_type: 'sequel' | 'prequel' | 'alternative_setting' | 'alternative_version' | 'side_story' | 'parent_story' | 'summary' | 'full_story';
    relation_type_formatted: string;
}

export interface Recommendations<T> {
    node: T;
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
    created_at?: string;
    updated_at?: string;
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

export interface RankedInstance<T> {
    node: T;
    ranking: Ranking;
}

export interface AnimeListEntry {
    node: Anime;
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
    created_at: string;
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
    created_at: string;
    created_by: ForumTopicAuthor;
    number_of_posts: number;
    last_post_created_at: string;
    last_post_created_by: ForumTopicAuthor;
    is_locked: boolean;
}

export interface ForumTopicAuthor {
    id: number;
    name: string;
}

export interface MangaListStatus {
    status?: string;
    score: number;
    num_volumes_read: number;
    num_chapters_read: number;
    is_rereading: boolean;
    start_date?: string;
    finish_date?: string;
    priority: number;
    num_times_reread: number;
    reread_value: number;
    tags: Array<string>;
    comments: string;
    updated_at: string;
}

export interface Author {
    id: number;
    first_name: string;
    last_name: string;
}

export interface AuthorRole {
    node: Author;
    role: string;
}

export interface Magazine {
    id: number;
    name: string;
}

export interface MagazineRole {
    node: Magazine;
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
    num_list_users: number;
    num_scoring_users: number;
    nsfw?: 'white' | 'gray' | 'black';
    genres: Array<Genre>;
    created_at: string;
    updated_at: string;
    media_type: 'unknown' | 'manga' | 'novel' | 'one_shot' | 'doujinshi' | 'manhwa' | 'manhua' | 'oel';
    status: 'finished' | 'currently_publishing' | 'not_yet_published';
    my_list_status?: MangaListStatus;
    num_volumes: number;
    num_chapters: number;
    authors: Array<AuthorRole>;
}

export interface DetailedManga extends Manga {
    pictures: Array<Picture>;
    background?: string;
    related_anime: Array<Related<Anime>>;
    related_manga: Array<Related<Manga>>;
    recommendations: Array<Recommendations<Manga>>;
    serialization: Array<MagazineRole>;
}