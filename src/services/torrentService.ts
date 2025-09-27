import api from './api'; // <-- Импортируем наш настроенный клиент
import {API_URL} from "./url.ts";

export interface FileInfo {
  id: string,
  name: string,
  progress: number,
}


export interface TorrentInfo {
  id: string,
  name: string,
  time: Date,
  files: FileInfo[],
}

export interface TorrentsResponse {
  data: TorrentInfo[],
}

export const getTorrents = async (): Promise<TorrentsResponse> => {
  return api.get(`${API_URL}/api/torrents`);
}

export const addTorrentMagnet = async (magnet: string): Promise<void> => {
  return api.get(`${API_URL}/api/magnet?uri=${magnet}`);
};

export const deleteTorrent = async (id: string): Promise<void> => {
  return api.get(`${API_URL}/api/delete?id=${id}`);
};

export const getStreamUrl = (torrentInfo: TorrentInfo, file: FileInfo): string => {
  return `${API_URL}/api/stream?id=${torrentInfo.id}&fileId=${file.id}`;
};

export const addTorrentFile = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);

  await fetch(`${API_URL}/api/file`, {
    method: "POST",
    body: formData,
  });
};
