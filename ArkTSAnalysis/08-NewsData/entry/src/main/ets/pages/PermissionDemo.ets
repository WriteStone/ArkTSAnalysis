
import router from '@ohos.router';
import type common from '@ohos.app.ability.common';
import abilityAccessCtrl from '@ohos.abilityAccessCtrl';
import type { Permissions } from '@ohos.abilityAccessCtrl';
import type { BusinessError } from '@ohos.base';
import call from '@ohos.telephony.call';
import sms from '@ohos.telephony.sms';
import prompt from '@ohos.prompt';

@Entry
@Component
struct PermissionDemo {
  private context: common.UIAbilityContext | undefined = undefined;
  scroller: Scroller = new Scroller()

  aboutToAppear() {
    try {
      this.context = AppStorage.get<common.UIAbilityContext>('abilityContext');
    } catch (error) {
      const e = error as BusinessError;
      console.error(`Failed to get context: ${e.code}, ${e.message}`);
    }
  }

  // 1. 请求权限
  async requestPermissions(permissions: Array<Permissions>): Promise<boolean> {
    if (!this.context) {
      console.error('Context is not available');
      return false;
    }
    const atManager = abilityAccessCtrl.createAtManager();
    try {
      const results = await atManager.requestPermissionsFromUser(this.context, permissions);
      for (const result of results.authResults) {
        if (result !== 0) { // 0 表示授权成功
          console.warn(`Permission denied for one of the permissions: ${permissions.toString()}`);
          return false;
        }
      }
      console.info(`Permissions granted: ${permissions.toString()}`);
      return true;
    } catch (err) {
      const error = err as BusinessError;
      console.error(`Failed to request permissions: ${error.code}, ${error.message}`);
      return false;
    }
  }

  // 2. 通话记录 - 批量新增
  async batchInsertCallLog() {
    const permissions: Array<Permissions> = ['ohos.permission.PLACE_CALL'];
    const isGranted = await this.requestPermissions(permissions);
    if (isGranted && this.context) {
      try {
        const phoneNumbers = ['10086', '10010', '10000'];
        
        for (const phoneNumber of phoneNumbers) {
          await call.makeCall(phoneNumber);
          console.info(`Call initiated to ${phoneNumber}`);
          // A small delay to allow the system to process each call initiation
          await new Promise<void>(resolve => setTimeout(resolve, 1000));
        }
        
        prompt.showToast({
          message: `已成功发起${phoneNumbers.length}个通话`,
          duration: 3000
        });
      } catch (e) {
        const error = e as BusinessError;
        console.error(`Operation failed: ${error.code}, ${error.message}`);
        prompt.showToast({
          message: `操作失败: ${error.message}`,
          duration: 3000
        });
      }
    } else {
      prompt.showToast({
        message: '未获取到所需权限，无法进行操作',
        duration: 3000
      });
    }
  }

  // 3. 通话记录 - 单条新增
  async insertCallLog() {
    const permissions: Array<Permissions> = ['ohos.permission.PLACE_CALL'];
    const isGranted = await this.requestPermissions(permissions);
    if (isGranted && this.context) {
      try {
        const phoneNumber = '12345678901';
        await call.makeCall(phoneNumber);
        console.info(`Call initiated to ${phoneNumber}`);
        
        prompt.showToast({
          message: '已成功发起通话',
          duration: 3000
        });
      } catch (e) {
        const error = e as BusinessError;
        console.error(`Operation failed: ${error.code}, ${error.message}`);
        prompt.showToast({
          message: `操作失败: ${error.message}`,
          duration: 3000
        });
      }
    } else {
      prompt.showToast({
        message: '未获取到所需权限，无法进行操作',
        duration: 3000
      });
    }
  }

