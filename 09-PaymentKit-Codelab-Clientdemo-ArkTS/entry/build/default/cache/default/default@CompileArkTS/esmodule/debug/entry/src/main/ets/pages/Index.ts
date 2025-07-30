if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    context?: common.UIAbilityContext;
    calendarMgr?: calendarManager.CalendarManager | undefined;
    calendar?: calendarManager.Calendar | undefined;
    paymentResult?: string;
    showDialog?: boolean;
    dialogTitle?: string;
    dialogMessage?: string;
}
import paymentService from "@hms:core.payment.paymentService";
import type { BusinessError as BusinessError } from "@ohos:base";
import type common from "@ohos:app.ability.common";
import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import type { PermissionRequestResult as PermissionRequestResult } from "@ohos:abilityAccessCtrl";
import type { Permissions as Permissions } from "@ohos:abilityAccessCtrl";
import calendarManager from "@ohos:calendarManager";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.context = getContext(this) as common.UIAbilityContext;
        this.calendarMgr = undefined;
        this.calendar = undefined;
        this.__paymentResult = new ObservedPropertySimplePU('', this, "paymentResult");
        this.__showDialog = new ObservedPropertySimplePU(false, this, "showDialog");
        this.__dialogTitle = new ObservedPropertySimplePU('', this, "dialogTitle");
        this.__dialogMessage = new ObservedPropertySimplePU('', this, "dialogMessage");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.calendarMgr !== undefined) {
            this.calendarMgr = params.calendarMgr;
        }
        if (params.calendar !== undefined) {
            this.calendar = params.calendar;
        }
        if (params.paymentResult !== undefined) {
            this.paymentResult = params.paymentResult;
        }
        if (params.showDialog !== undefined) {
            this.showDialog = params.showDialog;
        }
        if (params.dialogTitle !== undefined) {
            this.dialogTitle = params.dialogTitle;
        }
        if (params.dialogMessage !== undefined) {
            this.dialogMessage = params.dialogMessage;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__paymentResult.purgeDependencyOnElmtId(rmElmtId);
        this.__showDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__dialogTitle.purgeDependencyOnElmtId(rmElmtId);
        this.__dialogMessage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__paymentResult.aboutToBeDeleted();
        this.__showDialog.aboutToBeDeleted();
        this.__dialogTitle.aboutToBeDeleted();
        this.__dialogMessage.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private context: common.UIAbilityContext;
    private calendarMgr: calendarManager.CalendarManager | undefined;
    private calendar: calendarManager.Calendar | undefined;
    private __paymentResult: ObservedPropertySimplePU<string>;
    get paymentResult() {
        return this.__paymentResult.get();
    }
    set paymentResult(newValue: string) {
        this.__paymentResult.set(newValue);
    }
    private __showDialog: ObservedPropertySimplePU<boolean>;
    get showDialog() {
        return this.__showDialog.get();
    }
    set showDialog(newValue: boolean) {
        this.__showDialog.set(newValue);
    }
    private __dialogTitle: ObservedPropertySimplePU<string>;
    get dialogTitle() {
        return this.__dialogTitle.get();
    }
    set dialogTitle(newValue: string) {
        this.__dialogTitle.set(newValue);
    }
    private __dialogMessage: ObservedPropertySimplePU<string>;
    get dialogMessage() {
        return this.__dialogMessage.get();
    }
    set dialogMessage(newValue: string) {
        this.__dialogMessage.set(newValue);
    }
    async aboutToAppear() {
        try {
            this.calendarMgr = calendarManager.getCalendarManager(this.context);
            const calendars = await this.calendarMgr.getAllCalendars();
            if (calendars && calendars.length > 0) {
                this.calendar = calendars[0];
            }
            else {
                const calendarAccount: calendarManager.CalendarAccount = {
                    name: 'MyCalendar',
                    type: calendarManager.CalendarType.LOCAL
                };
                this.calendar = await this.calendarMgr.createCalendar(calendarAccount);
            }
        }
        catch (error) {
            console.error(`Failed to get calendar manager. Code: ${(error as BusinessError).code}, message: ${(error as BusinessError).message}`);
        }
    }
    async requestPermission(permissions: Array<Permissions>): Promise<boolean> {
        let atManager = abilityAccessCtrl.createAtManager();
        try {
            const result: PermissionRequestResult = await atManager.requestPermissionsFromUser(this.context, permissions);
            let isGranted = true;
            for (let i = 0; i < result.authResults.length; i++) {
                if (result.authResults[i] !== 0) {
                    isGranted = false;
                    break;
                }
            }
            return isGranted;
        }
        catch (err) {
            console.error(`Failed to request permissions. Code: ${(err as BusinessError).code}, message: ${(err as BusinessError).message}`);
            return false;
        }
    }
    async addEvent() {
        const hasPermission = await this.requestPermission(['ohos.permission.WRITE_CALENDAR']);
        if (!hasPermission || !this.calendar) {
            console.error('Permission denied or calendar not found.');
            return;
        }
        const event: calendarManager.Event = {
            title: '单次日程',
            type: calendarManager.EventType.NORMAL,
            startTime: new Date().getTime(),
            endTime: new Date().getTime() + 60 * 60 * 1000, // 1 hour later
        };
        try {
            const eventId = await this.calendar.addEvent(event);
            console.info(`Succeeded in adding event, id -> ${eventId}`);
        }
        catch (error) {
            console.error(`Failed to addEvent. Code: ${(error as BusinessError).code}, message: ${(error as BusinessError).message}`);
        }
    }
    async addEvents() {
        const hasPermission = await this.requestPermission(['ohos.permission.WRITE_CALENDAR']);
        if (!hasPermission || !this.calendar) {
            console.error('Permission denied or calendar not found.');
            return;
        }
        const events: calendarManager.Event[] = [
            {
                title: '批量日程1',
                type: calendarManager.EventType.NORMAL,
                startTime: new Date().getTime(),
                endTime: new Date().getTime() + 60 * 60 * 1000, // 1 hour later
            },
            {
                title: '批量日程2',
                type: calendarManager.EventType.NORMAL,
                startTime: new Date().getTime() + 2 * 60 * 60 * 1000,
                endTime: new Date().getTime() + 3 * 60 * 60 * 1000, // 3 hours later
            }
        ];
        try {
            await this.calendar.addEvents(events);
            console.info(`Succeeded in adding events`);
        }
        catch (error) {
            console.error(`Failed to addEvents. Code: ${(error as BusinessError).code}, message: ${(error as BusinessError).message}`);
        }
    }
    async updateEvent() {
        const hasPermission = await this.requestPermission(['ohos.permission.WRITE_CALENDAR', 'ohos.permission.READ_CALENDAR']);
        if (!hasPermission || !this.calendar) {
            console.error('Permission denied or calendar not found.');
            return;
        }
        try {
            const events = await this.calendar.getEvents(undefined);
            if (events.length > 0) {
                const eventToUpdate = events[0];
                eventToUpdate.title = '已更新的日程';
                await this.calendar.updateEvent(eventToUpdate);
                console.info(`Succeeded in updating event`);
            }
            else {
                console.info(`No event to update.`);
            }
        }
        catch (error) {
            console.error(`Failed to updateEvent. Code: ${(error as BusinessError).code}, message: ${(error as BusinessError).message}`);
        }
    }
    async requestPaymentPromise() {
        try {
            // 创建支付订单信息字符串
            const orderStr = `{
        "app_id": "your_app_id",
        "merc_no": "your_merchant_id",
        "prepay_id": "generated_prepay_id",
        "timestamp": "${new Date().getTime()}",
        "noncestr": "${this.generateNonceStr()}",
        "sign": "your_signature",
        "auth_id": "your_auth_id"
      }`;
            // 调用支付接口
            await paymentService.requestPayment(this.context, orderStr);
            // 支付成功
            console.info('支付成功');
            // 显示支付成功对话框
            this.showSuccessDialog();
        }
        catch (error) {
            // 支付失败
            console.error(`支付失败, 错误码: ${(error as BusinessError).code}, 错误信息: ${(error as BusinessError).message}`);
            // 显示支付失败对话框
            this.showFailureDialog(`支付失败: ${(error as BusinessError).message}`);
        }
    }
    // 显示支付成功对话框
    showSuccessDialog() {
        this.dialogTitle = '支付结果';
        this.dialogMessage = '支付成功';
        this.showDialog = true;
    }
    // 显示支付失败对话框
    showFailureDialog(errorMsg: string) {
        this.dialogTitle = '支付结果';
        this.dialogMessage = `支付失败: ${errorMsg}`;
        this.showDialog = true;
    }
    // 生成随机字符串
    generateNonceStr(length: number = 32): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async requestPaymentCallBack() {
        try {
            // 创建支付订单信息字符串
            const orderStr = `{
        "app_id": "your_app_id",
        "merc_no": "your_merchant_id",
        "prepay_id": "generated_prepay_id",
        "timestamp": "${new Date().getTime()}",
        "noncestr": "${this.generateNonceStr()}",
        "sign": "your_signature",
        "auth_id": "your_auth_id"
      }`;
            // 调用支付接口
            paymentService.requestPayment(this.context, orderStr, (error: BusinessError) => {
                if (error) {
                    // 支付失败
                    console.error(`支付失败, 错误码: ${error.code}, 错误信息: ${error.message}`);
                    // 显示支付失败对话框
                    this.showFailureDialog(`支付失败: ${error.message}`);
                    return;
                }
                // 支付成功
                console.info('支付成功');
                // 显示支付成功对话框
                this.showSuccessDialog();
            });
        }
        catch (error) {
            // 处理其他错误
            console.error(`发生错误: ${(error as Error).message}`);
            // 显示错误对话框
            this.showFailureDialog(`发生错误: ${(error as Error).message}`);
        }
    }
    async requestContractPromise() {
        try {
            // 创建合约信息字符串
            const contractStr = `{
        "appId": "your_app_id",
        "preSignNo": "your_pre_sign_no"
      }`;
            // 调用签约接口
            await paymentService.requestContract(this.context, contractStr);
            // 签约成功
            console.info('签约成功');
            // 显示签约成功对话框
            this.showSuccessDialog();
        }
        catch (error) {
            // 签约失败
            console.error(`签约失败, 错误码: ${(error as BusinessError).code}, 错误信息: ${(error as BusinessError).message}`);
            // 显示签约失败对话框
            this.showFailureDialog(`签约失败: ${(error as BusinessError).message}`);
        }
    }
    async requestContractCallBack() {
        try {
            // 创建合约信息字符串
            const contractStr = `{
        "appId": "your_app_id",
        "preSignNo": "your_pre_sign_no"
      }`;
            // 调用签约接口
            paymentService.requestContract(this.context, contractStr, (error: BusinessError) => {
                if (error) {
                    // 签约失败
                    console.error(`签约失败, 错误码: ${error.code}, 错误信息: ${error.message}`);
                    // 显示签约失败对话框
                    this.showFailureDialog(`签约失败: ${error.message}`);
                    return;
                }
                // 签约成功
                console.info('签约成功');
                // 显示签约成功对话框
                this.showSuccessDialog();
            });
        }
        catch (error) {
            // 处理其他错误
            console.error(`发生错误: ${(error as Error).message}`);
            // 显示错误对话框
            this.showFailureDialog(`发生错误: ${(error as Error).message}`);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.justifyContent(FlexAlign.Center);
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 显示对话框
            if (this.showDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('80%');
                        Column.borderRadius(20);
                        Column.backgroundColor(Color.White);
                        Column.padding(10);
                        Column.position({ x: '10%', y: '30%' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.dialogTitle);
                        Text.fontSize(20);
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ top: 20, bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.dialogMessage);
                        Text.fontSize(16);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确定');
                        Button.type(ButtonType.Capsule);
                        Button.width('80%');
                        Button.margin({ bottom: 20 });
                        Button.onClick(() => {
                            this.showDialog = false;
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('添加日程');
            Button.type(ButtonType.Capsule);
            Button.width('50%');
            Button.margin(10);
            Button.onClick(() => {
                this.addEvent();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('批量添加日程');
            Button.type(ButtonType.Capsule);
            Button.width('50%');
            Button.margin(10);
            Button.onClick(() => {
                this.addEvents();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('更新日程');
            Button.type(ButtonType.Capsule);
            Button.width('50%');
            Button.margin(10);
            Button.onClick(() => {
                this.updateEvent();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('requestPaymentPromise');
            Button.type(ButtonType.Capsule);
            Button.width('50%');
            Button.margin(10);
            Button.onClick(() => {
                this.requestPaymentPromise();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('requestPaymentCallBack');
            Button.type(ButtonType.Capsule);
            Button.width('50%');
            Button.margin(10);
            Button.onClick(() => {
                this.requestPaymentCallBack();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('requestContractPromise');
            Button.type(ButtonType.Capsule);
            Button.width('50%');
            Button.margin(10);
            Button.onClick(() => {
                this.requestContractPromise();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('requestContractCallBack');
            Button.type(ButtonType.Capsule);
            Button.width('50%');
            Button.margin(10);
            Button.onClick(() => {
                this.requestContractCallBack();
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.huawei.hms.payment.demo", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
