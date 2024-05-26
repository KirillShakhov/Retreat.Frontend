import {FC} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {Torrent} from "../../../services/torrentsService.ts";


interface TorrentItemProps {
    item: Torrent;
    onCopy?: (item: Torrent) => void;
    onDownload?: (item: Torrent) => void;
    onDelete?: (item: Torrent) => void;
}

const TorrentItem: FC<TorrentItemProps> = ({
                                               item,
                                               onCopy,
                                               onDelete,
                                               onDownload
                                           }) => {

    return (
        <div
            key={item.id}
            style={{
                background: "#333",
                padding: "10px",
                borderRadius: "6px",
                color: "#fff"
            }}
        >
            <div>Name: {item.name}</div>
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
                            width: `${item.progress}%`,
                            height: "10px",
                            borderRadius: "4px"
                        }}
                    />
                </div>
                <span>{item.progress}%</span>
            </div>
            <div>Time: {new Date(item.time).toLocaleString()}</div>
            <div style={{marginTop: "10px", display: "flex", gap: "10px"}}>
                <button
                    onClick={() => {
                        if (onCopy) onCopy(item)
                    }}
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
                    onClick={() => {
                        if (onDownload) onDownload(item)
                    }}
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
                    onClick={() => {
                        if (onDelete) onDelete(item)
                    }}
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
    );
};

export default TorrentItem;
