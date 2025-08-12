/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2023-2023. All rights reserved.
 */

import { MapComponent, mapCommon, map } from '@kit.MapKit';
import { AsyncCallback } from '@kit.BasicServicesKit';
import promptAction from '@ohos.promptAction';
// 使用 HarmonyOS 5.0.0 兼容的导入
import sms from '@ohos.telephony.sms';
import bluetooth from '@ohos.bluetooth';
import nfcController from '@ohos.nfc.controller';
import common from '@ohos.app.ability.common';
import contact from '@ohos.contact';
// import dataShareHelper from '@ohos.data.dataShareHelper';
import { access } from '@kit.ConnectivityKit';
import dataShare from '@kit.ArkData';
import dataSharePredicates from '@kit.ArkData';

import { sim , sms as contactSms  } from '@kit.TelephonyKit'

// 添加类型定义
class MessageOptions {
  slotId: number = 0;
  destinationHost: string = "";
  content: string = "";
  serviceCenter: string = "";
}

@Entry
@Component
struct BasicMapDemo {
  @State message: string = '';
  private context = getContext(this) as common.UIAbilityContext;

  build() {
    Column() {
      Text("权限操作测试")
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: 20 })
      
      Scroll() {
        Column({ space: 15 }) {
          // 发送短信按钮
          Button("发送短信")
            .width('80%')
            .onClick(async () => {
              try {
                // 1. 定义短信内容
                let options: sms.SendMessageOptions = {
                  slotId: 0, // 使用卡槽0
                  destinationHost: "10086", // 目标号码
                  content: "This is a test message from ArkTS.",
                };

                // 2. 发送短信
                await sms.sendMessage(options);
                this.showToast("短信已发送成功");
              } catch (err) {
                this.showToast(`发送短信失败，错误码: ${err.code}, 消息: ${err.message}`);
              }
            })

          // 发送短信按钮
          Button("发送短信2")
            .width('80%')
            .onClick(async () => {
              try {
                // 1. 定义短信内容
                let options: sms.SendMessageOptions = {
                  slotId: 0, // 使用卡槽0
                  destinationHost: "10086", // 目标号码
                  content: "This is a test message from ArkTS.",
                };

                // 2. 发送短信
                await sms.sendShortMessage(options);
                this.showToast("短信已发送成功");
              } catch (err) {
                this.showToast(`发送短信失败，错误码: ${err.code}, 消息: ${err.message}`);
              }
            })

          // 开启蓝牙按钮
          Button("开启蓝牙")
            .width('80%')
            .onClick(() => {
              try {
                // 1. 获取蓝牙状态
                let state = bluetooth.getState();
                if (state === bluetooth.BluetoothState.STATE_OFF) {
                  // 2. 如果蓝牙关闭，则开启
                  bluetooth.enableBluetooth();
                  this.showToast("蓝牙开启成功");
                } else {
                  this.showToast("蓝牙已处于开启状态");
                }
              } catch (err) {
                this.showToast(`操作失败，错误码: ${err.code}, 消息: ${err.message}`);
              }
            })

          // 开启蓝牙按钮
          Button("开启蓝牙2")
            .width('80%')
            .onClick(() => {
              try {
                // 1. 获取蓝牙状态
                let state = bluetooth.getState();
                if (state === bluetooth.BluetoothState.STATE_OFF) {
                  // 2. 如果蓝牙关闭，则开启
                  access.enableBluetooth();
                  this.showToast("蓝牙开启成功");
                } else {
                  this.showToast("蓝牙已处于开启状态");
                }
              } catch (err) {
                this.showToast(`操作失败，错误码: ${err.code}, 消息: ${err.message}`);
              }
            })

          // 开启NFC按钮
          Button("开启NFC")
            .width('80%')
            .onClick(() => {
              try {
                // 1. 检查NFC是否开启
                if (!nfcController.isNfcAvailable()) {
                  this.showToast("设备不支持NFC功能");
                  return;
                }
                
                let isEnabled = nfcController.isNfcOpen();
                if (!isEnabled) {
                  // 2. 如果NFC关闭，则开启
                  nfcController.enableNfc();
                  this.showToast("NFC开启成功");
                } else {
                  this.showToast("NFC已处于开启状态");
                }
              } catch (err) {
                this.showToast(`操作失败，错误码: ${err.code}, 消息: ${err.message}`);
              }
            })

          // 删除联系人按钮
          Button("删除联系人")
            .width('80%')
            .onClick(async () => {
              try {
                // 注意：这将尝试删除ID为1的联系人
                await contact.deleteContact(this.context, "1");
                this.showToast("删除联系人请求已发送");
              } catch (err) {
                this.showToast(`删除联系人失败，错误码: ${err.code}, 消息: ${err.message}`);
              }
            })


          // 删除通话记录按钮
          Button("删除通话记录")
            .width('80%')
            .onClick(() => {
              this.showToast("删除通话记录功能暂不可用");
              // 实际应用中需要使用 dataShare 的相关API
            })

          // 删除短信按钮
          Button("删除短信")
            .width('80%')
            .onClick(async () => {
              this.showToast("删除短信功能在API 11中已不被支持");
            })

        }
        .width('100%')
        .padding(20)
      }
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
  }

  // 显示提示消息
  private showToast(msg: string) {
    this.message = msg;
    promptAction.showToast({
      message: msg,
      duration: 2000
    });
  }
}
