import {FC} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {deleteTorrent, FileInfo, getStreamUrl, TorrentInfo} from "../../../services/torrentService.ts";
import {usePalette} from "../../../utils/themes/usePalette.ts";
import ProgressBar from "../../../ui/progress-bar";
import IconButton from "../../../ui/icon-button";
import {IconPack} from "../../../icons";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Episode} from "../../watch/Watch.tsx";

interface TorrentItemProps {
    item: TorrentInfo;
}

const TorrentItem: FC<TorrentItemProps> = ({item}) => {
    const navigate = useNavigate();
    const palette = usePalette();

    const onWatch = (torrentInfo: TorrentInfo, selectedFile: FileInfo) => {
        const seriesData: Episode[] = torrentInfo.files.map(file => ({
            name: file.name,
            url: getStreamUrl(torrentInfo, file),
        }));

        const serializedSeries = JSON.stringify(seriesData);
        const encodedSeries = encodeURIComponent(serializedSeries);

        const currentStreamUrl = getStreamUrl(torrentInfo, selectedFile);
        const encodedCurrentUrl = encodeURIComponent(currentStreamUrl);

        navigate(`/watch?url=${encodedCurrentUrl}&series=${encodedSeries}`, { replace: true });
    };

    const onDownload = (torrentInfo: TorrentInfo, file: FileInfo) => {
        const url = getStreamUrl(torrentInfo, file);
        window.open(url, '_blank')?.focus();
    };

    const onCopy = (torrentInfo: TorrentInfo, file: FileInfo) => {
        const url = getStreamUrl(torrentInfo, file);
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

    const onDelete = (torrentItem: TorrentInfo) => {
        // Добавим подтверждение для безопасности
        if (window.confirm(`Are you sure you want to delete "${torrentItem.name}"?`)) {
            deleteTorrent(torrentItem.id).then(() => {
                toast.info(`Torrent "${torrentItem.name}" deleted.`);
            });
        }
    };

    return (
        <div
            style={{
                background: palette.secondaryColor,
                padding: 20,
                borderRadius: 10,
                color: palette.textColor,
                display: 'flex',
                flexDirection: 'column',
                gap: 20, // Увеличили отступ между элементами
            }}
        >
            {/* --- ЗАГОЛОВОК ТОРРЕНТА --- */}
            <div style={{display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                <h4 style={{margin: 0, wordWrap: 'break-word', wordBreak: 'break-all', paddingRight: '20px'}}>
                    {item.name}
                </h4>
                <IconButton
                    Icon={IconPack.Trash}
                    fill={'#fff'}
                    stroke={'#fff'}
                    onClick={() => onDelete(item)}
                    style={{backgroundColor: "#b71c1c", width: 40, height: 40, padding: 5, flexShrink: 0}}
                />
            </div>

            {/* --- СПИСОК ФАЙЛОВ --- */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
                {item.files.map((file) => (
                    <div
                        key={file.id}
                        style={{
                            border: `1px solid ${palette.primaryColor}`,
                            borderRadius: 8,
                            padding: 15,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        {/* Имя файла и прогресс-бар */}
                        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                            <span style={{wordWrap: 'break-word', wordBreak: 'break-all'}}>{file.name}</span>
                            <ProgressBar progress={file.progress * 100}/> {/* Прогресс обычно от 0 до 1, умножаем на 100 */}
                        </div>

                        {/* Кнопки действий для файла */}
                        <div style={{display: "flex", justifyContent: 'flex-start', gap: "10px", paddingTop: 5}}>
                            <IconButton
                                Icon={IconPack.Tv}
                                fill={'none'}
                                stroke={'#fff'}
                                onClick={() => onWatch(item, file)}
                                style={{backgroundColor: "#1a1a1a", width: 35, height: 35, padding: 5}}
                            />
                            <IconButton
                                Icon={IconPack.Copy}
                                fill={'#fff'}
                                onClick={() => onCopy(item, file)}
                                style={{backgroundColor: "#1a1a1a", width: 35, height: 35, padding: 5}}
                            />
                            <IconButton
                                Icon={IconPack.Download}
                                fill={'none'}
                                stroke={'#fff'}
                                onClick={() => onDownload(item, file)}
                                style={{backgroundColor: "#1a1a1a", width: 35, height: 35, padding: 5}}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TorrentItem;