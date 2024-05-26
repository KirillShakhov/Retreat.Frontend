import React, {FC, ButtonHTMLAttributes, SVGProps, useMemo, useEffect} from 'react';
import {usePalette} from "../../utils/themes/usePalette.ts";
import {useTheme} from "../../utils/themes/useTheme.ts";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	Icon: FC<SVGProps<SVGElement>>;
	iconProps?: React.SVGProps<SVGSVGElement>;
}

const IconButton: FC<IconButtonProps> = ({onClick, label, Icon, iconProps, ...buttonProps}) => {
	const pallete = usePalette();

	const fill = useMemo(() => {
		console.log('pallete.textColor: ' + pallete.textColor)
		return pallete.textColor
	}, [pallete])
	const {theme} = useTheme();

	useEffect(() => {
		console.log('themethemethemethemetheme: ' + theme);
	}, [theme]);

	return (
		<button onClick={onClick} {...buttonProps}
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
