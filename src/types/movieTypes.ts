export interface MovieDetail {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    overview: string;
    release_date: string;
    genres: Array<{ id: number; name: string }>;
    runtime: number;
    backdrop_path: string;
    tagline?: string;
    status?: string;
    budget?: number;
    revenue?: number;
    spoken_languages?: Array<{ english_name: string }>;
    production_companies?: Array<{ name: string; logo_path: string }>;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Video {
    key: string;
    name: string;
    type: string;
    site: string;
}

export interface SimilarMovie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}

export interface MovieCardProps {
    id: number;
    title: string;
    poster: string;
    rating: number;
}