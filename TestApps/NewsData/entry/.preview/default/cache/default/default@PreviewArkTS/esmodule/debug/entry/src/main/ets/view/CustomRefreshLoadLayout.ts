if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CustomLayout_Params {
    customRefreshLoadClass?: CustomRefreshLoadLayoutClass;
}
import type { CustomRefreshLoadLayoutClass } from '../viewmodel/NewsData';
import { CommonConstant as Const } from "@bundle:com.example.newsdataarkts/entry/ets/common/constant/CommonConstant";
export default class CustomLayout extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__customRefreshLoadClass = new SynchedPropertyNesedObjectPU(params.customRefreshLoadClass, this, "customRefreshLoadClass");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CustomLayout_Params) {
        this.__customRefreshLoadClass.set(params.customRefreshLoadClass);
    }
    updateStateVars(params: CustomLayout_Params) {
        this.__customRefreshLoadClass.set(params.customRefreshLoadClass);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__customRefreshLoadClass.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__customRefreshLoadClass.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __customRefreshLoadClass: SynchedPropertyNesedObjectPU<CustomRefreshLoadLayoutClass>;
    get customRefreshLoadClass() {
        return this.__customRefreshLoadClass.get();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/CustomRefreshLoadLayout.ets(27:5)", "entry");
            Row.clip(true);
            Row.width(Const.FULL_WIDTH);
            Row.justifyContent(FlexAlign.Center);
            Row.height(this.customRefreshLoadClass.heightValue);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.customRefreshLoadClass.imageSrc);
            Image.debugLine("entry/src/main/ets/view/CustomRefreshLoadLayout.ets(28:7)", "entry");
            Image.width(Const.RefreshLayout_IMAGE_WIDTH);
            Image.height(Const.RefreshLayout_IMAGE_HEIGHT);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.customRefreshLoadClass.textValue);
            Text.debugLine("entry/src/main/ets/view/CustomRefreshLoadLayout.ets(32:7)", "entry");
            Text.margin({
                left: Const.RefreshLayout_TEXT_MARGIN_LEFT,
                bottom: Const.RefreshLayout_TEXT_MARGIN_BOTTOM
            });
            Text.fontSize(Const.RefreshLayout_TEXT_FONT_SIZE);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
