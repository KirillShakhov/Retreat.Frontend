import {FC, useEffect, useState} from "react";
import {addTorrentFile, deleteTorrent, getStreamUrl, Torrent, torrentsService} from "../../services/torrentsService.ts";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TorrentItem from "./torrent-item";
import ControlPanel from "./control-panel";
import {useNavigate} from "react-router-dom";

const Torrents: FC = () => {
	const navigate = useNavigate();

	const [torrents, setTorrents] = useState<Torrent[]>([]);

	useEffect(() => {
		fetchTorrents();

		const interval = setInterval(() => {
			fetchTorrents();
		}, 10000);

		return () => clearInterval(interval);
	});

	const fetchTorrents = () => {
		torrentsService().then((data) => {
			setTorrents(data.data);
		});
	};

	const onDelete = (item: Torrent) => {
		deleteTorrent(item.id).then(() => {
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
		console.log(magnet)
		// addTorrentMagnet(magnet).then(() => {
		//   fetchTorrents();
		// });
	};

	const addFile = (file: File) => {
		addTorrentFile(file).then(() => {
			fetchTorrents();
		});
	};

	const onWatch = (item: Torrent) => {
		navigate(`/watch?url=${getStreamUrl(item.id)}`, {replace: true});
	};


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
				<ControlPanel addMagnet={addMagnet} addFile={addFile}/>
				<div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
					{torrents.map((torrent) => (
						<TorrentItem
							key={torrent.id}
							item={torrent}
							onCopy={onCopy}
							onDelete={onDelete}
							onDownload={onDownload}
							onWatch={onWatch}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export default Torrents;
