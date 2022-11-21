import Server from "./server.type";
type Episode = {
  episodeNumber: number;
  title: string;
  servers: Server[];
  downloadServers: Server[];
};
export default Episode;
