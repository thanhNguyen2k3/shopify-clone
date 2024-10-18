import React, { Dispatch, SetStateAction } from 'react';

import Dialog from '@mui/material/Dialog';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import styled from '@emotion/styled';

const StyledDialog = styled(Dialog)`
    .css-1t1j96h-MuiPaper-root-MuiDialog-paper {
        max-width: none;
    }
`;

type Props = {
    children: React.ReactNode;
    isState?: boolean;
    setIsState?: Dispatch<SetStateAction<boolean>>;
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AnimationModal = ({ children, isState, setIsState }: Props) => {
    const handleClose = () => {
        setIsState!(false);
    };

    return (
        <StyledDialog
            open={isState!}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            {children}
        </StyledDialog>
    );
};

export default AnimationModal;
