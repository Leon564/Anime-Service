import Episode from "./episode.type";

type Anime = {  
  title: string;  
  id: string;
  alternativeTitles: any[];  
  type: string; 
  cover: string;
  banner: string;
  genres: any[];  
  synopsis: string;
  slug: string;
  related: any[];
  visible: boolean;
};

export default Anime;
