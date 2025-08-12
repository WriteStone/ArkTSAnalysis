// entry/src/main/ets/pages/PermissionTestPage.ets
import hilog from '@ohos.hilog';
import bundleManager from '@ohos.bundle.bundleManager';
import wifi from '@ohos.wifi';
import { BusinessError } from '@ohos.base';
import { deviceInfo } from '@kit.MDMKit';
import enterpriseDeviceInfo from '@ohos.enterprise.deviceInfo';
import Want from '@ohos.app.ability.Want';
import bluetooth from '@ohos.bluetooth.access';
import abilityAccessCtrl from '@ohos.abilityAccessCtrl';
import wifiMarnager from '@ohos.wifiManager';
import enterpiseAdminManager from '@ohos.enterprise.adminManager';
import wifiManager from '@ohos.wifiManager';
import screenshot from '@ohos.screenshot';

@Entry
@Component
struct PermissionTestPage {
  @State message: string = 'Permission Test Results';


  //get imei
  // async getImei(){
  //   // 设备管理员应用信息（需提前配置）
  //   let wantTemp: Want = {
  //     bundleName: 'com.example.myapplication',
  //     abilityName: 'EntryAbility',
  //   };
  //
  //   try {
  //     let result: string = deviceInfo.getDeviceInfo(wantTemp, 'deviceName');
  //     console.info(`Succeeded in getting device name, result : ${result}`);
  //     this.message = `Succeeded in getting device name, result : ${result}`;
  //   } catch (err) {
  //     console.error(`Failed to get device name. Code: ${err.code}, message: ${err.message}`);
  //     this.message = `Failed to get device name. Code: ${err.code}, message: ${err.message}`
  //   }
  // }

  // Get MAC Address
  async getMacAddress() {
    this.message = 'Getting MAC Address...';
    try {
      const macArray: string[]  = wifiManager.getDeviceMacAddress();
      // const macArray: string[] = wifiManager.getDeviceMacAddress();
      console.log(`WiFi MAC: ${macArray[0]}`);

      this.message = `MAC address ${macArray[0]}`;
    } catch (e) {
      this.message = `Failed to get MAC address: ${JSON.stringify(e)}`;
    }
  }

  // Get installed bundle list
  async getBundleList() {
    this.message = 'Getting bundle list...';
    try {
      // 使用正确的API
      let bundleFlag = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION;
      let bundles = await bundleManager.getBundleInfo('com.example.myapplication', bundleFlag);
      this.message = `Bundle info: ${JSON.stringify(bundles)}`;
      hilog.info(0x0000, 'PermissionTest', `Bundle info: ${JSON.stringify(bundles)}`);
    } catch (error) {
      const err = error as BusinessError;
      this.message = `Failed to get bundle list: ${err.code}, ${err.message}`;
      hilog.error(0x0000, 'PermissionTest', `Failed to get bundle list: ${err.code}, ${err.message}`);
    }
  }


  build() {
    Column() {
      Text('Permission Tests')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 20 });
        
      Text(this.message)
        .fontSize(18)
        .margin(20);

      Button('Get MAC Address', { type: ButtonType.Capsule })
        .width('80%')
        .height(40)
        .onClick(() => this.getMacAddress())
        .margin({ bottom: 20 });

      Button('Get Installed Apps', { type: ButtonType.Capsule })
        .width('80%')
        .height(40)
        .onClick(() => this.getBundleList())
        .margin({ bottom: 20 });

      // Button('读IMEI', { type: ButtonType.Capsule })
      //   .width('80%')
      //   .height(40)
      //   .onClick(() => this.getImei())
      //   .margin({ bottom: 20 });
    }
    .width('100%');
  }
} 