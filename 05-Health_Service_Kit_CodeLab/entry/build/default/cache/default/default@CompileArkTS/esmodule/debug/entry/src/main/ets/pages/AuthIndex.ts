if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    log?: string;
}
import { AuthManagement } from "@bundle:com.example.newapplication/entry/ets/common/bean/AuthManagement";
import type common from "@ohos:app.ability.common";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__log = new ObservedPropertySimplePU('', this, "log");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.log !== undefined) {
            this.log = params.log;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__log.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__log.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __log: ObservedPropertySimplePU<string>;
    get log() {
        return this.__log.get();
    }
    set log(newValue: string) {
        this.__log.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Center);
            Column.height('100%');
            Column.width('100%');
            Column.justifyContent(FlexAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777218, "type": 10003, params: [], "bundleName": "com.example.newapplication", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.fontSize(30);
            Text.height('20%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height('10%');
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777227, "type": 10003, params: [], "bundleName": "com.example.newapplication", "moduleName": "entry" });
            Button.width('50%');
            Button.onClick(async () => {
                this.log = await AuthManagement.auth(getContext(this) as common.UIAbilityContext);
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.width('90%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.newapplication", "moduleName": "entry" });
            Text.fontSize(15);
            Text.textAlign(TextAlign.Start);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.width('90%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.log);
            Text.fontSize(10);
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        Column.pop();
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.newapplication", moduleName: "entry", pagePath: "pages/AuthIndex", pageFullPath: "entry/src/main/ets/pages/AuthIndex", integratedHsp: "false", moduleType: "followWithHap" });
