import router from '@ohos.router';
import http from '@ohos.net.http';
import socket from '@ohos.net.socket';
import bluetooth from '@ohos.bluetoothManager';
import call from '@ohos.telephony.call';
import wifi from '@ohos.wifiManager';
import sms from '@ohos.telephony.sms';
import data from '@ohos.telephony.data';
import abilityAccessCtrl from '@ohos.abilityAccessCtrl';
import type { Permissions } from '@ohos.abilityAccessCtrl';
import common from '@ohos.app.ability.common';
import type { BusinessError } from '@ohos.base';
import { socket as blsocket }  from '@kit.ConnectivityKit';
// import {socket as blsocket} from '@ohos.bluetooth.socket';

const TAG = 'PermissionsTest';

@Entry
@Component
struct PermissionsTest {
  private context: common.Context | undefined = getContext(this) as common.Context;

  build() {
    Column() {
      Text('API Permissions Test')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .padding(10)

      List({ space: 10 }) {
        ListItem() {
          Button('HTTP Request (Callback)', { type: ButtonType.Capsule, stateEffect: true })
            .width('100%')
            .onClick(() => {
              this.testHttpRequest();
            })
        }

        ListItem() {
          Button('HTTP Request (Stream)', { type: ButtonType.Capsule, stateEffect: true })
            .width('100%')
            .onClick(() => {
              this.testHttpRequestInStream();
            })
        }

        ListItem() {
          Button('Bluetooth SPP Write', { type: ButtonType.Capsule, stateEffect: true })
            .width('100%')
            .onClick(() => {
              this.testSppWrite();
            })
        }

        ListItem() {
          Button('Dial Call', { type: ButtonType.Capsule, stateEffect: true })
            .width('100%')
            .onClick(() => {
              this.testDialCall();
            })
        }

        ListItem() {
          Button('Send Message', { type: ButtonType.Capsule, stateEffect: true })
            .width('100%')
            .onClick(() => {
              this.testSendMessage();
            })
        }

        ListItem() {
          Button('Enable Cellular Data', { type: ButtonType.Capsule, stateEffect: true })
            .width('100%')
            .onClick(() => {
              this.testEnableCellularData();
            })
        }

        ListItem() {
          Button('Enable/Disable Wifi', { type: ButtonType.Capsule, stateEffect: true })
            .width('100%')
            .onClick(() => {
              this.toggleWifi();
            })
        }

        ListItem() {
          Button('通过socket向远端发送数据', { type: ButtonType.Capsule, stateEffect: true })
            .width('100%')
            .onClick(() => {
              this.socketSendData();
            })
        }

        ListItem() {
          Button('通过UDPSocket连接发送数据', { type: ButtonType.Capsule, stateEffect: true })
            .width('100%')
            .onClick(() => {
              this.udpSocketSendData();
            })
        }

        ListItem() {
          Button('根据URI发送网络请求', { type: ButtonType.Capsule, stateEffect: true })
            .width('100%')
            .onClick(() => {
              this.urlSendData();
            })
        }


      }
      .width('100%')
      .layoutWeight(1)
      .padding(10)
    }
    .width('100%')
    .height('100%')
  }

  testHttpRequest() {
    let httpRequest = http.createHttp();
    httpRequest.request("https://www.example.com", (err: BusinessError | null, data: http.HttpResponse) => {
      if (!err) {
        console.info(TAG, 'Request success: ' + JSON.stringify(data));
      } else {
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
    } catch (err) {
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
      } else {
        await wifi.enableWifi();
        console.info(TAG, 'Wifi enabled');
      }
    } catch (error) {
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
    } catch (err) {
      console.error('errCode: ' + (err as BusinessError).code + ', errMessage: ' + (err as BusinessError).message);
    }
  }

  async udpSocketSendData() {
    await this.requestPermissions(['ohos.permission.INTERNET']);
    let udp: socket.UDPSocket = socket.constructUDPSocketInstance();
    let bindAddr: socket.NetAddress = {
      address: '192.168.xx.xxx',  // 本端地址
      port: 1234
    }
    udp.bind(bindAddr, (err: BusinessError) => {
      if (err) {
        console.error('bind fail');
        return;
      }
      console.log('bind success');
    });
    let netAddress: socket.NetAddress = {
      address: '192.168.xx.xxx',  // 对端地址
      port: 8080
    }
    let sendOptions: socket.UDPSendOptions = {
      data: 'Hello, server!',
      address: netAddress
    }
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
      } else {
        console.info("requestInStream ERROR : err = " + JSON.stringify(err));
      }
    })
  }

  async requestPermissions(permissions: Array<Permissions>) {
    if (this.context === undefined) {
      console.error(TAG, 'context is undefined');
      return;
    }
    let atManager = abilityAccessCtrl.createAtManager();
    try {
      await atManager.requestPermissionsFromUser(this.context, permissions);
    } catch (err) {
      const error = err as BusinessError;
      console.error(TAG, `Failed to request permissions: ${JSON.stringify(error)}`);
    }
  }
} 