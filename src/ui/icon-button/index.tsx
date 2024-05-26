import React, {FC, ButtonHTMLAttributes, SVGProps} from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    Icon: FC<SVGProps<SVGElement>>;
    iconProps?: React.SVGProps<SVGSVGElement>;
}

const IconButton: FC<IconButtonProps> = ({onClick, label, Icon, iconProps, ...buttonProps}) => {
    return (
        <button onClick={onClick} {...buttonProps}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10, ...buttonProps.style
                }}>
            {label}
            <Icon width={25} height={25} fill={'#fff'} stroke={'#fff'} {...iconProps} />
        </button>
    );
};

export default IconButton;
