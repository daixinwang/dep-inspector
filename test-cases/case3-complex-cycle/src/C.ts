// 测试用例 3：复杂循环
// C.ts imports D
import { functionD } from './D';

export function functionC() {
  console.log('Function C');
  functionD();
}
