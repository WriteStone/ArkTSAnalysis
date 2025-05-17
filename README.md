

### 开发方法


注意别把无关大文件传上来：  
```
# 查看文件大小
du -ah . | sort -rh 
```

### 开发任务  

1. 找齐10个app  
链接放到文档：
https://github.com/IoTAccessControl/ArkTSAnalysis/tree/main/TestApps  

2. 对比 ohos-typescript 和 原版typescript 的差异  
https://www.npmjs.com/package/ohos-typescript?activeTab=readme  
如果没有差异，我们基于Go的TypeScript编译器开发  
以下是源码，npm包有一年没更新了，北航的ArkAnalyzer是基于这个库来做ArkTS语法分析：  
https://gitee.com/openharmony/third_party_typescript
