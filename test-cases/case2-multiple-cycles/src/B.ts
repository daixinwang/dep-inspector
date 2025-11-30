// 测试用例 2：多个循环
// B.ts imports A (形成第一个循环)
import { functionA } from './A';

export function functionB() {
  console.log('Function B');
  // 循环 1：A → B → A
  functionA();
}
