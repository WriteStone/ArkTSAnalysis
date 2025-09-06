if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface InputDialog_Params {
    stepGoal?: string;
    controller?: CustomDialogController;
    cancel?: () => void;
    confirm?: () => void;
}
import { CommonConstants } from "@bundle:com.example.pedometerapp/entry/ets/common/constants/CommonConstants";
export default class InputDialog extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__stepGoal = this.initializeConsume("stepGoal", "stepGoal");
        this.controller = undefined;
        this.cancel = undefined;
        this.confirm = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: InputDialog_Params) {
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.cancel !== undefined) {
            this.cancel = params.cancel;
        }
        if (params.confirm !== undefined) {
            this.confirm = params.confirm;
        }
    }
    updateStateVars(params: InputDialog_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__stepGoal.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__stepGoal.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __stepGoal: ObservedPropertyAbstractPU<string>;
    get stepGoal() {
        return this.__stepGoal.get();
    }
    set stepGoal(newValue: string) {
        this.__stepGoal.set(newValue);
    }
    private controller?: CustomDialogController;
    setController(ctr: CustomDialogController) {
        this.controller = ctr;
    }
    private cancel?: () => void;
    private confirm?: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/view/InputDialog.ets(26:5)", "entry");
            Column.width(CommonConstants.DIALOG_WIDTH);
            Column.borderRadius({ "id": 16777230, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777316, "type": 10003, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/view/InputDialog.ets(27:7)", "entry");
            Text.width(CommonConstants.FULL_WIDTH);
            Text.height({ "id": 16777241, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.fontSize({ "id": 16777240, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.fontColor({ "id": 16777294, "type": 10001, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.fontWeight(CommonConstants.BIG_FONT_WEIGHT);
            Text.textAlign(TextAlign.Start);
            Text.margin({
                top: { "id": 16777239, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" },
                bottom: { "id": 16777237, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" },
                left: { "id": 16777238, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" }
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: this.stepGoal === '' ? { "id": 16777305, "type": 10003, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" } : this.stepGoal });
            TextInput.debugLine("entry/src/main/ets/view/InputDialog.ets(40:7)", "entry");
            TextInput.width(CommonConstants.FULL_WIDTH);
            TextInput.type(InputType.Number);
            TextInput.fontSize({ "id": 16777236, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            TextInput.alignSelf(ItemAlign.Start);
            TextInput.backgroundColor(Color.White);
            TextInput.margin({
                top: { "id": 16777281, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" },
                bottom: { "id": 16777278, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" }
            });
            TextInput.onChange((value: string) => {
                this.stepGoal = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/view/InputDialog.ets(54:7)", "entry");
            Divider.width(CommonConstants.DIVIDER_WIDTH);
            Divider.height({ "id": 16777233, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Divider.vertical(false);
            Divider.color({ "id": 16777291, "type": 10001, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Divider.strokeWidth(CommonConstants.DIVIDER_STROKE_WIDTH);
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/InputDialog.ets(61:7)", "entry");
            Row.margin({
                top: { "id": 16777260, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" },
                bottom: { "id": 16777258, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" },
                left: { "id": 16777259, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777300, "type": 10003, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/view/InputDialog.ets(62:9)", "entry");
            Text.width({ "id": 16777282, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.height({ "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.fontColor({ "id": 16777292, "type": 10001, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.fontWeight(CommonConstants.BIG_FONT_WEIGHT);
            Text.fontSize({ "id": 16777275, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
            Text.margin({ right: { "id": 16777280, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" } });
            Text.onClick(() => {
                if (this.controller) {
                    this.controller.close();
                }
                if (this.cancel) {
                    this.cancel();
                }
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/view/InputDialog.ets(79:9)", "entry");
            Divider.height({ "id": 16777233, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Divider.vertical(true);
            Divider.color({ "id": 16777291, "type": 10001, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Divider.strokeWidth(CommonConstants.DIVIDER_STROKE_WIDTH);
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777301, "type": 10003, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/view/InputDialog.ets(85:9)", "entry");
            Text.width({ "id": 16777282, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.height({ "id": 16777276, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.fontColor({ "id": 16777292, "type": 10001, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.fontWeight(CommonConstants.BIG_FONT_WEIGHT);
            Text.fontSize({ "id": 16777275, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
            Text.margin({ left: { "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" } });
            Text.fontColor({ "id": 16777292, "type": 10001, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Text.onClick(() => {
                if (this.controller) {
                    this.controller.close();
                }
                if (this.confirm) {
                    this.confirm();
                }
            });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
