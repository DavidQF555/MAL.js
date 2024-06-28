import { Anime, AnimeListStatus, DetailedAnime, DetailedManga, Manga, MangaListStatus, UserInfo } from './types.js';

/**
 * An object that encodes which fields are present
 *
 * Each key is a field and their value is whether it is present or their subfields
 */
export type FieldsObject = { [key: string]: boolean | FieldsObject | undefined }

/**
 * Converts an object to a field string as specified by {@link https://myanimelist.net/apiconfig/references/api/v2#section/Common-parameters}
 *
 * Each key is added to the string if the corresponding value evaluates to true
 * If the value is another object, it is parsed recursively and added after the key in curly brackets
 *
 * @param fields - an object representing the fields
 *
 * @returns a field string converted from the object
 */
export default function parseFields(fields: FieldsObject): string {
	const parts: Array<string> = [];
	for(const key in fields) {
		const value = fields[key as keyof FieldsObject];
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

export interface UserAnimeListFields extends FieldsObject, AnimeFields {
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

export interface UserMangaListFields extends FieldsObject, MangaFields {
    list_status?: boolean | MangaListStatusFields;
}

export type MangaListStatusFields = {
    [T in keyof MangaListStatus]?: boolean;
}

export type MangaFields = {
    [T in keyof Manga]?: boolean;
}

export type DetailedMangaFields = {
    [T in keyof DetailedManga]?: boolean;
}

export type UserInfoFields = {
    [T in keyof UserInfo]?: boolean;
}