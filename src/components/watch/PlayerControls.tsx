import {FC} from 'react';
import {IconPack} from '../../icons';
import IconButton from '../../ui/icon-button';
import styles from './PlayerControls.module.css';

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh > 0) {
        return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm.toString().padStart(2, '0')}:${ss}`;
};

interface PlayerControlsProps {
    playing: boolean;
    muted: boolean;
    volume: number;
    played: number;
    duration: number;
    onPlayPause: () => void;
    onMute: () => void;
    onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSeekMouseUp: (e: React.MouseEvent<HTMLInputElement>) => void;
    onSeekMouseDown: () => void;
    onFullscreen: () => void;
}

const PlayerControls: FC<PlayerControlsProps> = (props) => {
    const {
        playing, muted, volume, played, duration, onPlayPause, onMute,
        onVolumeChange, onSeek, onSeekMouseDown, onSeekMouseUp, onFullscreen
    } = props;

    const playedTime = formatTime(duration * played);
    const totalTime = formatTime(duration);

    // Для заполнения прогресс-бара
    const progressBarFill = {
        '--progress': played // Передаем прогресс через CSS переменную
    } as React.CSSProperties; // TypeScript-подсказка

    return (
        <div className={styles.controlsWrapper}>
            {/* Таймлайн */}
            <input
                type="range"
                min={0}
                max={0.999999}
                step="any"
                value={played}
                onMouseDown={onSeekMouseDown}
                onChange={onSeek}
                onMouseUp={onSeekMouseUp}
                className={styles.progressBar}
                style={progressBarFill} // Применяем переменную для заполнения
            />

            {/* Нижняя панель с кнопками */}
            <div className={styles.bottomControls}>
                <div className={styles.leftControls}>
                    <IconButton
                        Icon={playing ? IconPack.Pause : IconPack.Play}
                        onClick={onPlayPause}
                        fill={'#fff'}
                        stroke={'none'}
                        className={styles.iconButton} // <--- Добавлено
                    />
                    <IconButton
                        Icon={muted ? IconPack.Mute : IconPack.Volume}
                        onClick={onMute}
                        fill={'#fff'}
                        stroke={'none'}
                        className={styles.iconButton} // <--- Добавлено
                    />
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step="any"
                        value={volume}
                        onChange={onVolumeChange}
                        className={styles.volumeSlider}
                    />
                </div>
                <div className={styles.rightControls}>
                    <span className={styles.timeDisplay}>{playedTime} / {totalTime}</span>
                    <IconButton
                        Icon={IconPack.Fullscreen}
                        onClick={onFullscreen}
                        fill={'#fff'}
                        stroke={'none'}
                        className={styles.iconButton} // <--- Добавлено
                    />
                </div>
            </div>
        </div>
    );
};

export default PlayerControls;