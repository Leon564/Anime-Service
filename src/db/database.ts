import Anime from "../types/anime.type";
import Episode from "../types/episode.type";
import db from "./firebase";
import snapshotToArray from "../utils/snapshotToArray";

const saveAnime = async (anime: Anime) => {  
  const key = db.ref("animes").push(anime).key;
  db.ref("animes/lenght").transaction((count: number) => {
    return count + 1;
  });
  db.ref("animes/lastUpdate").set(Date.now());
  return key;
};

const saveEpisode = async (episode: Episode, animeKey: string) => {
  const key = db.ref(`animes/${animeKey}`).child("episodes").push(episode).key;
  db.ref("animes/lastUpdate").set(Date.now());
  return key;
};

const getAnimeByTitle = async (title: string) => {
  const lowerTitle = title.toLowerCase();
  const anime = await db
    .ref("animes")
    .orderByChild("lowerTitle")
    .startAt(lowerTitle)
    .endAt(lowerTitle + "\uf8ff")
    .limitToLast(30)
    .once("value");

  return await snapshotToArray(anime);
};

const getAnimeById = async (id: string) => {
  const anime = await db
    .ref(`animes`)
    .orderByChild("id")
    .equalTo(id)
    .once("value");
  return await snapshotToArray(anime);
};

const getAnimeByGenre = async (genre: string) => {
  const anime = await db
    .ref("animes")
    .orderByChild(`lowerGenres/${genre}`)
    .equalTo(true)
    .limitToLast(30)
    .once("value");

  return await snapshotToArray(anime);
};

const getEpisodeById = async (animeKey: string, episode: number) => {
  const anime = await getAnimeById(animeKey);
  if (anime.length === 0) return null;
  const result = Object.keys(anime[0]?.episodes)
    .map((key) => {
      if (anime[0].episodes[key].episode === episode) {
        return anime[0].episodes[key];
      }
    })
    .filter((item) => item);
  if (!result[0]) return null;
  return result[0];
};

export {
  saveAnime,
  saveEpisode,
  getAnimeByTitle,
  getAnimeById,
  getAnimeByGenre,
  getEpisodeById,
};
