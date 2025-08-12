/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import media from '@ohos.multimedia.media';
import audio from '@ohos.multimedia.audio';
import camera from '@ohos.multimedia.camera';
import prompt from '@ohos.promptAction';
import common from '@ohos.app.ability.common';
import commonEventManager from '@ohos.commonEventManager';
import fs from '@ohos.file.fs';
import window from '@ohos.window';
import image from '@ohos.multimedia.image';
import screenshot from '@ohos.screenshot';
import type { BusinessError } from '@kit.BasicServicesKit';
import { camera as cameraKit, cameraPicker } from '@kit.CameraKit';
import { fileIo, fileUri } from '@kit.CoreFileKit';

@Component
export struct PermissionsPage {
  logTag: string = 'PermissionsPage';
  domainId: number = 0x0000;
  private audioRecorder: media.AudioRecorder | null = null;
  private avRecorder: media.AVRecorder | null = null;
  private audioCapturer: audio.AudioCapturer | null = null;
  private cameraManager: camera.CameraManager | null = null;
  private cameraInput: camera.CameraInput | null = null;
  private photoOutput: camera.PhotoOutput | null = null;
  @State isRecording: boolean = false;
  @State isAVRecording: boolean = false;
  @State isAudioCapturing: boolean = false;
  @State isScreenRecording: boolean = false;
  @State isCameraOpened: boolean = false;
  context: common.UIAbilityContext | null = null;
  @State imageUri: string = '';
  
  aboutToAppear() {
    // 获取上下文
    this.context = getContext(this) as common.UIAbilityContext;
  }
  
  // Show toast message
  showToast(message: string) {
    prompt.showToast({
      message: message,
      duration: 2000
    });
  }

  // 本地录音 - AudioRecorder
  startAudioRecording() {
    try {
      // 如果已经在录音，先停止
      if (this.isRecording && this.audioRecorder) {
        this.stopAudioRecording();
        return;
      }
      
      if (!this.context) {
        this.showToast('无法获取上下文');
        return;
      }
      
      // 创建录音文件路径
      let cacheDir = this.context.cacheDir;
      let audioFile = cacheDir + '/audio_record_' + new Date().getTime() + '.m4a';
      
      // 创建AudioRecorder实例
      this.audioRecorder = media.createAudioRecorder();
      console.info(`${this.logTag}: AudioRecorder created`);
      
      // 创建录音配置
      const audioConfig: media.AudioRecorderConfig = {
        audioEncoderMime: media.CodecMimeType.AUDIO_AAC,
        audioSampleRate: 44100,
        fileFormat: media.ContainerFormatType.CFT_MPEG_4,
        uri: 'file://' + audioFile
      };
      
      // 准备录音
      this.audioRecorder.prepare(audioConfig);
      
      // 开始录音
      this.audioRecorder.start();
      
      this.isRecording = true;
      this.showToast('开始录音，录音文件将保存到：' + audioFile);
      console.info(`${this.logTag}: Recording started. File: ${audioFile}`);
    } catch (err) {
      console.error(`${this.logTag}: Error in AudioRecorder: ${JSON.stringify(err)}`);
      this.showToast('AudioRecorder 错误: ' + JSON.stringify(err));
    }
  }
  
  // 停止录音
  stopAudioRecording() {
    if (!this.audioRecorder || !this.isRecording) {
      return;
    }
    
    try {
      // 停止录音
      this.audioRecorder.stop();
      
      this.showToast('录音已停止并保存');
      console.info(`${this.logTag}: Recording stopped`);
      
      this.isRecording = false;
      
      // 释放资源
      this.audioRecorder.release();
      this.audioRecorder = null;
    } catch (err) {
      console.error(`${this.logTag}: Error stopping AudioRecorder: ${JSON.stringify(err)}`);
      this.showToast('停止录音错误: ' + JSON.stringify(err));
    }
  }

