import Tooltip from '@mui/material/Tooltip';
import { IconType } from 'react-icons';
import { IoIosArrowDown } from 'react-icons/io';
import { IoCheckmark } from 'react-icons/io5';

import TippyCustom from '@/tippy/tippy-custom';
import styles from './popper-arrange.module.scss';
import Checkbox from '../checkbox/checkbox';

type Props = {
    labels?: any[];
    title?: string;
    icon?: IconType;
    text?: string;
    arrow?: boolean;
    type?: 'view' | 'label';
    heading?: string;
};

const PopperArrange = ({ labels, title, text, icon, arrow, type, heading }: Props) => {
    const Icon = icon as IconType;

    return (
        <TippyCustom
            trigger="click"
            interactive
            placement="bottom-end"
            offset={[8, 12]}
            render={(attrs) => (
                <div className={styles.wrapper_arrange} {...attrs}>
                    {heading && <h1>{heading}</h1>}

                    <ul className={styles.arrange_list}>
                        {type === 'view'
                            ? labels?.map((label) => {
                                  const LabelIcon = label?.icon;
                                  return (
                                      <li key={label.id}>
                                          <div className={`${styles.label}`}>
                                              <div className={`${styles.label_icon}`}>
                                                  <LabelIcon />
                                              </div>
                                              <div className={styles.label_title}>{label.title}</div>
                                          </div>
                                      </li>
                                  );
                              })
                            : labels?.map((label) => (
                                  <li key={label.id}>
                                      <div className={styles.label}>
                                          <Checkbox type={label.type} checkboxType={label.type} title={label.title} />
                                          {/* <div className={styles.label_title}>{label.title}</div> */}
                                      </div>
                                  </li>
                              ))}
                    </ul>
                </div>
            )}
        >
            <Tooltip title={title} arrow placement="top">
                <div className={styles.wrapper_search}>
                    {text && <span>{text}</span>}
                    {icon && <Icon size={18} />}
                    {arrow && <IoIosArrowDown />}
                </div>
            </Tooltip>
        </TippyCustom>
    );
};

export default PopperArrange;
