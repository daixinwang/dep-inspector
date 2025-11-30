# 测试用例 2：多个循环
## 项目结构

```
src/
├── A.ts (imports B)
├── B.ts (imports A)
├── C.ts (imports D)
└── D.ts (imports C)
```

## 依赖关系

```
循环 1: A ⇄ B
循环 2: C ⇄ D
```

## 预期结果

- **节点数**：4
- **边数**：4
- **循环数**：2
- **循环路径**：
  - A → B → A
  - C → D → C

## 说明

这个测试用例包含两个独立的循环依赖，它们之间没有任何关联。

## 打包命令

```bash
cd case2-multiple-cycles
zip -r case2-multiple-cycles.zip src/
