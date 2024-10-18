'use client';

import { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ForwardRefExoticComponent, ReactNode } from 'react';
import styles from './button.module.scss';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { VariantColor } from '@/types/variant-color';

type Props = VariantColor &
    (ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>) & {
        activeType: 'link' | 'button';
        to?: string;
        children?: ReactNode;
        placement?: 'left' | 'right';
        icon?: IconType;
        sx?: CSSProperties;
        size?: number;
    };

const Button = ({ variant, activeType, to, children, placement, icon: Icon, sx, size, ...props }: Props) => {
    const primary = variant === 'primary';
    const secondary = variant === 'secondary';
    const defaulted = variant === 'defaulted';
    const custom = variant === 'custom';
    const error = variant === 'error';
    const dash = variant === 'dash';
    const remove = variant === 'remove';
    const disabled = variant === 'disabled';
    const underline = variant === 'underline';

    const left = placement === 'left';
    const right = placement === 'right';

    if (activeType === 'button') {
        return (
            <button
                {...props}
                style={sx!}
                className={`${styles.wrapper} ${primary && styles.primary} ${secondary && styles.secondary} ${
                    defaulted && styles.defaulted
                } ${dash && styles.dash} ${custom && styles.custom} ${error && styles.error} ${
                    remove && styles.remove
                } ${disabled && styles.disabled} ${underline && styles.underline}`}
            >
                {left && Icon && <Icon size={size} />}
                <span>{children}</span>
                {right && Icon && <Icon size={size} />}
            </button>
        );
    } else if (activeType === 'link') {
        return (
            <Link
                style={sx!}
                href={to!}
                {...props}
                className={`${styles.wrapper} ${primary && styles.primary} ${secondary && styles.secondary} ${
                    custom && styles.custom
                } ${remove && styles.remove} ${disabled && styles.disabled} ${underline && styles.underline}`}
            >
                {left && Icon && <Icon size={size} />}
                <span>{children}</span>
                {right && Icon && <Icon size={size} />}
            </Link>
        );
    } else {
        <button
            style={sx!}
            {...props}
            className={`${styles.wrapper} ${primary && styles.primary} ${secondary && styles.secondary} ${
                defaulted && styles.defaulted
            } ${custom && styles.custom} ${remove && styles.remove} ${disabled && styles.disabled} ${
                underline && styles.underline
            }`}
        >
            {left && Icon && <Icon size={size} />}
            <span>{children}</span>
            {right && Icon && <Icon size={size} />}
        </button>;
    }
};

export default Button;
