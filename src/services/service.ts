import axios from "axios";
import "dotenv/config";
const API_URL = process.env.API_URL;
const token = process.env.API_BEARER_TOKEN;

class Service {
  constructor() {}

  Api = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  async saveAnime(anime: any) {
    try {
      const response = await this.Api.post("/animes", anime);
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
      const response = await this.Api.post(`/episodes/${animeKey}`, episode);
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
      const response = await this.Api.get(`/animes/${slug}`);
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
      const response = await this.Api.delete(`/animes/${slug}`);
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  async deleteLastAnime() {
    try {
      const responseAnime = await this.Api.get(`/animes/directory`);
      const animeData = responseAnime.data;
      if (responseAnime.status === 200) {
        if (animeData.animes.length === 0) return true;
        const response = await this.Api.delete(
          `/animes/${animeData.animes[0].slug}`
        );
        if (response.status === 200) {
          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async getEpisodeBySlug(slug: string, episode: number) {
    try {
      const response = await this.Api.get(`/episodes/${slug}/${episode}`);
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
