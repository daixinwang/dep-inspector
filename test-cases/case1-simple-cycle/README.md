# 测试用例 1：简单循环
## 项目结构

```
src/
├── A.ts (imports B)
├── B.ts (imports C)
└── C.ts (imports A)
```

## 依赖关系

```
A → B → C → A
```

## 预期结果

- **节点数**：3
- **边数**：3
- **循环数**：1
- **循环路径**：A → B → C → A

## 说明

这是最简单的循环依赖场景，三个文件形成一个完整的循环。

## 打包命令

```bash
cd case1-simple-cycle
zip -r case1-simple-cycle.zip src/
