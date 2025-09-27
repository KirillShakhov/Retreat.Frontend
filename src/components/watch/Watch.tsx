import {FC, useEffect, useMemo, useState, useRef} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import ReactPlayer from "react-player";
import screenfull from "screenfull"; // Для полноэкранного режима
import {IconPack} from "../../icons";
import IconButton from "../../ui/icon-button";
import styles from './Watch.module.css';
import PlayerControls from "./PlayerControls";

export interface Episode {
	name: string;
	url: string;
}

const Watch: FC = () => {
	// --- Refs и хуки навигации ---
	const playerRef = useRef<ReactPlayer>(null);
	const playerContainerRef = useRef<HTMLDivElement>(null); // Ref для контейнера плеера
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	// --- Извлечение данных из URL ---
	const token = localStorage.getItem('token');
	const currentUrl = searchParams.get("url") ?? "";
	const seriesParam = searchParams.get("series") ?? "[]";

	// --- Состояния для логики плеера ---
	const [duration, setDuration] = useState(0);
	const [isNextUpVisible, setIsNextUpVisible] = useState(false);
	const [isListVisible, setIsListVisible] = useState(false);

	// --- Новые состояния для UI контролов ---
	const [playing, setPlaying] = useState(true);
	const [muted, setMuted] = useState(false);
	const [volume, setVolume] = useState<number>(() => {
		const savedVolume = localStorage.getItem('playerVolume');
		return savedVolume !== null ? parseFloat(savedVolume) : 0.8;
	});
	const [played, setPlayed] = useState(0);
	const [seeking, setSeeking] = useState(false);

	// --- Мемоизированные вычисления ---
	const series = useMemo<Episode[]>(() => {
		try { return JSON.parse(decodeURIComponent(seriesParam)); }
		catch (e) { console.error("Failed to parse series data:", e); return []; }
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
		setPlayed(0); // Сбрасываем прогресс для новой серии
	};

	// --- Новые обработчики для UI ---
	const handlePlayPause = () => setPlaying(!playing);
	const handleMute = () => setMuted(!muted);

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		localStorage.setItem('playerVolume', newVolume.toString());
	};

	const handleSeekMouseDown = () => setSeeking(true);
	const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
		setSeeking(false);
		playerRef.current?.seekTo(parseFloat(e.currentTarget.value));
	};
	const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPlayed(parseFloat(e.target.value));
	};

	const handleFullscreen = () => {
		if (screenfull.isEnabled && playerContainerRef.current) {
			screenfull.toggle(playerContainerRef.current);
		}
	};

	// --- Обработчики событий плеера ---
	const handleReady = () => {
		// Логика для сохранения громкости (без изменений)
	};

	const handleEnded = () => {
		if (nextEpisode) {
			selectEpisode(nextEpisode.url);
		} else {
			setPlaying(false); // Останавливаем проигрывание, если это последняя серия
		}
	};

	const handleDuration = (d: number) => setDuration(d);

	const handleProgress = (state: { played: number, playedSeconds: number }) => {
		if (!seeking) {
			setPlayed(state.played);
		}
		const secondsRemaining = duration - state.playedSeconds;
		if (duration > 0 && secondsRemaining <= 30 && !isNextUpVisible && nextEpisode) {
			setIsNextUpVisible(true);
		}
	};

	// --- Эффекты ---
	useEffect(() => {
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => { document.body.style.overflow = originalOverflow; };
	}, []);

	// --- Рендер компонента ---
	return (
		<div ref={playerContainerRef} className={`${styles.playerWrapper} player-container`}>
			<ReactPlayer
				ref={playerRef}
				url={urlWithToken}
				volume={volume}
				playing={playing}
				muted={muted}
				controls={false} // <--- ВАЖНО: отключаем стандартные контролы
				width='100%'
				height='100%'
				onReady={handleReady}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
				onEnded={handleEnded}
				onDuration={handleDuration}
				onProgress={handleProgress}
			/>

			{/* --- UI Элементы --- */}
			<div className={styles.controlsContainer}>
				{series.length > 1 && <IconButton
					Icon={IconPack.List}
					fill={'#fff'} stroke={'none'}
					onClick={() => setIsListVisible(!isListVisible)}
					className={styles.iconButton}
					style={{width: 40, height: 40, padding: 5}}
				/>}
				<IconButton
					Icon={IconPack.Cross}
					fill={'#fff'} stroke={'none'}
					onClick={close}
					className={styles.iconButton}
					style={{width: 40, height: 40, padding: 5}}
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
						// Изменено: теперь используется className для IconButton
						className={styles.iconButton}
						style={{
							position: 'absolute',
							top: 8,
							right: 8,
							width: 28,
							height: 28,
							padding: 4,
							// backgroundColor: 'rgba(255, 255, 255, 0.1)' // Удалено, теперь в CSS-модуле
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

			{/* --- Наши кастомные контролы --- */}
			<PlayerControls
				playing={playing}
				muted={muted}
				volume={volume}
				played={played}
				duration={duration}
				onPlayPause={handlePlayPause}
				onMute={handleMute}
				onVolumeChange={handleVolumeChange}
				onSeek={handleSeekChange}
				onSeekMouseDown={handleSeekMouseDown}
				onSeekMouseUp={handleSeekMouseUp}
				onFullscreen={handleFullscreen}
			/>
		</div>
	);
};

export default Watch;