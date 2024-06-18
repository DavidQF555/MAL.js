export default function parseFields(fields: object): string {
	const parts: Array<string> = [];
	for(const key in fields) {
		const value = fields[key];
		if(value) {
			if(typeof value === 'object') {
				const parsed: string = parseFields(value);
				parts.push(parsed ? `${key}{${parsed}}` : key);
			}
			else {
				parts.push(key);
			}
		}
	}
	return parts.join(',');
}

export interface UserAnimeListFields extends AnimeFields {
    list_status?: boolean | AnimeListStatusFields;
}

export interface AnimeListStatusFields {
    status?: boolean;
    score?: boolean;
    num_episodes_watched?: boolean;
    is_rewatching?: boolean;
    start_date?: boolean;
    finish_date?: boolean;
    priority?: boolean;
    num_times_rewatched?: boolean;
    rewatch_value?: boolean;
    tags?: boolean;
    comments?: boolean;
    updated_at?: boolean;
}

export interface AnimeFields {
    alternative_titles?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    synopsis?: boolean;
    mean?: boolean;
    rank?: boolean;
    popularity?: boolean;
    num_list_users?: boolean;
    num_scoring_users?: boolean;
    nsfw?: boolean;
    genres?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    media_type?: boolean;
    status?: boolean;
    my_list_status?: boolean | AnimeListStatusFields;
    num_episodes?: boolean;
    start_season?: boolean;
    broadcast?: boolean;
    source?: boolean;
    average_episode_duration?: boolean;
    rating?: boolean;
    studios?: boolean;
}

export interface DetailedAnimeFields extends AnimeFields {
    pictures?: boolean;
    background?: boolean;
    related_anime?: boolean;
    related_manga?: boolean;
    recommendations?: boolean;
    statistics?: boolean;
}

export interface UserMangaListFields extends MangaFields {
    list_status?: boolean | MangaListStatusFields;
}

export interface MangaListStatusFields {
    status?: boolean;
    score?: boolean;
    num_volumes_read?: boolean;
    num_chapters_read?: boolean;
    is_rereading?: boolean;
    start_date?: boolean;
    finish_date?: boolean;
    priority?: boolean;
    num_times_reread?: boolean;
    reread_value?: boolean;
    tags?: boolean;
    comments?: boolean;
    updated_at?: boolean;
}

export interface MangaFields {
    alternative_titles?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    synopsis?: boolean;
    mean?: boolean;
    rank?: boolean;
    popularity?: boolean;
    num_list_users?: boolean;
    num_scoring_users?: boolean;
    nsfw?: boolean;
    genres?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    media_type?: boolean;
    status?: boolean;
    my_list_status?: boolean | MangaListStatusFields;
    num_volumes?: boolean;
    num_chapters?: boolean;
    authors?: boolean;
}

export interface DetailedMangaFields extends MangaFields {
    pictures?: boolean;
    background?: boolean;
    related_anime?: boolean;
    related_manga?: boolean;
    recommendations?: boolean;
    serialization?: boolean;
}

export interface UserInfoFields {
    id?: boolean;
    name?: boolean;
    picture?: boolean;
    gender?: boolean;
    birthday?: boolean;
    location?: boolean;
    joined_at?: boolean;
    anime_statistics?: boolean;
    time_zone?: boolean;
    is_supported?: boolean;
}