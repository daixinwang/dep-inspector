// 测试用例 2：多个循环
// C.ts imports D
import { functionD } from './D';

export function functionC() {
  console.log('Function C');
  functionD();
}
