// 测试用例 1：简单循环
// C.ts imports A (形成循环)
import { functionA } from './A';

export function functionC() {
  console.log('Function C');
  // 这里会形成循环依赖：A → B → C → A
  functionA();
}
