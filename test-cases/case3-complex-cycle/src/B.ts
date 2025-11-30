// 测试用例 3：复杂循环
// B.ts imports C
import { functionC } from './C';

export function functionB() {
  console.log('Function B');
  functionC();
}
