# HarmonyOS 数据流分析与 Label 使用指南

## 📊 一、数据流分析 (Data Flow Analysis)

### 1.1 什么是数据流分析？

数据流分析用于追踪敏感数据在应用中的流动路径，确保数据安全。

### 1.2 数据流的三个关键要素

```
Source (源) → Flow (流) → Sink (汇)
```

#### **Source (数据源)**
敏感信息的来源，例如：
- 设备信息：`deviceInfo.manufacture`, `deviceInfo.brand`
- 用户输入：`TextInput`, `TextArea`
- 位置信息：`geoLocationManager.getCurrentLocation()`
- 联系人信息：`contact.queryContacts()`
- 传感器数据：加速度计、陀螺仪等

#### **Flow (数据流)**
数据如何在应用中传递：
- 变量赋值：`this.deviceId = deviceInfo.manufacture`
- 函数参数传递
- 对象属性访问
- 异步回调

#### **Sink (数据汇)**
敏感信息可能泄露的地方：
- 网络请求：`http.request()`
- 短信发送：`sms.sendShortMessage()`
- 文件写入：`fs.writeSync()`
- 日志输出：`console.log()`, `hilog.info()`
- Toast 显示：`promptAction.showToast()`

### 1.3 在代码注释中标注数据流

```typescript
/**
 * @dataflow 函数名: source -> 中间变量; 函数名: 中间变量 -> sink
 */
```

#### 示例：

```typescript
/**
 * @testcase_name Button1
 * @description 数据流分析示例
 * @dataflow aboutToAppear: deviceInfo -> deviceId; sendMessage: deviceId -> sms.sendShortMessage
 * @number_of_leaks 1
 */
```

### 1.4 完整的数据流分析示例

```typescript
@Entry
@Component
struct DataFlowExample {
  // 中间变量 - 存储敏感信息
  @State private sensitiveData: string = '';

  // SOURCE: 获取敏感数据
  aboutToAppear(): void {
    // Source 1: 设备信息
    this.sensitiveData = deviceInfo.manufacture;
  }

  // FLOW: 数据处理
  processData(input: string): string {
    return `Processed: ${input}`;
  }

  // SINK: 数据泄露点
  leakData(): void {
    // Sink 1: 网络传输
    http.request('https://example.com', {
      method: http.RequestMethod.POST,
      extraData: { data: this.sensitiveData }
    });

    // Sink 2: 短信发送
    sms.sendShortMessage({
      content: this.sensitiveData,
      destinationHost: '+1234567890'
    });

    // Sink 3: 日志输出
    console.log('Sensitive:', this.sensitiveData);
  }

  build() {
    Column() {
      Button('触发数据泄露')
        .onClick(() => this.leakData())
    }
  }
}
```

---

## 🏷️ 二、Label 的使用

### 2.1 Label 的主要用途

1. **组件标识** - 用于自动化测试
2. **无障碍访问** - 帮助视障用户理解界面
3. **数据流标记** - 标记敏感数据的安全级别

### 2.2 组件 ID (用于测试)

使用 `.id()` 为组件添加唯一标识：

```typescript
Button('提交')
  .id('submitButton')  // 唯一ID，用于自动化测试

TextInput()
  .id('usernameInput')  // 输入框ID

Text('标题')
  .id('pageTitle')  // 文本ID
```

### 2.3 无障碍属性

```typescript
Button('发送')
  .accessibilityText('发送消息按钮')  // 无障碍文本
  .accessibilityDescription('点击此按钮将发送消息到服务器')  // 详细描述
  .accessibilityLevel('yes')  // 重要性级别
```

### 2.4 数据安全级别标记

在 HarmonyOS 中，可以使用数据分级标记：

```typescript
/**
 * @security_level S1  // 公开数据
 * @security_level S2  // 低敏感数据
 * @security_level S3  // 中敏感数据
 * @security_level S4  // 高敏感数据
 */
```

### 2.5 完整的 Label 使用示例

