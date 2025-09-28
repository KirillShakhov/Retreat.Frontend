import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { IconPack } from "../../icons";
import IconButton from "../../ui/icon-button";
import { toast } from "react-toastify";

interface ControlPanelProps {
	addMagnet?: (value: string) => void;
	addFile?: (value: File) => void;
}

const ControlPanel: FC<ControlPanelProps> = ({ addMagnet, addFile }) => {
	const [newTorrent, setNewTorrent] = useState<string>("");
	const [isCompact, setIsCompact] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const controlPanelRef = useRef<HTMLDivElement>(null);

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
			return;
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

	useEffect(() => {
		const handleResize = () => {
			if (controlPanelRef.current) {
				const panelWidth = controlPanelRef.current.offsetWidth;
				if (panelWidth < 600) { // Adjust the value as needed
					setIsCompact(true);
				} else {
					setIsCompact(false);
				}
			}
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div ref={controlPanelRef} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: 10 }}>
			<input
				type="text"
				value={newTorrent}
				onChange={(e) => setNewTorrent(e.target.value)}
				placeholder="magnet:?xt=..."
				style={{ flexGrow: 1, minWidth: 100, width: 0  }}
			/>
			<IconButton
				onClick={handleAddTorrent}
				label={isCompact ? "" : "Add Magnet"}
				Icon={IconPack.Magnet}
			/>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleAddFileTorrent}
				style={{ display: "none" }}
			/>
			<IconButton
				onClick={() => fileInputRef.current?.click()}
				label={isCompact ? "" : "Torrent File"}
				Icon={IconPack.FileUpload}
			/>
		</div>
	);
};

export default ControlPanel;
