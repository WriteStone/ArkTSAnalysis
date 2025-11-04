#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
鸿蒙应用隐私合规自动分析工具
用途：自动扫描HarmonyOS应用代码，识别隐私相关的API调用和权限使用
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Set

class HarmonyOSPrivacyScanner:
    """鸿蒙应用隐私扫描器"""
    
    # 敏感API模式
    SENSITIVE_APIS = {
        '位置服务': [
            r'geoLocationManager\.getCurrentLocation',
            r'geoLocationManager\.getLastLocation',
            r'geoLocationManager\.on\(',
        ],
        '权限请求': [
            r'requestPermissionsFromUser',
            r'checkAccessToken',
            r'verifyAccessToken',
        ],
        '相机': [
            r'camera\.createCameraInput',
            r'cameraPicker\.pick',
        ],
        '通讯录': [
            r'contact\.queryContacts',
            r'contactPicker\.pick',
        ],
        '存储': [
            r'preferences\.getPreferences',
            r'preferences\.deletePreferences',
            r'relationalStore\.getRdbStore',
        ],
        '网络请求': [
            r'http\.createHttp',
            r'request\.upload',
            r'request\.download',
        ],
        '设备信息': [
            r'deviceInfo\.deviceType',
            r'deviceInfo\.osFullName',
            r'deviceInfo\.udid',
        ],
        '剪贴板': [
            r'pasteboard\.getSystemPasteboard',
            r'pasteboard\.createData',
        ],
    }
    
    # 权限列表
    PERMISSIONS = {
        'ohos.permission.LOCATION': '精确位置',
        'ohos.permission.APPROXIMATELY_LOCATION': '粗略位置',
        'ohos.permission.CAMERA': '相机',
        'ohos.permission.MICROPHONE': '麦克风',
        'ohos.permission.READ_CONTACTS': '读取通讯录',
        'ohos.permission.WRITE_CONTACTS': '写入通讯录',
        'ohos.permission.READ_CALENDAR': '读取日历',
        'ohos.permission.INTERNET': '网络访问',
        'ohos.permission.GET_WIFI_INFO': 'WiFi信息',
        'ohos.permission.READ_MEDIA': '读取媒体',
    }
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.results = {
            'api_calls': {},
            'permissions': {},
            'data_storage': [],
            'network_requests': [],
            'third_party_sdks': [],
        }
    
    def scan(self):
        """执行完整扫描"""
        print("🔍 开始扫描鸿蒙应用...")
        
        # 1. 扫描权限声明
        self.scan_permissions()
        
        # 2. 扫描代码中的API调用
        self.scan_code_files()
        
        # 3. 扫描第三方依赖
        self.scan_dependencies()
        
        # 4. 生成报告
        self.generate_report()
        
        print("✅ 扫描完成！")
    
    def scan_permissions(self):
        """扫描module.json5中的权限声明"""
        print("\n📋 扫描权限声明...")
        
        # 查找所有module.json5文件
        for module_json in self.project_root.rglob('module.json5'):
            try:
                with open(module_json, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # 提取权限（简单的正则匹配，实际应该用JSON5解析器）
                    permissions = re.findall(r'"name":\s*"(ohos\.permission\.\w+)"', content)
                    
                    for perm in permissions:
                        perm_name = self.PERMISSIONS.get(perm, '未知权限')
                        self.results['permissions'][perm] = {
                            'name': perm_name,
                            'file': str(module_json.relative_to(self.project_root)),
                        }
                        print(f"  ✓ 发现权限: {perm} ({perm_name})")
            except Exception as e:
                print(f"  ✗ 读取失败: {module_json} - {e}")
    
    def scan_code_files(self):
        """扫描.ets和.ts文件中的敏感API调用"""
        print("\n🔎 扫描代码文件...")
        
        code_files = list(self.project_root.rglob('*.ets')) + list(self.project_root.rglob('*.ts'))
        total_files = len(code_files)
        
        for idx, file_path in enumerate(code_files, 1):
            # 跳过node_modules
            if 'node_modules' in str(file_path) or 'oh_modules' in str(file_path):
                continue
            
            print(f"  [{idx}/{total_files}] 分析: {file_path.name}")
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    lines = content.split('\n')
                    
                    # 检查每种敏感API
                    for api_category, patterns in self.SENSITIVE_APIS.items():
                        for pattern in patterns:
                            matches = re.finditer(pattern, content)
                            for match in matches:
                                # 找到匹配所在的行号
                                line_no = content[:match.start()].count('\n') + 1
                                
                                if api_category not in self.results['api_calls']:
                                    self.results['api_calls'][api_category] = []
                                
                                self.results['api_calls'][api_category].append({
                                    'file': str(file_path.relative_to(self.project_root)),
                                    'line': line_no,
                                    'code': lines[line_no - 1].strip(),
                                    'pattern': pattern,
                                })
            except Exception as e:
                print(f"    ✗ 分析失败: {e}")
    
    def scan_dependencies(self):
        """扫描第三方依赖"""
        print("\n📦 扫描第三方依赖...")
        
        # 查找oh-package.json5
        for pkg_file in self.project_root.rglob('oh-package.json5'):
            try:
                with open(pkg_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # 简单提取依赖名称
                    deps = re.findall(r'"(@[\w/]+|[\w-]+)":\s*"([^"]+)"', content)
                    
                    for dep_name, version in deps:
                        if dep_name not in ['devDependencies', 'dependencies']:
                            self.results['third_party_sdks'].append({
                                'name': dep_name,
                                'version': version,
                            })
                            print(f"  ✓ 发现依赖: {dep_name}@{version}")
            except Exception as e:
                print(f"  ✗ 读取失败: {pkg_file} - {e}")
    
    def generate_report(self):
        """生成分析报告"""
        print("\n📊 生成报告...")
        
        report_lines = []
        report_lines.append("=" * 80)
        report_lines.append("鸿蒙应用隐私合规分析报告")
        report_lines.append("=" * 80)
        
        # 1. 权限汇总
        report_lines.append("\n【权限声明汇总】")
        report_lines.append(f"共发现 {len(self.results['permissions'])} 个权限:\n")
        
        if self.results['permissions']:
            for perm, info in self.results['permissions'].items():
                report_lines.append(f"  ✓ {perm}")
                report_lines.append(f"    名称: {info['name']}")
                report_lines.append(f"    文件: {info['file']}\n")
        else:
            report_lines.append("  ⚠ 未发现任何权限声明\n")
        
        # 2. API调用汇总
        report_lines.append("\n【敏感API调用汇总】")
        total_calls = sum(len(calls) for calls in self.results['api_calls'].values())
        report_lines.append(f"共发现 {total_calls} 处敏感API调用:\n")
        
        for category, calls in self.results['api_calls'].items():
            if calls:
                report_lines.append(f"\n  [{category}] - {len(calls)} 处")
                for call in calls[:5]:  # 只显示前5个
                    report_lines.append(f"    • {call['file']}:{call['line']}")
                    report_lines.append(f"      {call['code']}")
                if len(calls) > 5:
                    report_lines.append(f"    ... 还有 {len(calls) - 5} 处")
        
        # 3. 第三方依赖
        report_lines.append("\n\n【第三方依赖】")
        report_lines.append(f"共发现 {len(self.results['third_party_sdks'])} 个第三方依赖:\n")
        
        for sdk in self.results['third_party_sdks']:
            report_lines.append(f"  • {sdk['name']} ({sdk['version']})")
        
        # 4. 风险评估
        report_lines.append("\n\n【风险评估】")
        risk_level = self.calculate_risk_level()
        report_lines.append(f"风险等级: {risk_level}\n")
        
        # 输出到控制台
        report_text = '\n'.join(report_lines)
        print(report_text)
        
        # 保存到文件
        report_file = self.project_root / '隐私扫描报告.txt'
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report_text)
        
        print(f"\n💾 报告已保存至: {report_file}")
        
        # 同时保存JSON格式
        json_file = self.project_root / '隐私扫描结果.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, ensure_ascii=False, indent=2)
        
        print(f"💾 JSON结果已保存至: {json_file}")
    
    def calculate_risk_level(self) -> str:
        """计算风险等级"""
        score = 0
        
        # 敏感权限加分
        sensitive_perms = ['LOCATION', 'APPROXIMATELY_LOCATION', 'CAMERA', 'MICROPHONE', 'READ_CONTACTS']
        for perm in self.results['permissions']:
            if any(sp in perm for sp in sensitive_perms):
                score += 2
            else:
                score += 1
        
        # API调用加分
        score += len(self.results['api_calls'].get('位置服务', [])) * 2
        score += len(self.results['api_calls'].get('相机', [])) * 2
        score += len(self.results['api_calls'].get('通讯录', [])) * 3
        
        # 判断等级
        if score >= 15:
            return "🔴 高风险"
        elif score >= 8:
            return "🟡 中等风险"
        else:
            return "🟢 低风险"


def main():
    """主函数"""
    import sys
    
    # 获取项目路径
    if len(sys.argv) > 1:
        project_path = sys.argv[1]
    else:
        # 默认使用当前目录
        project_path = r'f:\HarmonyOS\Validation Set\ohos-weather-beta\ohos-weather-beta'
    
    print(f"项目路径: {project_path}\n")
    
    # 创建扫描器并执行
    scanner = HarmonyOSPrivacyScanner(project_path)
    scanner.scan()


if __name__ == '__main__':
    main()
