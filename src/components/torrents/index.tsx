import { FC, useEffect, useState } from "react";
import {
	addTorrentFile,
	addTorrentMagnet,
	getTorrents,
	TorrentInfo,
} from "../../services/torrentService.ts";
import 'react-toastify/dist/ReactToastify.css';
import TorrentItem from "./torrent-item";
import ControlPanel from "./control-panel";

const Torrents: FC = () => {
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
