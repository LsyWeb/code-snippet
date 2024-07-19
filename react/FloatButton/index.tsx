import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { useContext } from 'react';
import styles from './index.less';
import { Tooltip } from 'antd';
import FloatButtonGroupContext from './context';
import FloatButtonGroup from './FloatButtonGroup';
import BackTop from './BackTop';

type FloatButtonProps = {
  icon: ReactNode;
  type?: 'primary' | 'default';
  shape?: FloatButtonShape;
  href?: string;
  target?: string;
  tooltip?: string;
  style?: CSSProperties;
  onClick?: (event: MouseEvent) => void;
};
export type FloatButtonShape = 'circle' | 'square';

const FloatButton = ({
  icon,
  type = 'default',
  shape = 'circle',
  tooltip,
  href,
  target,
  style,
  onClick,
}: FloatButtonProps) => {
  const primaryColor = '#818BFF';
  const groupContext = useContext(FloatButtonGroupContext);
  const mergeShape = groupContext;

  const groupWrapperStyle: CSSProperties = {
    position: 'static',
    padding: mergeShape === 'circle' ? 0 : 4,
    border: mergeShape === 'circle' ? 'none' : '1px solid #efefef',
    borderRadius: 0,
  };

  const getClassName = (obj: Object) => {
    let className = '';
    for (const key in obj) {
      if (obj[key]) {
        className += ` ${key}`;
      }
    }
    return className;
  };
  const floatButtonClassName = () => {
    return getClassName({
      'float-button': true,
      'float-button-circle': shape === 'circle',
      'float-button-primary': type === 'primary',
      'float-button-default': type === 'default',
    });
  };

  const floatButtonStyle = () => {
    let bg = '';
    if (mergeShape === 'square') {
      bg = 'none';
    } else {
      if (type === 'default') {
        bg = '#fff';
      } else {
        bg = primaryColor;
      }
    }
    return {
      background: bg,
    };
  };

  return (
    <Tooltip title={tooltip} placement="left">
      <div
        className={styles.floatButtonContainer}
        style={{
          borderRadius: shape === 'circle' ? '50%' : 0,
          ...(mergeShape ? groupWrapperStyle : {}),
          ...style,
        }}
        onClick={onClick}
      >
        <div className={floatButtonClassName()} style={floatButtonStyle()}>
          {href ? (
            <a className="float-button-link" href={href} target={target}>
              <div className="float-button-icon">{icon}</div>
            </a>
          ) : (
            <div
              className="float-button-icon"
              style={{ color: type === 'primary' ? '#fff' : '#000' }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    </Tooltip>
  );
};

FloatButton.BackTop = BackTop;
FloatButton.Group = FloatButtonGroup;

export default FloatButton;