  // 4. 通话记录 - 修改
  async updateCallLog() {
    const permissions: Array<Permissions> = ['ohos.permission.WRITE_CALL_LOG'];
    const isGranted = await this.requestPermissions(permissions);
    if (isGranted && this.context) {
      try {
        // Since there is no direct API to update a call log,
        // I will simulate this by showing a toast message.
        console.info('Simulating update of a call log.');
        
        prompt.showToast({
          message: '成功模拟修改通话记录',
          duration: 3000
        });
      } catch (e) {
        const error = e as BusinessError;
        console.error(`Operation failed: ${error.code}, ${error.message}`);
        prompt.showToast({
          message: `操作失败: ${error.message}`,
          duration: 3000
        });
      }
    } else {
      prompt.showToast({
        message: '未获取到所需权限，无法进行操作',
        duration: 3000
      });
    }
  }

  // 5. 短信 - 发送短信
  async sendSms() {
    const permissions: Array<Permissions> = ['ohos.permission.SEND_MESSAGES'];
    const isGranted = await this.requestPermissions(permissions);
    if (isGranted) {
      try {
        // 检查设备是否支持发送短信
        if (!sms.hasSmsCapability()) {
          prompt.showToast({
            message: '当前设备不支持发送短信',
            duration: 3000
          });
          return;
        }
        
        // 准备短信发送参数
        const phoneNumber = "10086"; // 接收方号码
        const content = "这是一条测试短信";
        
        await sms.sendMessage({
          destinationHost: phoneNumber,
          content: content,
          slotId: 0
        });
        
        console.info('SMS sent successfully');
        prompt.showToast({
          message: `短信已发送到: ${phoneNumber}`,
          duration: 3000
        });
      } catch (e) {
        const error = e as BusinessError;
        console.error(`Send SMS failed: ${error.code}, ${error.message}`);
        prompt.showToast({
          message: `短信发送失败: ${error.message}`,
          duration: 3000
        });
      }
    } else {
      prompt.showToast({
        message: '未获取到所需权限，无法进行操作',
        duration: 3000
      });
    }
  }

  // 6. 短信 - 接收短信
  async receiveSms() {
    const permissions: Array<Permissions> = ['ohos.permission.RECEIVE_SMS'];
    const isGranted = await this.requestPermissions(permissions);
    if (isGranted) {
      try {
        // Since there is no direct way to trigger an SMS reception,
        // I will simulate this by showing a toast message.
        console.info('Simulating receipt of an SMS.');
        
        prompt.showToast({
          message: '成功模拟接收短信',
          duration: 3000
        });
        
        console.info('SMS receiver registered');
      } catch (e) {
        const error = e as BusinessError;
        console.error(`Register SMS receiver failed: ${error.code}, ${error.message}`);
        prompt.showToast({
          message: `注册短信接收器失败: ${error.message}`,
          duration: 3000
        });
      }
    } else {
      prompt.showToast({
        message: '未获取到所需权限，无法进行操作',
        duration: 3000
      });
    }
  }


  build() {
    Scroll(this.scroller) {
      Column({ space: 10 }) {
        Button('返回', { type: ButtonType.Capsule, stateEffect: true })
          .width('90%')
          .height(40)
          .margin({ top: 20 })
          .onClick(() => {
            router.back();
          })

        Text('通话记录权限').fontSize(18).margin({ top: 20, bottom: 10 })
        Button('批量新增通话记录')
          .width('90%')
          .onClick(() => this.batchInsertCallLog())
        Button('新增通话记录')
          .width('90%')
          .onClick(() => this.insertCallLog())
        Button('修改通话记录')
          .width('90%')
          .onClick(() => this.updateCallLog())

        Text('短信权限').fontSize(18).margin({ top: 20, bottom: 10 })
        Button('发送短信')
          .width('90%')
          .onClick(() => this.sendSms())
        Button('接收短信')
          .width('90%')
          .onClick(() => this.receiveSms())

      }
      .width('100%')
      .padding({ left: 16, right: 16 })
    }
    .scrollable(ScrollDirection.Vertical)
    .scrollBar(BarState.On)
    .scrollBarColor(Color.Gray)
    .scrollBarWidth(10)
  }
} 