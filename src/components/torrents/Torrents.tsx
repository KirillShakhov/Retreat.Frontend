import {FC, useEffect, useRef, useState} from "react";
import {
  Torrent,
  torrentsService,
  addTorrentMagnet,
  deleteTorrent,
  addTorrentFile,
  getStreamUrl
} from "../../services/torrentsService.ts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TorrentItem from "./TorrentItem.tsx";

const Torrents: FC = () => {
  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [newTorrent, setNewTorrent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddTorrent = () => {
    if (newTorrent === '') return
    setNewTorrent("");
    addTorrentMagnet(newTorrent).then(() => {
      fetchTorrents();
    });
  };

  const handleAddFileTorrent = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      addTorrentFile(file).then(() => {
        fetchTorrents();
      });
    }
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

  // const handleStartPauseTorrent = (id: string, isPaused: boolean) => {
  //   if (isPaused) {
  //     startTorrent(id).then(() => fetchTorrents());
  //   } else {
  //     pauseTorrent(id).then(() => fetchTorrents());
  //   }
  // };

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

  return (
    <>
      <div style={{position: 'absolute'}}>
        <ToastContainer />
      </div>
      <div style={{ textAlign: "start", padding: "20px" }}>
        <h1>Torrents</h1>
        <div style={{marginBottom: "20px"}}>
          <input
            type="text"
            value={newTorrent}
            onChange={(e) => setNewTorrent(e.target.value)}
            placeholder="Add new torrent"
            style={{marginRight: "10px"}}
          />
          <button onClick={handleAddTorrent} style={{marginRight: "10px"}}>Add Torrent</button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAddFileTorrent}
            style={{display: "none"}}
          />
          <button onClick={() => fileInputRef.current?.click()}>Add File</button>
        </div>
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
