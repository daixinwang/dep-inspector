// 测试用例 4：无循环
// B.ts imports C
import { functionC } from './C';

export function functionB() {
  console.log('Function B');
  functionC();
}
