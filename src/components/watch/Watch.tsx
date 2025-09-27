import {FC, useEffect, useMemo, useState, useRef} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import ReactPlayer from "react-player";
import {IconPack} from "../../icons";
import IconButton from "../../ui/icon-button";
import styles from './Watch.module.css';

// Интерфейс для эпизода
export interface Episode {
	name: string;
	url: string;
}

const Watch: FC = () => {
	// --- Refs и хуки навигации ---
	const playerRef = useRef<ReactPlayer>(null);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	// --- Извлечение данных из URL ---
	const token = localStorage.getItem('token');
	const currentUrl = searchParams.get("url") ?? "";
	const seriesParam = searchParams.get("series") ?? "[]";

	// --- Состояния компонента ---
	const [volume, setVolume] = useState<number>(() => {
		const savedVolume = localStorage.getItem('playerVolume');
		return savedVolume !== null ? parseFloat(savedVolume) : 0.8;
	});
	const [duration, setDuration] = useState(0);
	const [isNextUpVisible, setIsNextUpVisible] = useState(false);
	const [isListVisible, setIsListVisible] = useState(false);

	// --- Мемоизированные вычисления ---
	const series = useMemo<Episode[]>(() => {
		try {
			return JSON.parse(decodeURIComponent(seriesParam));
		} catch (error) {
			console.error("Failed to parse series data from URL:", error);
			return [];
		}
	}, [seriesParam]);

	const nextEpisode = useMemo<Episode | null>(() => {
		const currentIndex = series.findIndex(ep => ep.url === currentUrl);
		if (currentIndex !== -1 && currentIndex < series.length - 1) {
			return series[currentIndex + 1];
		}
		return null;
	}, [series, currentUrl]);

	const urlWithToken = useMemo<string>(() => {
		if (!currentUrl || !token) return currentUrl;
		const separator = currentUrl.includes('?') ? '&' : '?';
		return `${currentUrl}${separator}token=${token}`;
	}, [currentUrl, token]);

	// --- Функции-обработчики ---
	const close = () => navigate(`/`, {replace: true});

	const selectEpisode = (episodeUrl: string) => {
		navigate(`?url=${encodeURIComponent(episodeUrl)}&series=${encodeURIComponent(seriesParam)}`, { replace: true });
		setIsListVisible(false);
		setIsNextUpVisible(false);
	};

	// --- Обработчики событий плеера ---
	const handleReady = () => {
		const internalPlayer = playerRef.current?.getInternalPlayer();
		if (internalPlayer) {
			internalPlayer.addEventListener('volumechange', () => {
				if (internalPlayer.volume !== undefined) {
					const newVolume = internalPlayer.volume;
					localStorage.setItem('playerVolume', newVolume.toString());
					setVolume(newVolume);
				}
			});
		}
	};

	const handleEnded = () => {
		if (nextEpisode) {
			selectEpisode(nextEpisode.url);
		}
	};

	const handleDuration = (d: number) => setDuration(d);

	const handleProgress = (progress: { playedSeconds: number }) => {
		const secondsRemaining = duration - progress.playedSeconds;
		if (duration > 0 && secondsRemaining <= 30 && !isNextUpVisible && nextEpisode) {
			setIsNextUpVisible(true);
		}
	};

	// --- Эффекты ---
	useEffect(() => {
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, []);

	// --- Рендер компонента ---
	return (
		<div className={styles.playerWrapper}>
			<ReactPlayer
				ref={playerRef}
				url={urlWithToken}
				volume={volume}
				playing={true}
				controls={true}
				width='100%'
				height='100%'
				onReady={handleReady}
				onEnded={handleEnded}
				onDuration={handleDuration}
				onProgress={handleProgress}
			/>
			<div className={styles.controlsContainer}>
				{series.length > 1 && <IconButton
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

			{isNextUpVisible && nextEpisode && (
				<div className={`${styles.nextUpContainer} ${styles.visible}`}>
					<IconButton
						Icon={IconPack.Cross}
						fill={'#fff'}
						onClick={() => setIsNextUpVisible(false)}
						style={{
							position: 'absolute',
							top: 8,
							right: 8,
							width: 28,
							height: 28,
							padding: 4,
							backgroundColor: 'rgba(255, 255, 255, 0.1)'
						}}
					/>
					<p>Далее</p>
					<h4>{nextEpisode.name}</h4>
					<button
						className={styles.nextUpButton}
						onClick={() => selectEpisode(nextEpisode.url)}
					>
						Запустить сейчас
					</button>
				</div>
			)}
		</div>
	);
};

export default Watch;