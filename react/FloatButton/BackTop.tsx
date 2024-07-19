import { ArrowUpOutlined } from '@ant-design/icons';
import FloatButton from '.';

type BackTopProps = {
  target?: HTMLElement | (() => HTMLElement);
};

const BackTop = ({ target }: BackTopProps) => {
  return (
    <FloatButton
      icon={<ArrowUpOutlined />}
      tooltip="返回顶部"
      onClick={() => {
        if (!target) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
          return;
        }
        if (typeof target === 'function') {
          target().scrollTo({
            top: 0,
            behavior: 'smooth',
          });
          return;
        }
        target.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }}
    />
  );
};

export default BackTop;
