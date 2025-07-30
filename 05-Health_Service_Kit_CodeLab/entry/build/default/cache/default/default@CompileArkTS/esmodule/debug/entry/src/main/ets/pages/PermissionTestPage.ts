if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PermissionTestPage_Params {
    message?: string;
}
import hilog from "@ohos:hilog";
import bundleManager from "@ohos:bundle.bundleManager";
import type { BusinessError } from "@ohos:base";
class PermissionTestPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new ObservedPropertySimplePU('Permission Test Results', this, "message");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PermissionTestPage_Params) {
        if (params.message !== undefined) {
            this.message = params.message;
        }
    }
    updateStateVars(params: PermissionTestPage_Params) {
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
    // Get MAC Address
    async getMacAddress() {
        this.message = 'Getting MAC Address...';
        try {
            // 在OpenHarmony 5.0.0中，API可能已经更改
            this.message = 'MAC address API not available in this version';
        }
        catch (e) {
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
        }
        catch (error) {
            const err = error as BusinessError;
            this.message = `Failed to get bundle list: ${err.code}, ${err.message}`;
            hilog.error(0x0000, 'PermissionTest', `Failed to get bundle list: ${err.code}, ${err.message}`);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Permission Tests');
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 20, bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.message);
            Text.fontSize(18);
            Text.margin(20);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Get MAC Address', { type: ButtonType.Capsule });
            Button.width('80%');
            Button.height(40);
            Button.onClick(() => this.getMacAddress());
            Button.margin({ bottom: 20 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Get Installed Apps', { type: ButtonType.Capsule });
            Button.width('80%');
            Button.height(40);
            Button.onClick(() => this.getBundleList());
            Button.margin({ bottom: 20 });
        }, Button);
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PermissionTestPage";
    }
}
registerNamedRoute(() => new PermissionTestPage(undefined, {}), "", { bundleName: "com.example.newapplication", moduleName: "entry", pagePath: "pages/PermissionTestPage", pageFullPath: "entry/src/main/ets/pages/PermissionTestPage", integratedHsp: "false", moduleType: "followWithHap" });
