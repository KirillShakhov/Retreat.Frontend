import axios from 'axios';
import {API_URL} from "./url.ts";

export interface Torrent {
  id: string,
  name: string,
  progress: number,
  download: boolean,
  time: Date,
}

export interface TorrentsResponse {
  data: Torrent[],
}


function torrentsService(): Promise<TorrentsResponse> {
  return axios.get(`${API_URL}/torrents`);
}

export const addTorrentMagnet = async (magnet: string): Promise<void> => {
  return axios.get(`${API_URL}/magnet?uri=${magnet}`);
};

export const deleteTorrent = async (id: string): Promise<void> => {
  return axios.get(`${API_URL}/delete?id=${id}`);
};

export const getStreamUrl = (id: string): string => {
  return `${API_URL}/stream?id=${id}`;
};

export const addTorrentFile = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);

  await fetch(`${API_URL}/file`, {
    method: "POST",
    body: formData,
  });
};

export { torrentsService };
