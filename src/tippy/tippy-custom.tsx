import Tippy, { TippyProps } from '@tippyjs/react/headless';
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';

type Props = TippyProps & { children: ReactNode };

const TippyCustom = ({ children, ...props }: Props) => {
    const spanRef = useRef<HTMLElement | null>(null);
    const [childRef, setChildRef] = useState<any>(null);

    useEffect(() => {
        if (spanRef.current) {
            setChildRef(spanRef.current?.previousElementSibling);
        }
        return () => setChildRef(null);
    }, []);
    return (
        <Fragment>
            {children}
            {childRef ? <Tippy {...props} reference={childRef} /> : <span ref={spanRef} style={{ display: 'none' }} />}
        </Fragment>
    );
};

export default TippyCustom;