  // 本地录音 - AVRecorder
  startAVRecording() {
    try {
      // 如果已经在录制，先停止
      if (this.isAVRecording && this.avRecorder) {
        this.stopAVRecording();
        return;
      }
      
      if (!this.context) {
        this.showToast('无法获取上下文');
        return;
      }
      
      // 创建录制文件路径
      let cacheDir = this.context.cacheDir;
      let videoFile = cacheDir + '/av_record_' + new Date().getTime() + '.mp4';
      
      // 创建AVRecorder实例
      const avRecorderPromise = media.createAVRecorder();
      avRecorderPromise.then((recorder) => {
        this.avRecorder = recorder;
        console.info(`${this.logTag}: AVRecorder created`);
        
        // 创建AVRecorder配置
        const avProfile: media.AVRecorderProfile = {
          audioBitrate: 48000,
          audioChannels: 2,
          audioSampleRate: 44100,
          videoFrameRate: 30,
          videoFrameWidth: 640,
          videoFrameHeight: 480,
          fileFormat: media.ContainerFormatType.CFT_MPEG_4
        };
        
        // 创建录制配置
        const avConfig: media.AVRecorderConfig = {
          audioSourceType: media.AudioSourceType.AUDIO_SOURCE_TYPE_MIC,
          videoSourceType: media.VideoSourceType.VIDEO_SOURCE_TYPE_SURFACE_YUV,
          profile: avProfile,
          url: 'file://' + videoFile
        };
        
        // 准备录制
        this.avRecorder.prepare(avConfig);
        
        // 开始录制
        this.avRecorder.start();
        
        this.isAVRecording = true;
        this.showToast('开始录制音视频，文件将保存到：' + videoFile);
        console.info(`${this.logTag}: AVRecording started. File: ${videoFile}`);
      }).catch((err: Error) => {
        console.error(`${this.logTag}: Failed to create AVRecorder: ${err.message}`);
        this.showToast('创建AVRecorder失败: ' + err.message);
      });
    } catch (err) {
      console.error(`${this.logTag}: Error in AVRecorder: ${JSON.stringify(err)}`);
      this.showToast('AVRecorder 错误: ' + JSON.stringify(err));
    }
  }
  
  // 停止AVRecorder录制
  stopAVRecording() {
    if (!this.avRecorder || !this.isAVRecording) {
      return;
    }
    
    try {
      // 停止录制
      this.avRecorder.stop();
      
      this.showToast('录制已停止并保存');
      console.info(`${this.logTag}: AVRecording stopped`);
      
      this.isAVRecording = false;
      
      // 释放资源
      this.avRecorder.release();
      this.avRecorder = null;
    } catch (err) {
      console.error(`${this.logTag}: Error stopping AVRecorder: ${JSON.stringify(err)}`);
      this.showToast('停止录制错误: ' + JSON.stringify(err));
    }
  }

  // 本地录音 - AudioCapturer
  startAudioCapturing() {
    try {
      // 如果已经在采集，先停止
      if (this.isAudioCapturing && this.audioCapturer) {
        this.stopAudioCapturing();
        return;
      }
      
      // 创建音频采集配置
      const audioCapturerOptions: audio.AudioCapturerOptions = {
        streamInfo: {
          samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_44100,
          channels: audio.AudioChannel.CHANNEL_2,
          sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE,
          encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW
        },
        capturerInfo: {
          source: audio.SourceType.SOURCE_TYPE_MIC,
          capturerFlags: 0
        }
      };
      
      // 创建AudioCapturer实例
      const audioCapturerPromise = audio.createAudioCapturer(audioCapturerOptions);
      audioCapturerPromise.then((capturer) => {
        this.audioCapturer = capturer;
        console.info(`${this.logTag}: AudioCapturer created`);
        
        // 开始采集
        this.audioCapturer.start();
        
        this.isAudioCapturing = true;
        this.showToast('开始音频采集');
        console.info(`${this.logTag}: AudioCapturing started`);
        
        // 监听采集状态
        this.audioCapturer.on('stateChange', (state: audio.AudioState) => {
          console.info(`${this.logTag}: AudioCapturer state changed: ${state}`);
        });
      }).catch((err: Error) => {
        console.error(`${this.logTag}: Failed to create AudioCapturer: ${err.message}`);
        this.showToast('创建音频采集器失败: ' + err.message);
      });
    } catch (err) {
      console.error(`${this.logTag}: Error in AudioCapturer: ${JSON.stringify(err)}`);
      this.showToast('AudioCapturer 错误: ' + JSON.stringify(err));
    }
  }
  