```typescript
@Entry
@Component
struct LabelExample {
  @State username: string = '';
  @State password: string = '';

  build() {
    Column({ space: 20 }) {
      // 标题 - 带ID和无障碍属性
      Text('登录页面')
        .id('loginTitle')
        .fontSize(24)
        .accessibilityText('登录页面标题')

      // 用户名输入框
      TextInput({ placeholder: '请输入用户名' })
        .id('usernameInput')
        .accessibilityText('用户名输入框')
        .accessibilityDescription('请输入您的用户名')
        .onChange((value: string) => {
          this.username = value;
        })

      // 密码输入框
      TextInput({ placeholder: '请输入密码' })
        .id('passwordInput')
        .type(InputType.Password)
        .accessibilityText('密码输入框')
        .accessibilityDescription('请输入您的密码')
        .onChange((value: string) => {
          this.password = value;
        })

      // 登录按钮
      Button('登录')
        .id('loginButton')
        .accessibilityText('登录按钮')
        .accessibilityDescription('点击此按钮提交登录信息')
        .onClick(() => {
          console.info('Login clicked');
        })

      // 忘记密码链接
      Text('忘记密码?')
        .id('forgotPasswordLink')
        .fontColor(Color.Blue)
        .accessibilityText('忘记密码链接')
        .accessibilityDescription('点击重置密码')
        .onClick(() => {
          console.info('Forgot password clicked');
        })
    }
    .width('100%')
    .padding(20)
  }
}
```

---

## 🔍 三、在你的 Button1 项目中的应用

### 3.1 数据流分析

你的项目中的数据流：

```
Source: deviceInfo (设备信息)
  ↓
Flow: this.deviceId (存储在组件状态中)
  ↓
Sink: sms.sendShortMessage() (通过短信发送)
      promptAction.showToast() (显示在界面上)
```

### 3.2 完整的注释示例

```typescript
/**
 * @testcase_name Button1
 * @version 0.1
 * @description 用户点击按钮后调用 sink。按钮处理程序通过 onClick 事件定义。
 * 
 * @dataflow 
 *   aboutToAppear: deviceInfo.* -> this.deviceId
 *   sendMessage: this.deviceId -> sms.sendShortMessage (LEAK)
 *   sendMessage: this.deviceId -> promptAction.showToast (LEAK)
 * 
 * @security_level S4 (高敏感 - 设备标识符)
 * @number_of_leaks 2
 * @leak_type 网络泄露(短信), UI泄露(Toast)
 * @challenges 
 *   1. 分析必须考虑生命周期(aboutToAppear 在用户交互之前执行)
 *   2. 需要追踪跨函数的数据流
 *   3. 需要识别多个sink点
 */
```

---

## 📝 四、最佳实践

### 4.1 数据流分析最佳实践

1. ✅ **明确标注所有敏感数据源**
2. ✅ **追踪数据在组件间的传递**
3. ✅ **识别所有可能的数据泄露点**
4. ✅ **考虑异步操作和回调**
5. ✅ **注意生命周期方法中的数据流**

### 4.2 Label 使用最佳实践

1. ✅ **所有可交互组件都应有 ID**
2. ✅ **关键组件添加无障碍属性**
3. ✅ **ID 命名使用驼峰式，语义化**
4. ✅ **无障碍文本简洁明了**
5. ✅ **敏感数据添加安全级别标记**

### 4.3 命名规范

```typescript
// 组件ID命名规范
.id('submitButton')      // 按钮：xxxButton
.id('usernameInput')     // 输入框：xxxInput
.id('titleText')         // 文本：xxxText
.id('userList')          // 列表：xxxList
.id('profileImage')      // 图片：xxxImage
```

---

## 🛠️ 五、实用工具

### 5.1 数据流检查清单

- [ ] 是否识别了所有敏感数据源？
- [ ] 是否追踪了数据的完整流向？
- [ ] 是否标记了所有sink点？
- [ ] 是否考虑了异步操作？
- [ ] 是否考虑了生命周期方法？

### 5.2 Label 检查清单

- [ ] 所有按钮是否有ID？
- [ ] 输入框是否有无障碍属性？
- [ ] 关键功能是否有描述？
- [ ] ID命名是否语义化？
- [ ] 是否避免了ID重复？

---

## 📚 六、参考资源

- [HarmonyOS 安全开发指南](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/security-0000001774279802-V5)
- [ArkUI 无障碍开发](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/accessibility-0000001774120202-V5)
- [HarmonyOS 应用安全](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/app-security-0000001774119982-V5)

---

**创建日期**: 2025年11月4日  
**适用版本**: HarmonyOS NEXT / ArkTS
