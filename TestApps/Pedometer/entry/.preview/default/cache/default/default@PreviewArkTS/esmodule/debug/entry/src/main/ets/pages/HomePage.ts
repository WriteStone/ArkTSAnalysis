if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    currentSteps?: string;
    stepGoal?: string;
    oldSteps?: string;
    startPosition?: string;
    currentLocation?: string;
    locale?: string;
    latitude?: number;
    longitude?: number;
    progressValue?: number;
    isStart?: boolean;
    context?: common.UIAbilityContext;
    sensorCallback?: (data: sensor.PedometerResponse) => void;
    getGeolocation?: (location: geoLocationManager.Location) => void;
}
import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import type common from "@ohos:app.ability.common";
import geoLocationManager from "@ohos:geoLocationManager";
import sensor from "@ohos:sensor";
import i18n from "@ohos:i18n";
import { BackgroundUtil } from "@bundle:com.example.pedometerapp/entry/ets/common/utils/BackgroundUtil";
import { CompletionStatus } from "@bundle:com.example.pedometerapp/entry/ets/view/CompletionStatus";
import { CommonConstants } from "@bundle:com.example.pedometerapp/entry/ets/common/constants/CommonConstants";
import { CurrentSituation } from "@bundle:com.example.pedometerapp/entry/ets/view/CurrentSituation";
import LocationUtil from "@bundle:com.example.pedometerapp/entry/ets/common/utils/LocationUtil";
import Logger from "@bundle:com.example.pedometerapp/entry/ets/common/utils/Logger";
import NumberUtil from "@bundle:com.example.pedometerapp/entry/ets/common/utils/NumberUtil";
import StepsUtil from "@bundle:com.example.pedometerapp/entry/ets/common/utils/StepsUtil";
const TAG: string = 'HomePage';
const uiContext: UIContext | undefined = AppStorage.get('uiContext');
class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentSteps = new ObservedPropertySimplePU(CommonConstants.INITIALIZATION_VALUE, this, "currentSteps");
        this.__stepGoal = new ObservedPropertySimplePU('', this, "stepGoal");
        this.addProvidedVar("stepGoal", this.__stepGoal, false);
        this.__oldSteps = new ObservedPropertySimplePU('', this, "oldSteps");
        this.__startPosition = new ObservedPropertySimplePU('', this, "startPosition");
        this.__currentLocation = new ObservedPropertySimplePU('', this, "currentLocation");
        this.__locale = new ObservedPropertySimplePU(i18n.System.getAppPreferredLanguage(), this, "locale");
        this.__latitude = new ObservedPropertySimplePU(0, this, "latitude");
        this.__longitude = new ObservedPropertySimplePU(0, this, "longitude");
        this.__progressValue = new ObservedPropertySimplePU(0, this, "progressValue");
        this.__isStart = new ObservedPropertySimplePU(false, this, "isStart");
        this.context = uiContext?.getHostContext() as common.UIAbilityContext;
        this.sensorCallback = (data: sensor.PedometerResponse) => {
            try {
                if (this.isStart) {
                    if (StepsUtil.checkStrIsEmpty(this.oldSteps)) {
                        this.oldSteps = data.steps.toString();
                        StepsUtil.putStorageValue(CommonConstants.OLD_STEPS, this.oldSteps);
                    }
                    else {
                        this.currentSteps = (data.steps - NumberUtil._parseInt(this.oldSteps, 10)).toString();
                    }
                }
                else {
                    this.currentSteps = data.steps.toString();
                }
                if (StepsUtil.checkStrIsEmpty(this.stepGoal) || !this.isStart) {
                    return;
                }
                StepsUtil.putStorageValue(CommonConstants.CURRENT_STEPS, this.currentSteps);
                this.progressValue = StepsUtil.getProgressValue(NumberUtil._parseInt(this.stepGoal, 10), NumberUtil._parseInt(this.currentSteps, 10));
                StepsUtil.putStorageValue(CommonConstants.PROGRESS_VALUE_TAG, String(this.progressValue));
            }
            catch (err) {
                Logger.error(TAG, 'Sensor on err' + JSON.stringify(err));
            }
        };
        this.getGeolocation = (location: geoLocationManager.Location) => {
            if (this.latitude === location.latitude && this.longitude === location.longitude) {
                return;
            }
            this.latitude = location.latitude;
            this.longitude = location.longitude;
            let reverseGeocodeRequest: geoLocationManager.ReverseGeoCodeRequest = {
                'locale': this.locale.toString().includes('zh') ? 'zh' : 'en',
                'latitude': this.latitude,
                'longitude': this.longitude,
                'maxItems': 1
            };
            geoLocationManager.getAddressesFromLocation(reverseGeocodeRequest).then(data => {
                if (data[0].placeName) {
                    this.currentLocation = data[0].placeName;
                }
            }).catch((err: Error) => {
                Logger.error(TAG, 'GetAddressesFromLocation err ' + JSON.stringify(err));
            });
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.currentSteps !== undefined) {
            this.currentSteps = params.currentSteps;
        }
        if (params.stepGoal !== undefined) {
            this.stepGoal = params.stepGoal;
        }
        if (params.oldSteps !== undefined) {
            this.oldSteps = params.oldSteps;
        }
        if (params.startPosition !== undefined) {
            this.startPosition = params.startPosition;
        }
        if (params.currentLocation !== undefined) {
            this.currentLocation = params.currentLocation;
        }
        if (params.locale !== undefined) {
            this.locale = params.locale;
        }
        if (params.latitude !== undefined) {
            this.latitude = params.latitude;
        }
        if (params.longitude !== undefined) {
            this.longitude = params.longitude;
        }
        if (params.progressValue !== undefined) {
            this.progressValue = params.progressValue;
        }
        if (params.isStart !== undefined) {
            this.isStart = params.isStart;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.sensorCallback !== undefined) {
            this.sensorCallback = params.sensorCallback;
        }
        if (params.getGeolocation !== undefined) {
            this.getGeolocation = params.getGeolocation;
        }
    }
    updateStateVars(params: HomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentSteps.purgeDependencyOnElmtId(rmElmtId);
        this.__stepGoal.purgeDependencyOnElmtId(rmElmtId);
        this.__oldSteps.purgeDependencyOnElmtId(rmElmtId);
        this.__startPosition.purgeDependencyOnElmtId(rmElmtId);
        this.__currentLocation.purgeDependencyOnElmtId(rmElmtId);
        this.__locale.purgeDependencyOnElmtId(rmElmtId);
        this.__latitude.purgeDependencyOnElmtId(rmElmtId);
        this.__longitude.purgeDependencyOnElmtId(rmElmtId);
        this.__progressValue.purgeDependencyOnElmtId(rmElmtId);
        this.__isStart.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentSteps.aboutToBeDeleted();
        this.__stepGoal.aboutToBeDeleted();
        this.__oldSteps.aboutToBeDeleted();
        this.__startPosition.aboutToBeDeleted();
        this.__currentLocation.aboutToBeDeleted();
        this.__locale.aboutToBeDeleted();
        this.__latitude.aboutToBeDeleted();
        this.__longitude.aboutToBeDeleted();
        this.__progressValue.aboutToBeDeleted();
        this.__isStart.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentSteps: ObservedPropertySimplePU<string>;
    get currentSteps() {
        return this.__currentSteps.get();
    }
    set currentSteps(newValue: string) {
        this.__currentSteps.set(newValue);
    }
    private __stepGoal: ObservedPropertySimplePU<string>;
    get stepGoal() {
        return this.__stepGoal.get();
    }
    set stepGoal(newValue: string) {
        this.__stepGoal.set(newValue);
    }
    private __oldSteps: ObservedPropertySimplePU<string>;
    get oldSteps() {
        return this.__oldSteps.get();
    }
    set oldSteps(newValue: string) {
        this.__oldSteps.set(newValue);
    }
    private __startPosition: ObservedPropertySimplePU<string>;
    get startPosition() {
        return this.__startPosition.get();
    }
    set startPosition(newValue: string) {
        this.__startPosition.set(newValue);
    }
    private __currentLocation: ObservedPropertySimplePU<string>;
    get currentLocation() {
        return this.__currentLocation.get();
    }
    set currentLocation(newValue: string) {
        this.__currentLocation.set(newValue);
    }
    private __locale: ObservedPropertySimplePU<string>;
    get locale() {
        return this.__locale.get();
    }
    set locale(newValue: string) {
        this.__locale.set(newValue);
    }
    private __latitude: ObservedPropertySimplePU<number>;
    get latitude() {
        return this.__latitude.get();
    }
    set latitude(newValue: number) {
        this.__latitude.set(newValue);
    }
    private __longitude: ObservedPropertySimplePU<number>;
    get longitude() {
        return this.__longitude.get();
    }
    set longitude(newValue: number) {
        this.__longitude.set(newValue);
    }
    private __progressValue: ObservedPropertySimplePU<number>;
    get progressValue() {
        return this.__progressValue.get();
    }
    set progressValue(newValue: number) {
        this.__progressValue.set(newValue);
    }
    private __isStart: ObservedPropertySimplePU<boolean>;
    get isStart() {
        return this.__isStart.get();
    }
    set isStart(newValue: boolean) {
        this.__isStart.set(newValue);
    }
    private context: common.UIAbilityContext;
    private sensorCallback: (data: sensor.PedometerResponse) => void;
    private getGeolocation: (location: geoLocationManager.Location) => void;
    onPageShow() {
        this.init();
        this.requestPermissions();
    }
    onPageHide() {
        sensor.off(sensor.SensorId.PEDOMETER);
    }
    init() {
        StepsUtil.getStorageValue(CommonConstants.IS_START).then((res: string) => {
            if (res === CommonConstants.TRUE) {
                this.isStart = true;
                StepsUtil.getStorageValue(CommonConstants.CURRENT_STEPS).then((res: string) => {
                    if (StepsUtil.checkStrIsEmpty(res)) {
                        return;
                    }
                    this.currentSteps = res;
                });
                StepsUtil.getStorageValue(CommonConstants.PROGRESS_VALUE_TAG).then((res: string) => {
                    if (StepsUtil.checkStrIsEmpty(res)) {
                        return;
                    }
                    this.progressValue = NumberUtil._parseInt(res, 10);
                });
                StepsUtil.getStorageValue(CommonConstants.START_POSITION).then((res: string) => {
                    if (StepsUtil.checkStrIsEmpty(res)) {
                        return;
                    }
                    this.startPosition = res;
                });
                StepsUtil.getStorageValue(CommonConstants.OLD_STEPS).then((res: string) => {
                    if (StepsUtil.checkStrIsEmpty(res)) {
                        return;
                    }
                    this.oldSteps = res;
                });
            }
            else {
                this.isStart = false;
            }
        });
        StepsUtil.getStorageValue(CommonConstants.STEP_GOAL).then((res: string) => {
            if (StepsUtil.checkStrIsEmpty(res)) {
                return;
            }
            this.stepGoal = res;
        });
    }
    requestPermissions(): void {
        let atManager = abilityAccessCtrl.createAtManager();
        try {
            atManager.requestPermissionsFromUser(this.context, CommonConstants.REQUEST_PERMISSIONS).then((data) => {
                if (data.authResults[0] !== 0 || data.authResults[1] !== 0) {
                    return;
                }
                const that = this;
                try {
                    sensor.on(sensor.SensorId.PEDOMETER, this.sensorCallback, { interval: CommonConstants.SENSOR_INTERVAL });
                }
                catch (err) {
                    console.error('On fail, errCode: ' + JSON.stringify(err));
                }
                LocationUtil.geolocationOn(this.getGeolocation);
            }).catch((err: Error) => {
                Logger.error(TAG, 'requestPermissionsFromUser err' + JSON.stringify(err));
            });
        }
        catch (err) {
            Logger.error(TAG, 'requestPermissionsFromUser err' + JSON.stringify(err));
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.debugLine("entry/src/main/ets/pages/HomePage.ets(171:5)", "entry");
            Stack.width(CommonConstants.FULL_WIDTH);
            Stack.height(CommonConstants.FULL_HEIGHT);
            Stack.backgroundColor(Color.White);
        }, Stack);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new CompletionStatus(this, {
                        progressValue: this.__progressValue
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 172, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            progressValue: this.progressValue
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "CompletionStatus" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new CurrentSituation(this, {
                        currentSteps: this.currentSteps,
                        startPosition: this.startPosition,
                        currentLocation: this.currentLocation
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 176, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            currentSteps: this.currentSteps,
                            startPosition: this.startPosition,
                            currentLocation: this.currentLocation
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        currentSteps: this.currentSteps,
                        startPosition: this.startPosition,
                        currentLocation: this.currentLocation
                    });
                }
            }, { name: "CurrentSituation" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/HomePage.ets(182:7)", "entry");
            Row.width(CommonConstants.FULL_WIDTH);
            Row.height({ "id": 16777218, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Row.margin({ top: { "id": 16777219, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" } });
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isStart ? { "id": 16777317, "type": 10003, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" } : { "id": 16777313, "type": 10003, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Button.debugLine("entry/src/main/ets/pages/HomePage.ets(183:9)", "entry");
            Button.width({ "id": 16777265, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Button.height({ "id": 16777263, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Button.borderRadius({ "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Button.backgroundColor({ "id": 16777289, "type": 10001, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Button.fontSize({ "id": 16777266, "type": 10002, params: [], "bundleName": "com.example.pedometerapp", "moduleName": "entry" });
            Button.fontColor(Color.White);
            Button.fontWeight(CommonConstants.BIG_FONT_WEIGHT);
            Button.onClick(() => {
                if (this.isStart) {
                    this.isStart = false;
                    this.oldSteps = '';
                    StepsUtil.CleanStepsData();
                    BackgroundUtil.stopContinuousTask(this.context);
                }
                else {
                    if (this.stepGoal === '' || this.currentLocation === '') {
                        this.getUIContext().getPromptAction().showToast({ message: CommonConstants.WAIT });
                    }
                    else {
                        this.isStart = true;
                        this.startPosition = this.currentLocation;
                        StepsUtil.putStorageValue(CommonConstants.START_POSITION, this.startPosition);
                        this.currentSteps = CommonConstants.INITIALIZATION_VALUE;
                        this.progressValue = 0;
                        BackgroundUtil.startContinuousTask(this.context);
                    }
                }
                StepsUtil.putStorageValue(CommonConstants.IS_START, String(this.isStart));
            });
        }, Button);
        Button.pop();
        Row.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "HomePage";
    }
}
registerNamedRoute(() => new HomePage(undefined, {}), "", { bundleName: "com.example.pedometerapp", moduleName: "entry", pagePath: "pages/HomePage", pageFullPath: "entry/src/main/ets/pages/HomePage", integratedHsp: "false", moduleType: "followWithHap" });
