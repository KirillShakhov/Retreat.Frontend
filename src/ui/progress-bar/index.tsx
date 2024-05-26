import {FC} from 'react';
import {usePalette} from "../../utils/themes/usePalette.ts";

interface ProgressBarProps {
	progress: number;
}

const ProgressBar: FC<ProgressBarProps> = ({progress}) => {
	const palette = usePalette();

	return (
		<div
			style={{
				background: palette.placeholderColor,
				borderRadius: "4px",
				width: "100%",
				overflow: "hidden"
			}}
		>
			<div
				style={{
					background: "#646cff",
					width: `${progress}%`,
					height: "10px",
					borderRadius: "4px"
				}}
			/>
		</div>
	);
};

export default ProgressBar;
