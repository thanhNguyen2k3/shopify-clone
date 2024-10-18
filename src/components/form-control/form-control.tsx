import { RiErrorWarningLine } from 'react-icons/ri';
import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { GoQuestion } from 'react-icons/go';

import styles from './form-control.module.scss';
import TippyCustom from '@/tippy/tippy-custom';

type NumericProps = InputHTMLAttributes<HTMLInputElement> & {};

type Props = InputHTMLAttributes<HTMLInputElement> &
    TextareaHTMLAttributes<HTMLTextAreaElement> &
    SelectHTMLAttributes<HTMLSelectElement> & {
        editor?: boolean;
        label?: string;
        textError?: string;
        uploadForm?: boolean;
        children?: ReactNode;
        selected?: boolean;
        data?: any[];
        setState?: any;
        format?: boolean;
        numericProps?: NumericProps;
        errorMessage?: string[];
        question?: string;
    };

const FormControl = ({
    label,
    uploadForm,
    children,
    selected,
    data,
    setState,
    value,
    format,
    numericProps,
    errorMessage,
    question,
    editor,
    ...props
}: Props) => {
    if (editor) {
        return (
            <div className={styles.form_control}>
                {label && (
                    <label htmlFor={label} className={styles.label}>
                        {label}
                    </label>
                )}

                <div className={styles.wrapper}>
                    {question && (
                        <TippyCustom
                            placement="bottom-start"
                            interactive
                            render={(attrs) => (
                                <div {...attrs} tabIndex={-1} className={styles.box_questtion}>
                                    {question}
                                </div>
                            )}
                        >
                            <div className={styles.question}>
                                <GoQuestion />
                            </div>
                        </TippyCustom>
                    )}
                    {children}
                </div>

                {errorMessage && (
                    <p className={styles.text_error}>
                        <RiErrorWarningLine /> <span>{errorMessage}</span>
                    </p>
                )}
            </div>
        );
    } else if (uploadForm) {
        return (
            <div className={styles.form_control}>
                {label && (
                    <label htmlFor={label} className={styles.label}>
                        {label}
                    </label>
                )}

                <div className={styles.wrapper}>
                    {question && (
                        <TippyCustom
                            placement="bottom-start"
                            interactive
                            render={(attrs) => (
                                <div {...attrs} tabIndex={-1} className={styles.box_questtion}>
                                    {question}
                                </div>
                            )}
                        >
                            <div className={styles.question}>
                                <GoQuestion />
                            </div>
                        </TippyCustom>
                    )}
                    {children}
                </div>
            </div>
        );
    } else if (selected) {
        return (
            <div className={styles.form_control}>
                {label && (
                    <label htmlFor={label} className={styles.label}>
                        {label}
                    </label>
                )}

                <div className={styles.wrapper}>
                    {question && (
                        <TippyCustom
                            placement="bottom-start"
                            interactive
                            render={(attrs) => (
                                <div {...attrs} tabIndex={-1} className={styles.box_questtion}>
                                    {question}
                                </div>
                            )}
                        >
                            <div className={styles.question}>
                                <GoQuestion />
                            </div>
                        </TippyCustom>
                    )}
                    <select {...props} className={styles.selected_box}>
                        {children}
                    </select>
                </div>

                {errorMessage && (
                    <p className={styles.text_error}>
                        <RiErrorWarningLine /> <span>{errorMessage}</span>
                    </p>
                )}
            </div>
        );
    } else if (format) {
        return (
            <div className={styles.form_control}>
                {label && (
                    <label htmlFor={label} className={styles.label}>
                        {label}
                    </label>
                )}
                <div className={styles.wrapper}>
                    {question && (
                        <TippyCustom
                            placement="bottom-start"
                            interactive
                            render={(attrs) => (
                                <div {...attrs} tabIndex={-1} className={styles.box_questtion}>
                                    {question}
                                </div>
                            )}
                        >
                            <div className={styles.question}>
                                <GoQuestion />
                            </div>
                        </TippyCustom>
                    )}
                    {children}
                </div>
                {errorMessage && (
                    <p className={styles.text_error}>
                        <RiErrorWarningLine /> <span>{errorMessage}</span>
                    </p>
                )}
            </div>
        );
    } else {
        return (
            <div className={styles.form_control}>
                {label && (
                    <label htmlFor={label} className={styles.label}>
                        {label}
                    </label>
                )}

                <div className={styles.wrapper}>
                    <input {...props} className={`${styles.input} ${errorMessage && styles.error}`} />
                    {question && (
                        <TippyCustom
                            placement="bottom-start"
                            interactive
                            render={(attrs) => (
                                <div {...attrs} tabIndex={-1} className={styles.box_questtion}>
                                    {question}
                                </div>
                            )}
                        >
                            <div className={styles.question}>
                                <GoQuestion />
                            </div>
                        </TippyCustom>
                    )}
                </div>

                {children && children}

                {errorMessage && (
                    <p className={styles.text_error}>
                        <RiErrorWarningLine /> <span>{errorMessage}</span>
                    </p>
                )}
            </div>
        );
    }
};

export default FormControl;
