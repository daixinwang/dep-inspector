// 测试用例 4：无循环
// A.ts imports B
import { functionB } from './B';

export function functionA() {
  console.log('Function A');
  functionB();
}
