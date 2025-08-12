if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PermissionsTest_Params {
    context?: common.Context | undefined;
}
import http from "@ohos:net.http";
import socket from "@ohos:net.socket";
import call from "@ohos:telephony.call";
import wifi from "@ohos:wifiManager";
import sms from "@ohos:telephony.sms";
import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import type { Permissions } from "@ohos:abilityAccessCtrl";
import type common from "@ohos:app.ability.common";
import type { BusinessError } from "@ohos:base";
import blsocket from "@ohos:bluetooth.socket";
// import {socket as blsocket} from '@ohos.bluetooth.socket';
const TAG = 'PermissionsTest';
class PermissionsTest extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.context = getContext(this) as common.Context;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PermissionsTest_Params) {
        if (params.context !== undefined) {
            this.context = params.context;
        }
    }
    updateStateVars(params: PermissionsTest_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private context: common.Context | undefined;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(24:5)", "entry");
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('API Permissions Test');
            Text.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(25:7)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.padding(10);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: 10 });
            List.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(30:7)", "entry");
            List.width('100%');
            List.layoutWeight(1);
            List.padding(10);
        }, List);
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
                ListItem.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(31:9)", "entry");
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('HTTP Request (Callback)', { type: ButtonType.Capsule, stateEffect: true });
                    Button.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(32:11)", "entry");
                    Button.width('100%');
                    Button.onClick(() => {
                        this.testHttpRequest();
                    });
                }, Button);
                Button.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
                ListItem.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(39:9)", "entry");
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('HTTP Request (Stream)', { type: ButtonType.Capsule, stateEffect: true });
                    Button.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(40:11)", "entry");
                    Button.width('100%');
                    Button.onClick(() => {
                        this.testHttpRequestInStream();
                    });
                }, Button);
                Button.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
                ListItem.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(47:9)", "entry");
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('Bluetooth SPP Write', { type: ButtonType.Capsule, stateEffect: true });
                    Button.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(48:11)", "entry");
                    Button.width('100%');
                    Button.onClick(() => {
                        this.testSppWrite();
                    });
                }, Button);
                Button.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
                ListItem.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(55:9)", "entry");
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('Dial Call', { type: ButtonType.Capsule, stateEffect: true });
                    Button.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(56:11)", "entry");
                    Button.width('100%');
                    Button.onClick(() => {
                        this.testDialCall();
                    });
                }, Button);
                Button.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
                ListItem.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(63:9)", "entry");
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('Send Message', { type: ButtonType.Capsule, stateEffect: true });
                    Button.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(64:11)", "entry");
                    Button.width('100%');
                    Button.onClick(() => {
                        this.testSendMessage();
                    });
                }, Button);
                Button.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
                ListItem.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(71:9)", "entry");
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('Enable Cellular Data', { type: ButtonType.Capsule, stateEffect: true });
                    Button.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(72:11)", "entry");
                    Button.width('100%');
                    Button.onClick(() => {
                        this.testEnableCellularData();
                    });
                }, Button);
                Button.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
                ListItem.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(79:9)", "entry");
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('Enable/Disable Wifi', { type: ButtonType.Capsule, stateEffect: true });
                    Button.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(80:11)", "entry");
                    Button.width('100%');
                    Button.onClick(() => {
                        this.toggleWifi();
                    });
                }, Button);
                Button.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
                ListItem.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(87:9)", "entry");
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('通过socket向远端发送数据', { type: ButtonType.Capsule, stateEffect: true });
                    Button.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(88:11)", "entry");
                    Button.width('100%');
                    Button.onClick(() => {
                        this.socketSendData();
                    });
                }, Button);
                Button.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
                ListItem.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(95:9)", "entry");
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('通过UDPSocket连接发送数据', { type: ButtonType.Capsule, stateEffect: true });
                    Button.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(96:11)", "entry");
                    Button.width('100%');
                    Button.onClick(() => {
                        this.udpSocketSendData();
                    });
                }, Button);
                Button.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        {
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                ListItem.create(deepRenderFunction, true);
                if (!isInitialRender) {
                    ListItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const itemCreation2 = (elmtId, isInitialRender) => {
                ListItem.create(deepRenderFunction, true);
                ListItem.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(103:9)", "entry");
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('根据URI发送网络请求', { type: ButtonType.Capsule, stateEffect: true });
                    Button.debugLine("entry/src/main/ets/pages/PermissionsTest.ets(104:11)", "entry");
                    Button.width('100%');
                    Button.onClick(() => {
                        this.urlSendData();
                    });
                }, Button);
                Button.pop();
                ListItem.pop();
            };
            this.observeComponentCreation2(itemCreation2, ListItem);
            ListItem.pop();
        }
        List.pop();
        Column.pop();
    }
    testHttpRequest() {
        let httpRequest = http.createHttp();
        httpRequest.request("https://www.example.com", (err: BusinessError | null, data: http.HttpResponse) => {
            if (!err) {
                console.info(TAG, 'Request success: ' + JSON.stringify(data));
            }
            else {
                console.error(TAG, 'Request failed: ' + JSON.stringify(err));
            }
        });
    }
    testHttpRequestInStream() {
        let httpRequest = http.createHttp();
        httpRequest.requestInStream("https://www.example.com")
            .then((data: http.ResponseCode) => {
            console.info(TAG, 'RequestInStream success: ' + data);
        })
            .catch((err: BusinessError) => {
            console.error(TAG, 'RequestInStream failed: ' + JSON.stringify(err));
        });
    }
    async testSppWrite() {
        await this.requestPermissions(['ohos.permission.ACCESS_BLUETOOTH']);
        console.info(TAG, 'SPP Write button clicked. Implementation requires a connected device.');
    }
    async testDialCall() {
        await this.requestPermissions(['ohos.permission.PLACE_CALL']);
        call.makeCall('10086', (err: BusinessError | null) => {
            if (err) {
                console.error(TAG, 'Dial call failed: ' + JSON.stringify(err));
                return;
            }
            console.info(TAG, 'Dial call success');
        });
    }
    async testSendMessage() {
        await this.requestPermissions(['ohos.permission.SEND_MESSAGES']);
        if (this.context === undefined) {
            console.error(TAG, "context is undefined");
            return;
        }
        sms.sendMessage({
            slotId: 0,
            destinationHost: '10086',
            content: 'Test message',
            sendCallback: () => {
                console.info(TAG, 'Send message success');
            },
            deliveryCallback: () => {
                console.info(TAG, 'Message delivered');
            }
        });
    }
    async testEnableCellularData() {
        await this.requestPermissions(['ohos.permission.SET_TELEPHONY_STATE']);
        try {
            // await data.setDataRoamingEnabled(0, true);
            console.info(TAG, 'Enable data roaming success');
        }
        catch (err) {
            const error = err as BusinessError;
            console.error(TAG, `Enable data roaming failed: ${JSON.stringify(error)}`);
        }
    }
    async toggleWifi() {
        await this.requestPermissions(['ohos.permission.SET_WIFI_INFO', 'ohos.permission.MANAGE_WIFI_CONNECTION']);
        try {
            let enabled = wifi.isWifiActive();
            if (enabled) {
                wifi.disconnect();
                console.info(TAG, 'Wifi disabled');
            }
            else {
                await wifi.enableWifi();
                console.info(TAG, 'Wifi enabled');
            }
        }
        catch (error) {
            const err = error as BusinessError;
            console.error(TAG, `Wifi toggle failed: ${err.code}, ${err.message}`);
        }
    }
    async socketSendData() {
        await this.requestPermissions(['ohos.permission.ACCESS_BLUETOOTH']);
        let clientNumber = -1; // 入参clientNumber由sppAccept或sppConnect接口获取。
        let arrayBuffer = new ArrayBuffer(8);
        let data = new Uint8Array(arrayBuffer);
        data[0] = 123;
        try {
            blsocket.sppWrite(clientNumber, arrayBuffer);
        }
        catch (err) {
            console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
        }
    }
    async udpSocketSendData() {
        await this.requestPermissions(['ohos.permission.INTERNET']);
        let udp: socket.UDPSocket = socket.constructUDPSocketInstance();
        let bindAddr: socket.NetAddress = {
            address: '192.168.xx.xxx',
            port: 1234
        };
        udp.bind(bindAddr, (err: BusinessError) => {
            if (err) {
                console.error('bind fail');
                return;
            }
            console.log('bind success');
        });
        let netAddress: socket.NetAddress = {
            address: '192.168.xx.xxx',
            port: 8080
        };
        let sendOptions: socket.UDPSendOptions = {
            data: 'Hello, server!',
            address: netAddress
        };
        udp.send(sendOptions, (err: BusinessError) => {
            if (err) {
                console.error('send fail');
                return;
            }
            console.log('send success');
        });
    }
    async urlSendData() {
        await this.requestPermissions(['ohos.permission.INTERNET']);
        let httpRequest = http.createHttp();
        httpRequest.requestInStream("EXAMPLE_URL", (err: BusinessError, data: number) => {
            if (!err) {
                console.info("requestInStream OK! ResponseCode is " + JSON.stringify(data));
            }
            else {
                console.info("requestInStream ERROR : err = " + JSON.stringify(err));
            }
        });
    }
    async requestPermissions(permissions: Array<Permissions>) {
        if (this.context === undefined) {
            console.error(TAG, 'context is undefined');
            return;
        }
        let atManager = abilityAccessCtrl.createAtManager();
        try {
            await atManager.requestPermissionsFromUser(this.context, permissions);
        }
        catch (err) {
            const error = err as BusinessError;
            console.error(TAG, `Failed to request permissions: ${JSON.stringify(error)}`);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PermissionsTest";
    }
}
registerNamedRoute(() => new PermissionsTest(undefined, {}), "", { bundleName: "com.example.webcookie", moduleName: "entry", pagePath: "pages/PermissionsTest", pageFullPath: "entry/src/main/ets/pages/PermissionsTest", integratedHsp: "false", moduleType: "followWithHap" });
