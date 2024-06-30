
import {ButtonHTMLAttributes,AnchorHTMLAttributes,FC,RefObject, ClassAttributes, forwardRef} from "react";
import classNames from "classnames";
export type ButtonSize ='lrg' | 'sml' | 'default'

export type ButtonTypes = "primary" | "default" | 'danger' | 'link' | "green" | 'blue' | 'red'

export interface IBaseButtonProps {
    /** 类名 */
    className?: string;
    /** 是否禁用 */
    disabled: boolean;
    /** 尺寸 */
    size?: ButtonSize;
    /** 类型 */
    btnType?: ButtonTypes;
    /** 链接 */
    href?: string;
    /** 是否有阴影 */
    hasShadow:boolean,
    /** 子项 */
    children?:React.ReactNode,
    /** 是否被选中 */
    isChecked?:boolean,
}
type NativeButtonProps = IBaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement> 
type AnchorButtonProps = IBaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement> 
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>
export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        disabled = false,
        btnType = 'default',
        children = '按钮',
        hasShadow = false,
        size = 'default',
        isChecked,
        className,
        href,
        ...restProps
    } = props;
    const classes = classNames('btn',className,{
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        'btn-shadow':hasShadow,
        'btn-checked':isChecked,
        'disabled': (btnType=== 'link') && disabled
    })
    if (btnType === 'link' && href){
        return(
            <a
                className={classes}
                href={href}
                ref={ref as React.Ref<HTMLAnchorElement>}
                {...restProps}
            >
                {children}
            </a>
        )
    }else{
        return(
            <button 
                className={classes}
                disabled={disabled}
                ref={ref as React.Ref<HTMLButtonElement>}
                {...restProps}
            >
                {children}
            </button>
        )
    }
})

export default Button;