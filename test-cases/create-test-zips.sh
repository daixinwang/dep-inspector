#!/bin/bash
# 批量创建测试用例的 ZIP 文件

echo "🚀 开始创建测试用例 ZIP 文件..."
echo ""

# 测试用例列表
cases=(
  "case1-simple-cycle"
  "case2-multiple-cycles"
  "case3-complex-cycle"
  "case4-no-cycle"
)

# 遍历每个测试用例
for case in "${cases[@]}"; do
  if [ -d "$case" ]; then
    echo "📦 正在打包: $case"
    cd "$case"
    
    # 删除旧的 ZIP 文件（如果存在）
    if [ -f "${case}.zip" ]; then
      rm "${case}.zip"
      echo "   ✓ 删除旧文件"
    fi
    
    # 创建新的 ZIP 文件
    zip -r "${case}.zip" src/ > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
      echo "   ✓ 创建成功: ${case}.zip"
      
      # 显示文件大小
      size=$(ls -lh "${case}.zip" | awk '{print $5}')
      echo "   ℹ️  文件大小: $size"
    else
      echo "   ✗ 创建失败"
    fi
    
    cd ..
    echo ""
  else
    echo "⚠️  目录不存在: $case"
    echo ""
  fi
done

echo "✅ 所有测试用例 ZIP 文件创建完成！"
echo ""
echo "📋 生成的文件列表："
for case in "${cases[@]}"; do
  if [ -f "$case/${case}.zip" ]; then
    echo "   • $case/${case}.zip"
  fi
done
echo ""
echo "💡 提示：你可以在应用中上传这些 ZIP 文件进行测试"
