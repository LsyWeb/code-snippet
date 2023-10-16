import { useEffect, useMemo, useRef, useState, ReactNode } from "react";
import styles from "./index.module.scss";
import { StepsFormProvider } from "./context";
import StepForm from "./SetpForm";

type StepsFormProps = {
  children: ReactNode;
  /**
   * 默认初始显示第几步
   */
  defaultCurrent?: number;
  /**
   * 切换步骤时的回调
   * @param current
   * @returns
   */
  onCurrentChange?: (current: number) => void;
  /**
   * 最后一步提交函数
   * @param values
   * @returns
   */
  onFinish?: (values: any) => Promise<boolean | void>;
};

const StepsForm = ({
  children,
  defaultCurrent = 0,
  onFinish,
}: StepsFormProps) => {
  const container = useRef<HTMLDivElement>(); // 容器

  const wrapperRef = useRef<HTMLDivElement>(); // 滚动容器

  const [currentIndex, setCurrentIndex] = useState<number>(defaultCurrent); // 当前显示第几步

  const [containerWidth, setContainerWidth] = useState<number>(); // 容器宽度

  // 子元素个数
  const childrenCount = useMemo(() => {
    return React.Children.count(children);
  }, [children]);

  // 保存每一步的值
  const [values, setValues] = useState<any>();

  useEffect(() => {
    // 初始化容器宽度
    setContainerWidth(container.current?.clientWidth);

    // 监听窗口变化
    window.addEventListener("resize", () => {
      setContainerWidth(container.current?.clientWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setContainerWidth(container.current?.clientWidth);
      });
    };
  }, []);

  useEffect(() => {
    // 每次切换都滚动到顶部
    wrapperRef.current?.children[currentIndex].scrollTo(0, 0);
  }, [currentIndex]);

  return (
    <StepsFormProvider
      value={{
        currentIndex,
        setCurrentIndex,
        childrenCount,
        onLastFinish: onFinish,
        values,
        setValues,
      }}
    >
      <div className={styles.stepsContainer} ref={container as any}>
        {containerWidth && (
          <div
            className="wrapper"
            ref={wrapperRef as any}
            style={{
              transform: `translateX(${
                -currentIndex * (containerWidth || 343)
              }px)`,
            }}
          >
            {React.Children.map(children, (child, index) => {
              return (
                <div className="item" style={{ width: containerWidth + "px" }}>
                  {React.cloneElement(child as React.ReactElement, {})}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StepsFormProvider>
  );
};

StepsForm.StepForm = StepForm;

export default StepsForm;
