import React from "react"

type StepsFormContextType = {
  /**
   * 全局的表单的值
   */
  values: any
  /**
   * 当前的步骤 从 0 开始
   */
  currentIndex: number
  /**
   * 子组件的数量
   */
  childrenCount?: number
  /**
   * 设置当前的步骤
   * @param index 
   * @returns 
   */
  setCurrentIndex?: (index: number) => void
  /**
   * 最终全部表单的提交
   * @param value 全部表单的值
   * @returns 
   */
  onLastFinish?: (value: any) => Promise<boolean | void>
  /**
   * 设置表单的值
   * @param values 
   * @returns 
   */
  setValues?: (values: any) => void
}

const StepsFormContext = React.createContext<StepsFormContextType>({
  values: undefined,
  currentIndex: 0,
})
export const { Provider: StepsFormProvider } = StepsFormContext
export default StepsFormContext
