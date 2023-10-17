# StepsForm

分布表单
> 组件设计参考：[antd-pro](https://procomponents.ant.design/components/steps-form)

## 使用方式

```jsx
<StepsForm
  defaultCurrent={0}
  onFinish={async (values) => {
    console.log("所有步骤完成", values);
  }}
>
  <StepsForm.StepForm
    onFinish={async (values) => {
      console.log("第一步完成", "values");
      await delay(2000);
      return true;
    }}
  >
    第一步表单
  </StepsForm.StepForm>
  <StepsForm.StepForm
    onFinish={async (values) => {
      console.log("第2步完成", "values");
      await delay(2000);
      return false; // 返回false则不会进入下一步
    }}
  >
    第二步表单
  </StepsForm.StepForm>

  <StepsForm.StepForm>第三步表单</StepsForm.StepForm>
</StepsForm>
```
