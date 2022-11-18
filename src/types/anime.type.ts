import Episode from "./episode.type";

type aired = {
  from: string;
  to: string;
  prop: { from: any; to: any };
};

type Anime = {
  id: number;
  mal_id: number;
  slug: string;
  title: string;
  lowerTitle: string;
  alternativeTitles: any[];
  lowerAlternativeTitles: any[];
  type: string;
  status: string;
  aired: aired | null;
  year: number;
  duration: string;
  trailer: any;
  images: any;
  rating: string;
  votes: number;
  cover: string;
  banner: string;
  genres: any[];
  lowerGenres: any[];
  sinopsis: string;
  related: any[];
  episodes: Episode[];
  views: number;
  date: number;
  updated: number;
  visible: boolean;
};

export default Anime;
