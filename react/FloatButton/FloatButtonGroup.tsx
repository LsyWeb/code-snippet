import type { ReactNode, CSSProperties } from 'react';
import type { FloatButtonShape } from '.';
import { FloatButtonGroupProvider } from './context';
import styles from './index.less';
type GroupProps = {
  children: ReactNode;
  shape?: FloatButtonShape;
};

const Group = ({ shape = 'circle', children }: GroupProps) => {
  const groupSquareStyle: CSSProperties = {
    background: '#fff',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  };

  return (
    <FloatButtonGroupProvider value={shape}>
      <div className={styles.floatButtonGroup} style={shape === 'square' ? groupSquareStyle : {}}>
        {children}
      </div>
    </FloatButtonGroupProvider>
  );
};

export default Group;