  // 停止AudioCapturer采集
  stopAudioCapturing() {
    if (!this.audioCapturer || !this.isAudioCapturing) {
      return;
    }
    
    try {
      // 停止采集
      this.audioCapturer.stop();
      
      this.showToast('音频采集已停止');
      console.info(`${this.logTag}: AudioCapturing stopped`);
      
      this.isAudioCapturing = false;
      
      // 释放资源
      this.audioCapturer.release();
      this.audioCapturer = null;
    } catch (err) {
      console.error(`${this.logTag}: Error stopping AudioCapturer: ${JSON.stringify(err)}`);
      this.showToast('停止音频采集错误: ' + JSON.stringify(err));
    }
  }
/*
  // 接收短信
  subscribeSMS() {
    try {
      if (!this.context) {
        this.showToast('无法获取上下文');
        return;
      }
      
      // 1. 设置订阅信息
      const subscribeInfo: commonEventManager.CommonEventSubscribeInfo = {
        events: ['usual.event.SMS_RECEIVE']
      };

      // 2. 创建订阅者
      commonEventManager.createSubscriber(subscribeInfo, (err, subscriber) => {
        if (err) {
          console.error(`${this.logTag}: Failed to create subscriber: ${JSON.stringify(err)}`);
          this.showToast(`创建订阅者失败: ${err.code}, ${err.message}`);
          return;
        }

        // 3. 订阅事件
        commonEventManager.subscribe(subscriber, (err, data) => {
          if (err) {
            console.error(`${this.logTag}: Failed to subscribe to SMS event: ${JSON.stringify(err)}`);
            this.showToast(`订阅短信失败: ${err.code}, ${err.message}`);
          } else {
            const message = data.data;
            console.info(`${this.logTag}: SMS received: ${message}`);
            this.showToast(`收到短信: ${message}`);
          }
        });
      this.showToast('正在监听短信接收事件...');
        console.info(`${this.logTag}: SMS subscription successful.`);
      });
    } catch (err) {
      console.error(`${this.logTag}: Error in SMS subscription: ${JSON.stringify(err)}`);
      this.showToast('短信订阅错误: ' + JSON.stringify(err));
    }
  }
*/
  // 截屏
  async takeScreenshot() {
    try {
      if (!this.context) {
        this.showToast('无法获取上下文');
        return;
      }

      const win = await window.getLastWindow(this.context);
      const pixelMap = await win.snapshot();

      const timestamp = new Date().getTime();
      const fileName = `screenshot_${timestamp}.jpg`;
      const filePath = this.context.cacheDir + '/' + fileName;

      const imagePacker = image.createImagePacker();
      const packOpts: image.PackingOption = { format: 'image/jpeg', quality: 100 };
      const data = await imagePacker.packing(pixelMap, packOpts);

      const file = await fs.open(filePath, fs.OpenMode.CREATE | fs.OpenMode.READ_WRITE);
      await fs.write(file.fd, data);
      await fs.close(file.fd);

      this.showToast('截图已保存: ' + filePath);
      console.info(`${this.logTag}: Screenshot saved to ${filePath}`);
    } catch (err) {
      console.error(`${this.logTag}: Screenshot failed: ${JSON.stringify(err)}`);
      this.showToast('截屏失败: ' + JSON.stringify(err));
    }
  }

