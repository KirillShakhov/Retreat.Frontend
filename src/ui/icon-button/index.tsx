import React, {FC, ButtonHTMLAttributes, SVGProps } from 'react';
import {usePalette} from "../../utils/themes/usePalette.ts";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label?: string;
	Icon: FC<SVGProps<SVGElement>>;
	fill?: string;
	stroke?: string;
	iconProps?: React.SVGProps<SVGSVGElement>;
}

const IconButton: FC<IconButtonProps> = ({onClick, label, fill, stroke, Icon, iconProps, ...buttonProps}) => {
	const pallete = usePalette();

	return (
		<button
			onClick={onClick}
			{...buttonProps}
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 10,
				padding: 10,
				...buttonProps.style
			}}>
			{label}
			<Icon width={25} height={25} fill={fill ?? pallete.textColor} stroke={stroke ?? pallete.textColor} {...iconProps} />
		</button>
	);
};

export default IconButton;
