// 测试用例 1：简单循环
// A.ts imports B
import { functionB } from './B';

export function functionA() {
  console.log('Function A');
  functionB();
}
