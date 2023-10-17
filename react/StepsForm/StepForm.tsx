import { useContext, useState, ReactNode } from "react";
import StepsFormContext from "./context";
import { Form, FormProps, Button, Space } from "antd-mobile";
import styles from "./index.module.scss";

type SetpFormProps = {
  /**
   * 表单内容
   */
  children: ReactNode;
  /**
   *  分布提交函数，返回true则跳转到下一步，返回false则不跳转
   * @param values
   * @returns
   */
  onFinish?: (values: any) => Promise<boolean>;
} & FormProps;

export const StepForm = ({ children, onFinish, ...props }: SetpFormProps) => {
  const {
    currentIndex,
    childrenCount,
    values,
    setValues,
    setCurrentIndex,
    onLastFinish,
  } = useContext(StepsFormContext);
  
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Form
      onFinish={async (currentValues) => {
        setLoading(true);
        /**
         * 如果是最后一步，执行onLastFinish
         */
        if (childrenCount === currentIndex + 1) {
          const res = await onLastFinish?.(currentValues).finally(() => {
            setLoading(false);
          });
          return res;
        }

        /**
         * 如果不是最后一步，执行onFinish
         */
        const isFinish = await onFinish?.(currentValues).finally(() => {
          setLoading(false);
        });
        if (isFinish) {
          setCurrentIndex?.(
            currentIndex === childrenCount ? childrenCount : currentIndex + 1,
          );
        }
      }}
      onValuesChange={(changedValues, allValues) => {
        // 保存每一步的值到 values 中，用于最后提交
        setValues && setValues({ ...(values ? values : {}), ...allValues });
      }}
      footer={
        <Space
          className="action"
          justify="between"
          block
          direction={currentIndex === 0 ? "vertical" : "horizontal"}
        >
          {currentIndex !== 0 && (
            <Button
              className="prev-btn"
              onClick={() => {
                setCurrentIndex?.(currentIndex - 1 < 0 ? 0 : currentIndex - 1);
              }}
            >
              返回
            </Button>
          )}
          {childrenCount === currentIndex + 1 ? (
            <Button
              key={"submit"}
              className="next-btn submit"
              color="primary"
              loading={loading}
              type="submit"
            >
              提交
            </Button>
          ) : (
            <Button
              key={"next"}
              className={currentIndex === 0 ? "" : "next-btn"}
              block={currentIndex === 0}
              color="primary"
              type="submit"
              loading={loading}
            >
              下一步
            </Button>
          )}
        </Space>
      }
      {...props}
      className={styles.stepContainer}
    >
      {children}
    </Form>
  );
};

export default StepForm;