  // 录屏
  startScreenRecording() {
    try {
      // 如果已经在录制，先停止
      if (this.isScreenRecording && this.avRecorder) {
        this.stopScreenRecording();
        return;
      }
      
      if (!this.context) {
        this.showToast('无法获取上下文');
        return;
      }
      
      // 创建录制文件路径
      let cacheDir = this.context.cacheDir;
      let videoFile = cacheDir + '/screen_record_' + new Date().getTime() + '.mp4';
      
      // 创建AVRecorder实例
      const avRecorderPromise = media.createAVRecorder();
      avRecorderPromise.then((recorder) => {
        this.avRecorder = recorder;
        console.info(`${this.logTag}: AVRecorder created for screen recording`);
        
        // 创建AVRecorder配置
        const avProfile: media.AVRecorderProfile = {
          audioBitrate: 48000,
          audioChannels: 2,
          audioSampleRate: 44100,
          videoFrameRate: 30,
          videoFrameWidth: 1280,
          videoFrameHeight: 720,
          fileFormat: media.ContainerFormatType.CFT_MPEG_4
        };
        
        // 创建录制配置 - 注意这里使用SURFACE_YUV作为视频源类型进行屏幕录制
        const avConfig: media.AVRecorderConfig = {
          audioSourceType: media.AudioSourceType.AUDIO_SOURCE_TYPE_MIC,
          videoSourceType: media.VideoSourceType.VIDEO_SOURCE_TYPE_SURFACE_YUV,
          profile: avProfile,
          url: 'file://' + videoFile
        };
        
        // 准备录制
        this.avRecorder.prepare(avConfig);
        
        // 开始录制
        this.avRecorder.start();
        
        this.isScreenRecording = true;
        this.showToast('开始录屏，录屏文件将保存到：' + videoFile);
        console.info(`${this.logTag}: Screen recording started. File: ${videoFile}`);
      }).catch((err: Error) => {
        console.error(`${this.logTag}: Failed to create AVRecorder for screen: ${err.message}`);
        this.showToast('创建录屏器失败: ' + err.message);
      });
    } catch (err) {
      console.error(`${this.logTag}: Error in screen recording: ${JSON.stringify(err)}`);
      this.showToast('录屏错误: ' + JSON.stringify(err));
    }
  }
  
  // 停止录屏
  stopScreenRecording() {
    if (!this.avRecorder || !this.isScreenRecording) {
      return;
    }
    
    try {
      // 停止录制
      this.avRecorder.stop();
      
      this.showToast('录屏已停止并保存');
      console.info(`${this.logTag}: Screen recording stopped`);
      
      this.isScreenRecording = false;
      
      // 释放资源
      this.avRecorder.release();
      this.avRecorder = null;
    } catch (err) {
      console.error(`${this.logTag}: Error stopping screen recording: ${JSON.stringify(err)}`);
      this.showToast('停止录屏错误: ' + JSON.stringify(err));
    }
  }

  // 相机功能 - 打开相机
  openCamera() {
    try {
      if (!this.context) {
        this.showToast('无法获取上下文');
        return;
      }
      
      // 获取相机管理器
      const manager = camera.getCameraManager(this.context);
      
      // 显示相机信息
      this.showToast('相机管理器获取成功');
      console.info(`${this.logTag}: Camera manager obtained`);
      
      // Get camera list
      const cameras = manager.getSupportedCameras();
      this.showToast(`检测到${cameras.length}个相机设备`);
      console.info(`${this.logTag}: Found ${cameras.length} camera devices.`);
    } catch (err) {
      console.error(`${this.logTag}: Error in opening camera: ${JSON.stringify(err)}`);
      this.showToast('打开相机错误: ' + JSON.stringify(err));
    }
  }

  // 相机功能 - 拍照
  async takePhoto() {
    try {
      if (!this.context) {
        this.showToast('无法获取上下文');
        return;
      }
      
      let pathDir = this.context.filesDir;
      let fileName = `${new Date().getTime()}`;
      let filePath = pathDir + `/${fileName}.tmp`;
      fileIo.createRandomAccessFile(filePath, fileIo.OpenMode.CREATE);

      let uri = fileUri.getUriFromPath(filePath);
      let pickerProfile: cameraPicker.PickerProfile = {
        cameraPosition: cameraKit.CameraPosition.CAMERA_POSITION_BACK,
        saveUri: uri
      };

      let result: cameraPicker.PickerResult =
        await cameraPicker.pick(this.context, [cameraPicker.PickerMediaType.PHOTO], pickerProfile);
      console.info(`${this.logTag}: picker resultCode: ${result.resultCode},resultUri: ${result.resultUri},mediaType: ${result.mediaType}`);
      if (result.resultCode == 0) {
        if (result.mediaType === cameraPicker.PickerMediaType.PHOTO) {
          this.imageUri = result.resultUri;
          this.showToast('拍照成功，照片已保存');
        }
      }
    } catch (err) {
      console.error(`${this.logTag}: Error in taking photo: ${JSON.stringify(err)}`);
      this.showToast('拍照错误: ' + JSON.stringify(err));
    }
  }

