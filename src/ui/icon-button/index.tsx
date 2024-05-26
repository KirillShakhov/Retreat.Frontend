import React, {FC, ButtonHTMLAttributes, SVGProps, useMemo } from 'react';
import {usePalette} from "../../utils/themes/usePalette.ts";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	Icon: FC<SVGProps<SVGElement>>;
	iconProps?: React.SVGProps<SVGSVGElement>;
}

const IconButton: FC<IconButtonProps> = ({onClick, label, Icon, iconProps, ...buttonProps}) => {
	const pallete = usePalette();

	const fill = useMemo(() => {
		return pallete.textColor
	}, [pallete])

	return (
		<button
			onClick={onClick}
			{...buttonProps}
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				...buttonProps.style
			}}>
			{label}
			<Icon width={25} height={25} fill={fill} stroke={fill} {...iconProps} />
		</button>
	);
};

export default IconButton;
