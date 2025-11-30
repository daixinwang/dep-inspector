// 测试用例 3：复杂循环
// A.ts imports B and C
import { functionB } from './B';
import { functionC } from './C';

export function functionA() {
  console.log('Function A');
  functionB();
  functionC();
}