  build() {
    NavDestination() {
      Scroll() {
        Column() {
          Text('权限功能测试')
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .margin({ top: 20, bottom: 20 })
            .width('100%')
            .textAlign(TextAlign.Center)

          // 本地录音按钮组
          Column() {
            Text('本地录音')
              .fontSize(20)
              .fontWeight(FontWeight.Medium)
              .margin({ top: 10, bottom: 10 })
              .width('100%')

            Button(this.isRecording ? '停止录音' : '录音 AudioRecorder')
              .width('90%')
              .height(50)
              .margin({ top: 5, bottom: 5 })
              .backgroundColor(this.isRecording ? '#FF5252' : '#007DFF')
              .onClick(() => {
                this.startAudioRecording();
              })
            
            Button(this.isAVRecording ? '停止录制' : '录音 AVRecorder')
              .width('90%')
              .height(50)
              .margin({ top: 5, bottom: 5 })
              .backgroundColor(this.isAVRecording ? '#FF5252' : '#007DFF')
              .onClick(() => {
                this.startAVRecording();
              })

            Button(this.isAudioCapturing ? '停止采集' : '录音 AudioCapturer')
              .width('90%')
              .height(50)
              .margin({ top: 5, bottom: 5 })
              .backgroundColor(this.isAudioCapturing ? '#FF5252' : '#007DFF')
              .onClick(() => {
                this.startAudioCapturing();
              })
          }
          .width('100%')
          .backgroundColor('#F1F3F5')
          .padding(10)
          .margin({ top: 5, bottom: 15 })
          .borderRadius(10)

          // 接收短信按钮
          /*
          Button('接收短信')
            .width('90%')
            .height(50)
            .margin({ top: 5, bottom: 5 })
            .backgroundColor('#4CAF50')
            .onClick(() => {
              this.subscribeSMS();
            })
          */

          // 截屏/录屏按钮组
          Column() {
            Text('屏幕捕获')
              .fontSize(20)
              .fontWeight(FontWeight.Medium)
              .margin({ top: 10, bottom: 10 })
              .width('100%')

            Button('截屏')
              .width('90%')
              .height(50)
              .margin({ top: 5, bottom: 5 })
              .backgroundColor('#9C27B0')
              .onClick(() => {
                this.takeScreenshot();
              })

            Button(this.isScreenRecording ? '停止录屏' : '录屏')
              .width('90%')
              .height(50)
              .margin({ top: 5, bottom: 5 })
              .backgroundColor(this.isScreenRecording ? '#FF5252' : '#9C27B0')
              .onClick(() => {
                this.startScreenRecording();
              })
          }
          .width('100%')
          .backgroundColor('#F1F3F5')
          .padding(10)
          .margin({ top: 5, bottom: 15 })
          .borderRadius(10)

          // 相机功能按钮组
          Column() {
            Text('相机功能')
              .fontSize(20)
              .fontWeight(FontWeight.Medium)
              .margin({ top: 10, bottom: 10 })
              .width('100%')

            Button('打开相机')
              .width('90%')
              .height(50)
              .margin({ top: 5, bottom: 5 })
              .backgroundColor('#FF9800')
              .onClick(() => {
                this.openCamera();
              })

            Button('拍照')
              .width('90%')
              .height(50)
              .margin({ top: 5, bottom: 5 })
              .backgroundColor('#FF9800')
              .onClick(() => {
                this.takePhoto();
              })
            
            if (this.imageUri) {
              Image(this.imageUri)
                .width('90%')
                .height(200)
                .margin({ top: 10 })
                .objectFit(ImageFit.Contain)
            }
          }
          .width('100%')
          .backgroundColor('#F1F3F5')
          .padding(10)
          .margin({ top: 5, bottom: 15 })
          .borderRadius(10)
        }
        .width('100%')
        .padding(15)
      }
      .scrollBar(BarState.Auto)
    }
    .backgroundColor('#FFFFFF')
    .title('权限测试')
  }
}