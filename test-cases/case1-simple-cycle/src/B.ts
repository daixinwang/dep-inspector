// 测试用例 1：简单循环
// B.ts imports C
import { functionC } from './C';

export function functionB() {
  console.log('Function B');
  functionC();
}
