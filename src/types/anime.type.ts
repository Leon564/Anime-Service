import Episode from "./episode.type";

type Anime = {
  id: number;
  animeId: String;
  title: string;
  lowerTitle: string;
  AlternativeTitles: any[];
  lowerAlternativeTitles: any[];
  type: string;
  status: string;
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
  visible:boolean;
};

export default Anime;
