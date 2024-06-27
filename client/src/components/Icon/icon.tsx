import React from 'react';
import classNames from 'classnames'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

export type ThemeProps = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark' |
"blue"| "indigo" | "purple" | "pink" | "red" | "gloryRed" | "orange" | "yellow" | "green" | "teal" | "cyan" | "white"

export interface IconProps extends FontAwesomeIconProps {
    /** 图标颜色 */
    theme?: ThemeProps,
    /** 图标是否旋转 */
    spin?:boolean,
}

const Icon: React.FC<IconProps> = (props) => {
    const { icon='spinner',
    spin=false,
    className, theme, ...restProps} = props
    const classes = classNames('gr-icon', className, {
        [`icon-${theme}`]:theme
    })
    return(
        <FontAwesomeIcon icon={icon} className={classes} {...restProps} spin={spin}/>
    )
}

export default Icon