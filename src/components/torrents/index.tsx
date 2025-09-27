import { FC, useEffect, useState } from "react";
import {
	addTorrentFile,
	addTorrentMagnet,
	deleteTorrent,
	getStreamUrl,
	getTorrents,
	TorrentInfo,
} from "../../services/torrentService.ts";
import 'react-toastify/dist/ReactToastify.css';
import TorrentItem from "./torrent-item";
import ControlPanel from "./control-panel";
import { useNavigate } from "react-router-dom";
import AddTorrentModal, { FileNode } from "../modals/add-torrent/index.tsx";
import { usePopupController } from "../../utils/popup/PopupControllerContextType.tsx";

const Torrents: FC = () => {
	const navigate = useNavigate();
	const popupController = usePopupController();
	const [torrents, setTorrents] = useState<TorrentInfo[]>([]);

	const fetchTorrents = () => {
		getTorrents().then((data) => {
			setTorrents(data?.data ?? []);
		});
	};

	useEffect(() => {
		fetchTorrents();

		const interval = setInterval(() => {
			fetchTorrents();
		}, 5000);

		return () => clearInterval(interval);
	}, []);

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


	{/* <AddTorrentModal
				onClose={function (): void {
					console.log("onClose");
				}} onAdd={function (torrentName: string, selectedFiles: string[]): void {
					console.log(`AddTorrentModal ${torrentName} ${JSON.stringify(selectedFiles)}`);
				}}
			/> */}

	return (
		<>
			<div style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				gap: 20,
				padding: '1rem',
				paddingBottom: 100,
				boxSizing: 'border-box',
			}}>
				<h1>Torrents</h1>
				<button onClick={() => {
					const files: FileNode[] = [
						{ id: '0', name: 'File 1' },
						{ id: '1', name: 'File 2' },
						{ id: '2', name: 'File 3' },
						{ id: '3', name: 'Folder', children: [{ id: '31', name: 'File 1' },{ id: '32', name: 'File 2' }] },
						{ id: '4', name: 'File 4' },
					];
					popupController.open(AddTorrentModal, {
						name: "Default Torrent Name", files, onAdd: () => {
							console.log('add torrent');
						},
						onClose: () => {
							console.log('close modal');
						}
					});
				}} >Test</button>
				<ControlPanel addMagnet={addMagnet} addFile={addFile} />
				<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
					{torrents.map((torrent) => (
						<TorrentItem
							key={torrent.id}
							item={torrent}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export default Torrents;
