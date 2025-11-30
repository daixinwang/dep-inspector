// 测试用例 3：复杂循环
// D.ts imports A (形成复杂循环)
import { functionA } from './A';

export function functionD() {
  console.log('Function D');
  // 形成复杂循环：
  // 路径1: A → B → C → D → A
  // 路径2: A → C → D → A
  functionA();
}
