import { IoMenuOutline } from 'react-icons/io5';
import { MouseEventHandler, useContext, useRef } from 'react';

import Button from '../button/button';
import styles from './header.module.scss';
import Navigation from '../navigation/navigation';
import { NavigationContext } from '@/context/root';
import { useResponsive } from '@/hooks/useResponsive';

type Props = {};

const Header = (props: Props) => {
    const { isOpenNavigation, toggleNavigation, setIsOpenNavigation } = useContext(NavigationContext);
    const ref = useRef<HTMLDivElement>(null);
    const breakpoints = useResponsive([768]);

    const onHideModal = () => {
        setIsOpenNavigation(false);
    };

    const onInner = (e: any) => {
        e.stopPropagation();
    };

    return (
        <header className={styles.header}>
            {breakpoints === 0 && (
                <>
                    <Button
                        onClick={toggleNavigation}
                        activeType="button"
                        icon={IoMenuOutline}
                        size={26}
                        placement="left"
                        variant="defaulted"
                        sx={{ height: '100%', color: 'white' }}
                    />
                    <div
                        style={!isOpenNavigation ? { width: 0, visibility: 'hidden' } : {}}
                        className={`${styles.wrapper_modal}`}
                        onClick={onHideModal}
                        title="wrapper"
                        ref={ref}
                    >
                        <Navigation
                            onClick={onInner}
                            id="ref"
                            style={
                                !isOpenNavigation
                                    ? { transform: 'translateX(-100%)', transition: 'all ease 300ms' }
                                    : { transform: 'translateX(0)', borderRadius: 8, transition: 'all ease 300ms' }
                            }
                        />
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;
