import {FC, useEffect, useMemo, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import ReactPlayer from "react-player";
import {IconPack} from "../../icons";
import IconButton from "../../ui/icon-button";
import styles from './Watch.module.css';

// Интерфейс можно оставить здесь или вынести в отдельный файл
export interface Episode {
	name: string;
	url: string;
}

const Watch: FC = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = localStorage.getItem('token');

	// 1. Получаем данные напрямую из URL
	const currentUrl = searchParams.get("url") ?? "";
	const seriesParam = searchParams.get("series") ?? "[]";

	// 2. Десериализуем и парсим данные о сериях
	const series = useMemo<Episode[]>(() => {
		try {
			// decodeURIComponent -> возвращает исходную строку из URL-безопасной
			// JSON.parse -> превращает строку обратно в массив объектов
			return JSON.parse(decodeURIComponent(seriesParam));
		} catch (error) {
			console.error("Failed to parse series data from URL:", error);
			return []; // В случае ошибки возвращаем пустой массив
		}
	}, [seriesParam]);

	const [isListVisible, setIsListVisible] = useState(false);

	const close = () => navigate(`/`, {replace: true});

	const selectEpisode = (episodeUrl: string) => {
		// Просто обновляем URL, параметр `series` остаётся тем же
		navigate(`?url=${encodeURIComponent(episodeUrl)}&series=${encodeURIComponent(seriesParam)}`, { replace: true });
		setIsListVisible(false);
	}

	useEffect(() => {
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, []);

	const urlWithToken = useMemo<string>(() => {
		if (!currentUrl || !token) return currentUrl;
		const separator = currentUrl.includes('?') ? '&' : '?';
		return `${currentUrl}${separator}token=${token}`;
	}, [currentUrl, token]);

	return (
		<div className={styles.playerWrapper}>
			<ReactPlayer
				url={urlWithToken}
				playing={true}
				controls={true}
				width='100%'
				height='100%'
			/>
			<div className={styles.controlsContainer}>
				{series.length > 0 && <IconButton
					Icon={IconPack.List}
					fill={'#fff'}
					onClick={() => setIsListVisible(!isListVisible)}
					style={{backgroundColor: "rgba(255,255,255,0.1)", width: 40, height: 40, padding: 5}}
				/>}
				<IconButton
					Icon={IconPack.Cross}
					fill={'#fff'}
					onClick={close}
					style={{backgroundColor: "rgba(255,255,255,0.1)", width: 40, height: 40, padding: 5}}
				/>
			</div>

			<div className={`${styles.episodesPanel} ${isListVisible ? styles.visible : ''}`}>
				<h3>Серии</h3>
				<ul className={styles.episodesList}>
					{series.map((episode) => (
						<li
							key={episode.url}
							className={`${styles.episodeItem} ${currentUrl === episode.url ? styles.active : ''}`}
							onClick={() => selectEpisode(episode.url)}
						>
							{episode.name}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Watch;