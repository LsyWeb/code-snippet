import React from 'react';
import type { FloatButtonShape } from './index';

const FloatButtonGroupContext = React.createContext<FloatButtonShape | undefined>(undefined);

export const { Provider: FloatButtonGroupProvider } = FloatButtonGroupContext;

export default FloatButtonGroupContext;
