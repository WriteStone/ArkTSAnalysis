if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MainIndex_Params {
}
import router from "@ohos:router";
class MainIndex extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MainIndex_Params) {
    }
    updateStateVars(params: MainIndex_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Health Auth', { type: ButtonType.Capsule });
            Button.width('80%');
            Button.height(40);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/AuthIndex' });
            });
            Button.margin({ top: 50, bottom: 20 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Exercise Sequence', { type: ButtonType.Capsule });
            Button.width('80%');
            Button.height(40);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/ExerciseSequenceIndex' });
            });
            Button.margin({ bottom: 20 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('Permission Test Page', { type: ButtonType.Capsule });
            Button.width('80%');
            Button.height(40);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/PermissionTestPage' });
            });
            Button.margin({ bottom: 20 });
        }, Button);
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "MainIndex";
    }
}
registerNamedRoute(() => new MainIndex(undefined, {}), "", { bundleName: "com.example.newapplication", moduleName: "entry", pagePath: "pages/MainIndex", pageFullPath: "entry/src/main/ets/pages/MainIndex", integratedHsp: "false", moduleType: "followWithHap" });
