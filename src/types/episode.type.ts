import Server from "./server.type";
type Episode = {
  id: string;
  episode: number;
  title: string;
  subtitle: string;
  servers: Server[];
  date: number;
};
export default Episode;
