import Server from "./server.type";
type Episode = {
  episodeNumber: number;
  title: string;
  servers: Server[];
  downloadServers: Server[];
  screenshot: string;
};
export default Episode;
