import {FC, useEffect, useState} from "react";
import {
  Torrent,
  torrentsService,
  deleteTorrent,
  getStreamUrl, addTorrentMagnet, addTorrentFile
} from "../../services/torrentsService.ts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TorrentItem from "./TorrentItem.tsx";
import ControlPanel from "./ControlPanel.tsx";

const Torrents: FC = () => {
  const [torrents, setTorrents] = useState<Torrent[]>([]);

  useEffect(() => {
    fetchTorrents();

    const interval = setInterval(() => {
      fetchTorrents();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchTorrents = () => {
    torrentsService().then((data) => {
      console.log(`data: ${JSON.stringify(data.data)}`);
      setTorrents(data.data);
    });
  };

  const onDelete = (item: Torrent) => {
    deleteTorrent(item.id).then(() => {
      console.log('handleDeleteTorrent complete')
      fetchTorrents();
    });
  };

  const onDownload = (item: Torrent) => {
    const url = getStreamUrl(item.id);
    const link = document.createElement('a');
    link.setAttribute('download', url);
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onCopy = (item: Torrent) => {
    const url = getStreamUrl(item.id);
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);

    toast.success('URL copied to clipboard!', {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const addMagnet = (magnet: string) => {
    addTorrentMagnet(magnet).then(() => {
      fetchTorrents();
    });
  };

  const addFile = (file: File) => {
    addTorrentFile(file).then(() => {
      fetchTorrents();
    });
  };

  return (
    <>
      <div style={{position: 'absolute'}}>
        <ToastContainer />
      </div>
      <div style={{ textAlign: "start", padding: "20px" }}>
        <h1>Torrents</h1>
        <ControlPanel addMagnet={addMagnet} addFile={addFile} />
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
          {torrents.map((torrent) => (
            <TorrentItem item={torrent} onCopy={onCopy} onDelete={onDelete} onDownload={onDownload} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Torrents;
