import { Anime, AnimeListStatus, DetailedAnime, DetailedManga, Manga, MangaListStatus, UserInfo } from './types.js';

export default function parseFields(fields: object): string {
	const parts: Array<string> = [];
	for(const key in fields) {
		const value = fields[key as keyof object];
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

export type AnimeListStatusFields = {
    [T in keyof AnimeListStatus]?: boolean;
}

export type AnimeFields = {
    [T in keyof Anime]?: boolean;
}

export type DetailedAnimeFields = {
    [T in keyof DetailedAnime]?: boolean;
}

export interface UserMangaListFields extends MangaFields {
    list_status?: boolean | MangaListStatusFields;
}

export type MangaListStatusFields = {
    [P in keyof MangaListStatus]?: boolean;
}

export type MangaFields = {
    [P in keyof Manga]?: boolean;
}

export type DetailedMangaFields = {
    [P in keyof DetailedManga]?: boolean;
}

export type UserInfoFields = {
    [P in keyof UserInfo]?: boolean;
}