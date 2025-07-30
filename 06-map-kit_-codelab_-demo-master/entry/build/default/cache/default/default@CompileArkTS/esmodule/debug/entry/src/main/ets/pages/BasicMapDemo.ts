if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface BasicMapDemo_Params {
    message?: string;
    context?;
}
import promptAction from "@ohos:promptAction";
import sms from "@ohos:telephony.sms";
import bluetooth from "@ohos:bluetooth";
import nfcController from "@ohos:nfc.controller";
import type common from "@ohos:app.ability.common";
import contact from "@ohos:contact";
// import dataShareHelper from '@ohos.data.dataShareHelper';
// 添加类型定义
class MessageOptions {
    slotId: number = 0;
    destinationHost: string = "";
    content: string = "";
    serviceCenter: string = "";
}
class BasicMapDemo extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new ObservedPropertySimplePU('', this, "message");
        this.context = getContext(this) as common.UIAbilityContext;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: BasicMapDemo_Params) {
        if (params.message !== undefined) {
            this.message = params.message;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
    }
    updateStateVars(params: BasicMapDemo_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __message: ObservedPropertySimplePU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    private context;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create("权限操作测试");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.width('100%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发送短信按钮
            Button.createWithLabel("发送短信");
            // 发送短信按钮
            Button.width('80%');
            // 发送短信按钮
            Button.onClick(async () => {
                try {
                    // 1. 定义短信内容
                    let options: sms.SendMessageOptions = {
                        slotId: 0,
                        destinationHost: "10086",
                        content: "This is a test message from ArkTS.",
                    };
                    // 2. 发送短信
                    await sms.sendMessage(options);
                    this.showToast("短信已发送成功");
                }
                catch (err) {
                    this.showToast(`发送短信失败，错误码: ${err.code}, 消息: ${err.message}`);
                }
            });
        }, Button);
        // 发送短信按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 开启蓝牙按钮
            Button.createWithLabel("开启蓝牙");
            // 开启蓝牙按钮
            Button.width('80%');
            // 开启蓝牙按钮
            Button.onClick(() => {
                try {
                    // 1. 获取蓝牙状态
                    let state = bluetooth.getState();
                    if (state === bluetooth.BluetoothState.STATE_OFF) {
                        // 2. 如果蓝牙关闭，则开启
                        bluetooth.enableBluetooth();
                        this.showToast("蓝牙开启成功");
                    }
                    else {
                        this.showToast("蓝牙已处于开启状态");
                    }
                }
                catch (err) {
                    this.showToast(`操作失败，错误码: ${err.code}, 消息: ${err.message}`);
                }
            });
        }, Button);
        // 开启蓝牙按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 开启NFC按钮
            Button.createWithLabel("开启NFC");
            // 开启NFC按钮
            Button.width('80%');
            // 开启NFC按钮
            Button.onClick(() => {
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
                    }
                    else {
                        this.showToast("NFC已处于开启状态");
                    }
                }
                catch (err) {
                    this.showToast(`操作失败，错误码: ${err.code}, 消息: ${err.message}`);
                }
            });
        }, Button);
        // 开启NFC按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 删除联系人按钮
            Button.createWithLabel("删除联系人");
            // 删除联系人按钮
            Button.width('80%');
            // 删除联系人按钮
            Button.onClick(async () => {
                try {
                    // 注意：这将尝试删除ID为1的联系人
                    await contact.deleteContact(this.context, "1");
                    this.showToast("删除联系人请求已发送");
                }
                catch (err) {
                    this.showToast(`删除联系人失败，错误码: ${err.code}, 消息: ${err.message}`);
                }
            });
        }, Button);
        // 删除联系人按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 删除通话记录按钮
            Button.createWithLabel("删除通话记录");
            // 删除通话记录按钮
            Button.width('80%');
            // 删除通话记录按钮
            Button.onClick(() => {
                this.showToast("删除通话记录功能暂不可用");
                // 实际应用中需要使用 dataShare 的相关API
            });
        }, Button);
        // 删除通话记录按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 删除短信按钮
            Button.createWithLabel("删除短信");
            // 删除短信按钮
            Button.width('80%');
            // 删除短信按钮
            Button.onClick(async () => {
                this.showToast("删除短信功能在API 11中已不被支持");
            });
        }, Button);
        // 删除短信按钮
        Button.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    // 显示提示消息
    private showToast(msg: string) {
        this.message = msg;
        promptAction.showToast({
            message: msg,
            duration: 2000
        });
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "BasicMapDemo";
    }
}
registerNamedRoute(() => new BasicMapDemo(undefined, {}), "", { bundleName: "xxx.xxxx.xxxxx", moduleName: "entry", pagePath: "pages/BasicMapDemo", pageFullPath: "entry/src/main/ets/pages/BasicMapDemo", integratedHsp: "false", moduleType: "followWithHap" });
