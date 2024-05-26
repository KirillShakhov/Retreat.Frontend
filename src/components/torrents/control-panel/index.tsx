import {ChangeEvent, FC, useRef, useState} from "react";
import 'react-toastify/dist/ReactToastify.css';

interface ControlPanelProps {
    addMagnet?: (value: string) => void;
    addFile?: (value: File) => void;
}

const ControlPanel: FC<ControlPanelProps> = ({
                                                 addMagnet,
                                                 addFile
                                             }) => {
    const [newTorrent, setNewTorrent] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddTorrent = () => {
        if (newTorrent === '') return
        if (addMagnet) addMagnet(newTorrent);
        setNewTorrent("");
    };

    const handleAddFileTorrent = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (addFile) addFile(file);
        }
    };

    return <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', gap: 10}}>
        <input
            type="text"
            value={newTorrent}
            onChange={(e) => setNewTorrent(e.target.value)}
            placeholder="Add new torrent"
            style={{ flexGrow: 1 }}
        />
        <button onClick={handleAddTorrent}>Add Torrent</button>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleAddFileTorrent}
            style={{display: "none"}}
        />
        <button onClick={() => fileInputRef.current?.click()}>Add File</button>
    </div>
};

export default ControlPanel;