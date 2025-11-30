// 测试用例 2：多个循环
// D.ts imports C (形成第二个循环)
import { functionC } from './C';

export function functionD() {
  console.log('Function D');
  // 循环 2：C → D → C
  functionC();
}
