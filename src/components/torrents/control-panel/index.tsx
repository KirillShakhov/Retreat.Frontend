import {ChangeEvent, FC, useRef, useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {IconPack} from "../../../icons";
import IconButton from "../../../ui/icon-button";
import {toast} from "react-toastify";

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
        if (newTorrent === '') {
            toast.error('URL field is empty!', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return
        }
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
            style={{flexGrow: 1}}
        />
        <IconButton
            onClick={handleAddTorrent}
            label="Add Magnet"
            Icon={IconPack.Magnet}
        />
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleAddFileTorrent}
            style={{display: "none"}}
        />
        <IconButton
            onClick={() => fileInputRef.current?.click()}
            label="Torrent File"
            Icon={IconPack.FileUpload}
        />
    </div>
};

export default ControlPanel;
