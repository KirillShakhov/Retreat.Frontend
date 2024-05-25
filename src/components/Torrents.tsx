import {FC, useEffect, useRef, useState} from "react";
import { Torrent, torrentsService, addTorrentMagnet, deleteTorrent, addTorrentFile } from "../services/torrentsService.ts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const handleDeleteTorrent = (id: string) => {
    deleteTorrent(id).then(() => {
      console.log('handleDeleteTorrent complete')
      fetchTorrents();
    });
  };

  const handleDownloadTorrent = (id: string) => {
    const url = `http://localhost:8000/stream?id=${id}`;
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

  const copy = (value: string) => {
    const url = `http://localhost:8000/stream?id=${value}`;
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
            <div
              key={torrent.id}
              style={{
                background: "#333",
                padding: "10px",
                borderRadius: "6px",
                color: "#fff"
              }}
            >
              <div>Name: {torrent.name}</div>
              <div style={{display: "flex", alignItems: "center", gap: 10}}>
                <span>Progress:</span>
                <div
                  style={{
                    background: "#555",
                    borderRadius: "4px",
                    width: "100%",
                    marginLeft: "10px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      background: "#646cff",
                      width: `${torrent.progress}%`,
                      height: "10px",
                      borderRadius: "4px"
                    }}
                  />
                </div>
                <span>{torrent.progress}%</span>
              </div>
              <div>Time: {new Date(torrent.time).toLocaleString()}</div>
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => copy(torrent.id)}
                  style={{
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Copy
                </button>
                <button
                  onClick={() => handleDownloadTorrent(torrent.id)}
                  style={{
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Download
                </button>
                {/*<button*/}
                {/*  onClick={() => handleStartPauseTorrent(torrent.id, !torrent.download)}*/}
                {/*  style={{*/}
                {/*    backgroundColor: "#1a1a1a",*/}
                {/*    color: "#fff",*/}
                {/*    border: "none",*/}
                {/*    padding: "5px 10px",*/}
                {/*    borderRadius: "4px",*/}
                {/*    cursor: "pointer"*/}
                {/*  }}*/}
                {/*>*/}
                {/*  {torrent.download ? "Pause" : "Start"}*/}
                {/*</button>*/}
                <button
                  onClick={() => handleDeleteTorrent(torrent.id)}
                  style={{
                    backgroundColor: "#b71c1c",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Torrents;
