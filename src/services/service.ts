import axios from "axios";
import "dotenv/config";
const API_URL = process.env.API_URL;

class Service {
  constructor() {}

  async saveAnime(anime: any) {
    try {
      const response = await axios.post(`${API_URL}/animes`, anime);
      if (response.status === 200) {
        return response.data.slug;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  async saveEpisode(episode: any, animeKey: string) {
    try {
      const response = await axios.post(
        `${API_URL}/episodes/${animeKey}`,
        episode
      );
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async getAnimeBySlug(slug: string) {
    try {
      const response = await axios.get(`${API_URL}/animes/${slug}`);
      if (response.status === 200) {
        return response.data;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async deleteAnime(slug: string) {
    try {
      const response = await axios.delete(`${API_URL}/animes/${slug}`);
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  async getEpisodeBySlug(slug: string, episode: number) {
    try {
      const response = await axios.get(
        `${API_URL}/episodes/${slug}/${episode}`
      );
      if (response.status === 200) {
        return response.data;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}

export default new Service();
