import {FC} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {Torrent} from "../../../services/torrentsService.ts";
import {usePalette} from "../../../utils/themes/usePalette.ts";
import ProgressBar from "../../../ui/progress-bar";
import IconButton from "../../../ui/icon-button";
import {IconPack} from "../../../icons";


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

	const palette = usePalette();

	return (
		<div
			style={{
				background: palette.secondaryColor,
				padding: 20,
				borderRadius: 10,
				color: palette.textColor,
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
			}}
		>
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
				<h3>Name: {item.name}</h3>
				<div style={{display: "flex", gap: "10px"}}>
					<IconButton
						Icon={IconPack.Tv}
						fill={'none'}
						stroke={'#fff'}
						onClick={() => {

						}}
						style={{backgroundColor: "#1a1a1a", width: 40, height: 40, padding: 5}}
					/>
					<IconButton
						Icon={IconPack.Copy}
						fill={'#fff'}
						onClick={() => {
							if (onCopy) onCopy(item)
						}}
						style={{backgroundColor: "#1a1a1a", width: 40, height: 40, padding: 5}}
					/>
					<IconButton
						Icon={IconPack.Download}
						fill={'none'}
						stroke={'#fff'}
						onClick={() => {
							if (onDownload) onDownload(item)
						}}
						style={{backgroundColor: "#1a1a1a", width: 40, height: 40, padding: 5}}
					/>
					<IconButton
						Icon={IconPack.Trash}
						fill={'#fff'}
						stroke={'#fff'}
						onClick={() => {
							if (onDelete) onDelete(item)
						}}
						style={{backgroundColor: "#b71c1c", width: 40, height: 40, padding: 5}}
					/>
				</div>
			</div>
			<ProgressBar progress={item.progress}/>
		</div>
	);
};

export default TorrentItem;
