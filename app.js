// ABHINAV DETECTOR - Advanced File Scanner
// Configuration
const CONFIG = {
    GITHUB_TOKEN: localStorage.getItem('github_token') || '',
    REPO_OWNER: 'abhinavshiva36-hue',
    REPO_NAME: 'Checking',
    ILLEGAL_KEYWORDS: [
        'free fire max', 'freefiremax', 'ffmax', 'freefire', 'free fire',
        'malware', 'trojan', 'virus', 'ransomware', 'spyware',
        'hack', 'exploit', 'backdoor', 'keylogger', 'worm',
        '.exe', '.bat', '.cmd', '.scr', '.vbs', '.ps1', '.com',
        'game mod', 'crack', 'keygen', 'serial key', 'warez',
        'phishing', 'adware', 'rootkit', 'botnet', 'cryptolocker'
    ]
};

// DOM Elements
const permissionBtn = document.getElementById('permissionBtn');
const scanBtn = document.getElementById('scanBtn');
const downloadReportBtn = document.getElementById('downloadReportBtn');
const downloadPyBtn = document.getElementById('downloadPyBtn');
const downloadJsonBtn = document.getElementById('downloadJsonBtn');
const permissionStatus = document.getElementById('permissionStatus');
const scanStatus = document.getElementById('scanStatus');
const resultsContainer = document.getElementById('resultsContainer');
const resultsSection = document.getElementById('resultsSection');
const downloadSection = document.getElementById('downloadSection');
const statsSection = document.getElementById('statsSection');

// State
let state = {
    hasPermission: false,
    isScanning: false,
    scanResults: [],
    totalFiles: 0,
    illegalCount: 0,
    safeCount: 0,
    scanStartTime: 0,
    scanEndTime: 0
};

// Event Listeners
permissionBtn.addEventListener('click', requestPermission);
scanBtn.addEventListener('click', startScan);
downloadReportBtn.addEventListener('click', () => downloadReport('txt'));
downloadPyBtn.addEventListener('click', () => downloadPythonApp());
downloadJsonBtn.addEventListener('click', () => downloadReport('json'));

// Request Permission
function requestPermission() {
    const token = prompt('Enter your GitHub Personal Access Token:\n\nVisit: https://github.com/settings/tokens\n\nRequired Scopes:\n- repo\n- read:user\n\nPaste your token below:');
    
    if (!token) {
        showStatus(permissionStatus, '❌ Permission denied - No token provided', 'error');
        return;
    }

    if (token.length < 20) {
        showStatus(permissionStatus, '❌ Invalid token - Token too short', 'error');
        return;
    }

    CONFIG.GITHUB_TOKEN = token;
    localStorage.setItem('github_token', token);
    state.hasPermission = true;

    showStatus(permissionStatus, '✅ Permission granted! You can now scan files.', 'success');
    scanBtn.disabled = false;
    permissionBtn.textContent = '✅ Permission Granted';
    permissionBtn.disabled = true;
}

// Start File Scanning
async function startScan() {
    if (!state.hasPermission) {
        showStatus(scanStatus, '❌ Please grant permission first', 'error');
        return;
    }

    if (state.isScanning) return;

    state.isScanning = true;
    state.scanStartTime = Date.now();
    scanBtn.disabled = true;
    showStatus(scanStatus, '🔄 Scanning files... Please wait...', 'info');
    resultsContainer.innerHTML = '';
    state.scanResults = [];
    state.totalFiles = 0;
    state.illegalCount = 0;
    state.safeCount = 0;

    try {
        // Fetch all files from the repository
        const files = await fetchRepositoryFiles();
        state.totalFiles = files.length;

        if (files.length === 0) {
            showStatus(scanStatus, '✅ Scan complete! Repository is empty.', 'success');
            updateStats();
            state.isScanning = false;
            scanBtn.disabled = false;
            return;
        }

        // Analyze each file
        for (const file of files) {
            const result = await analyzeFile(file);
            state.scanResults.push(result);

            if (result.isIllegal) {
                state.illegalCount++;
            } else {
                state.safeCount++;
            }
        }

        // Display results
        displayResults();
        state.scanEndTime = Date.now();
        updateStats();
        
        const message = state.illegalCount > 0 
            ? `⚠️ Scan complete! Found ${state.illegalCount} suspicious file(s) out of ${state.totalFiles}.` 
            : `✅ Scan complete! All ${state.totalFiles} files are safe.`;
        
        showStatus(scanStatus, message, state.illegalCount > 0 ? 'warning' : 'success');
        resultsSection.style.display = 'block';
        downloadSection.style.display = 'block';
        statsSection.style.display = 'block';

    } catch (error) {
        console.error('Scan error:', error);
        showStatus(scanStatus, `❌ Error during scan: ${error.message}`, 'error');
    } finally {
        state.isScanning = false;
        scanBtn.disabled = false;
    }
}

// Fetch Repository Files
async function fetchRepositoryFiles() {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'ABHINAV-DETECTOR'
        };

        if (CONFIG.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${CONFIG.GITHUB_TOKEN}`;
        }

        // Fetch using GitHub API - get tree recursively
        const response = await fetch(
            `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/git/trees/main?recursive=1`,
            { headers }
        );

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid GitHub token. Please check your token and try again.');
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.tree) {
            throw new Error('Repository appears to be empty or invalid');
        }

        // Filter only files (not directories)
        return data.tree.filter(item => item.type === 'blob');
    } catch (error) {
        console.error('Error fetching files:', error);
        throw error;
    }
}

// Analyze Individual File
async function analyzeFile(file) {
    const fileName = file.path.toLowerCase();
    const isIllegal = isIllegalFile(fileName);

    return {
        name: file.path,
        sha: file.sha,
        size: file.size,
        url: file.url,
        isIllegal: isIllegal,
        reason: isIllegal ? getIllegalReason(fileName) : 'Safe file',
        activity: `Last checked: ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString()
    };
}

// Check if File is Illegal
function isIllegalFile(fileName) {
    return CONFIG.ILLEGAL_KEYWORDS.some(keyword => 
        fileName.includes(keyword.toLowerCase())
    );
}

// Get Reason for Illegal Classification
function getIllegalReason(fileName) {
    for (const keyword of CONFIG.ILLEGAL_KEYWORDS) {
        if (fileName.includes(keyword.toLowerCase())) {
            return `🚫 Contains keyword: "${keyword}"`;
        }
    }
    return '⚠️ Suspicious file detected';
}

// Display Results
function displayResults() {
    resultsContainer.innerHTML = '';

    if (state.scanResults.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No files found in repository</p>';
        return;
    }

    // Show illegal files first
    const illegalFiles = state.scanResults.filter(r => r.isIllegal);
    const safeFiles = state.scanResults.filter(r => !r.isIllegal);

    if (illegalFiles.length > 0) {
        const illegalHeader = document.createElement('h3');
        illegalHeader.style.color = '#dc2626';
        illegalHeader.style.marginTop = '20px';
        illegalHeader.style.marginBottom = '15px';
        illegalHeader.style.fontSize = '1.4em';
        illegalHeader.textContent = `🚫 ILLEGAL FILES FOUND (${illegalFiles.length})`;
        resultsContainer.appendChild(illegalHeader);

        illegalFiles.forEach(result => {
            displayFileResult(result);
        });
    }

    if (safeFiles.length > 0) {
        const safeHeader = document.createElement('h3');
        safeHeader.style.color = '#059669';
        safeHeader.style.marginTop = '30px';
        safeHeader.style.marginBottom = '15px';
        safeHeader.style.fontSize = '1.4em';
        safeHeader.textContent = `✅ SAFE FILES (${safeFiles.length})`;
        resultsContainer.appendChild(safeHeader);

        // Show first 5 safe files, then "more" message
        safeFiles.slice(0, 5).forEach(result => {
            displayFileResult(result);
        });

        if (safeFiles.length > 5) {
            const more = document.createElement('p');
            more.style.textAlign = 'center';
            more.style.color = '#6b7280';
            more.style.marginTop = '15px';
            more.style.fontStyle = 'italic';
            more.textContent = `... and ${safeFiles.length - 5} more safe files (see detailed report for full list)`;
            resultsContainer.appendChild(more);
        }
    }
}

// Display Individual File Result
function displayFileResult(result) {
    const div = document.createElement('div');
    div.className = `file-result ${result.isIllegal ? '' : 'safe'}`;

    const content = document.createElement('div');
    content.className = 'file-result-content';
    content.innerHTML = `
        <h3>${result.isIllegal ? '🚫' : '✅'} ${result.name}</h3>
        <p><strong>Reason:</strong> ${result.reason}</p>
        <p><strong>Activity:</strong> ${result.activity}</p>
        <p><strong>Size:</strong> ${(result.size / 1024).toFixed(2)} KB</p>
    `;

    const status = document.createElement('div');
    status.className = `file-status ${result.isIllegal ? '' : 'safe'}`;
    status.textContent = result.isIllegal ? '⚠️ ILLEGAL' : '✅ SAFE';

    div.appendChild(content);
    div.appendChild(status);
    resultsContainer.appendChild(div);
}

// Update Statistics
function updateStats() {
    document.getElementById('totalFiles').textContent = state.totalFiles;
    document.getElementById('illegalCount').textContent = state.illegalCount;
    document.getElementById('safeCount').textContent = state.safeCount;
    
    const scanTime = ((state.scanEndTime - state.scanStartTime) / 1000).toFixed(1);
    document.getElementById('scanTime').textContent = scanTime + 's';
}

// Download TXT Report
function downloadReport(format) {
    let content;
    let filename;

    if (format === 'txt') {
        content = generateTextReport();
        filename = `ABHINAV_DETECTOR_Report_${new Date().toISOString().split('T')[0]}.txt`;
    } else if (format === 'json') {
        content = generateJsonReport();
        filename = `ABHINAV_DETECTOR_Report_${new Date().toISOString().split('T')[0]}.json`;
    }

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showStatus(scanStatus, `✅ ${filename} downloaded successfully!`, 'success');
}

// Generate Text Report
function generateTextReport() {
    let report = `╔════════════════════════════════════════════════════════════════╗\n`;
    report += `║          ABHINAV DETECTOR - FILE SCAN REPORT                    ║\n`;
    report += `╚════════════════════════════════════════════════════════════════╝\n\n`;
    
    report += `Repository: ${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}\n`;
    report += `Scan Date: ${new Date().toLocaleString()}\n`;
    report += `Scan Duration: ${((state.scanEndTime - state.scanStartTime) / 1000).toFixed(2)}s\n`;
    report += `════════════════════════════════════════════════════════════════\n\n`;

    report += `📊 STATISTICS\n`;
    report += `─────────────\n`;
    report += `Total Files Scanned: ${state.totalFiles}\n`;
    report += `Illegal Files Found: ${state.illegalCount}\n`;
    report += `Safe Files: ${state.safeCount}\n`;
    report += `Detection Rate: ${state.totalFiles > 0 ? ((state.illegalCount / state.totalFiles) * 100).toFixed(2) : 0}%\n\n`;

    if (state.illegalCount > 0) {
        report += `🚫 ILLEGAL FILES DETECTED\n`;
        report += `─────────────────────────\n`;
        state.scanResults.filter(r => r.isIllegal).forEach((result, index) => {
            report += `\n${index + 1}. ${result.name}\n`;
            report += `   Reason: ${result.reason.replace(/🚫|⚠️/g, '').trim()}\n`;
            report += `   Size: ${(result.size / 1024).toFixed(2)} KB\n`;
            report += `   Detected: ${result.activity}\n`;
        });
        report += `\n════════════════════════════════════════════════════════════════\n`;
    }

    report += `\n✅ SAFE FILES (${state.safeCount})\n`;
    report += `─────────────\n`;
    const displaySafeCount = Math.min(10, state.safeCount);
    state.scanResults.filter(r => !r.isIllegal).slice(0, displaySafeCount).forEach((result, index) => {
        report += `${index + 1}. ${result.name}\n`;
    });
    if (state.safeCount > displaySafeCount) {
        report += `... and ${state.safeCount - displaySafeCount} more safe files\n`;
    }

    report += `\n════════════════════════════════════════════════════════════════\n`;
    report += `Report Generated by: ABHINAV DETECTOR v1.0\n`;
    report += `Created by: abhinavshiva36-hue\n`;
    report += `Repository: https://github.com/abhinavshiva36-hue/Checking\n`;
    report += `════════════════════════════════════════════════════════════════\n`;

    return report;
}

// Generate JSON Report
function generateJsonReport() {
    const report = {
        detector: 'ABHINAV DETECTOR',
        version: '1.0',
        timestamp: new Date().toISOString(),
        repository: {
            owner: CONFIG.REPO_OWNER,
            name: CONFIG.REPO_NAME,
            url: `https://github.com/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}`
        },
        statistics: {
            totalFilesScanned: state.totalFiles,
            illegalFilesFound: state.illegalCount,
            safeFiles: state.safeCount,
            detectionRate: state.totalFiles > 0 ? ((state.illegalCount / state.totalFiles) * 100).toFixed(2) : 0,
            scanDuration: ((state.scanEndTime - state.scanStartTime) / 1000).toFixed(2)
        },
        illegalFiles: state.scanResults.filter(r => r.isIllegal),
        safeFiles: state.scanResults.filter(r => !r.isIllegal),
        createdBy: 'abhinavshiva36-hue'
    };

    return JSON.stringify(report, null, 2);
}

// Download Python App
function downloadPythonApp() {
    const pythonCode = `#!/usr/bin/env python3
"""ABHINAV DETECTOR - Python Version
Advanced File Scanner for Illegal and Suspicious Files
Repository: https://github.com/abhinavshiva36-hue/Checking
"""

import os
import json
import argparse
from datetime import datetime
from pathlib import Path

ILLEGAL_KEYWORDS = [
    'free fire max', 'freefiremax', 'ffmax', 'freefire', 'free fire',
    'malware', 'trojan', 'virus', 'ransomware', 'spyware',
    'hack', 'exploit', 'backdoor', 'keylogger', 'worm',
    '.exe', '.bat', '.cmd', '.scr', '.vbs', '.ps1', '.com',
    'game mod', 'crack', 'keygen', 'serial key', 'warez',
    'phishing', 'adware', 'rootkit', 'botnet', 'cryptolocker'
]

class AbiNavDetector:
    def __init__(self, root_path='.'):
        self.root_path = Path(root_path)
        self.results = {
            'illegal_files': [],
            'safe_files': [],
            'total_files': 0,
            'illegal_count': 0,
            'safe_count': 0,
            'timestamp': datetime.now().isoformat()
        }
    
    def is_illegal_file(self, filename):
        filename_lower = filename.lower()
        return any(keyword in filename_lower for keyword in ILLEGAL_KEYWORDS)
    
    def get_illegal_reason(self, filename):
        filename_lower = filename.lower()
        for keyword in ILLEGAL_KEYWORDS:
            if keyword in filename_lower:
                return f"Contains keyword: \\"{keyword}\\""
        return "Suspicious file detected"
    
    def scan_file(self, file_path):
        try:
            file_size = file_path.stat().st_size
            is_illegal = self.is_illegal_file(file_path.name)
            result = {
                'name': str(file_path.relative_to(self.root_path)),
                'size': file_size,
                'size_kb': round(file_size / 1024, 2),
                'is_illegal': is_illegal,
                'reason': self.get_illegal_reason(file_path.name) if is_illegal else 'Safe file',
                'scanned_at': datetime.now().isoformat()
            }
            return result
        except Exception as e:
            print(f"Error scanning {file_path}: {e}")
            return None
    
    def scan_directory(self):
        print(f"🔍 ABHINAV DETECTOR - Scanning {self.root_path}...")
        print("-" * 60)
        for file_path in self.root_path.rglob('*'):
            if file_path.is_file():
                result = self.scan_file(file_path)
                if result:
                    self.results['total_files'] += 1
                    if result['is_illegal']:
                        self.results['illegal_files'].append(result)
                        self.results['illegal_count'] += 1
                    else:
                        self.results['safe_files'].append(result)
                        self.results['safe_count'] += 1
    
    def print_report(self):
        print(f"\n{'='*60}")
        print("ABHINAV DETECTOR - SCAN REPORT")
        print(f"{'='*60}")
        print(f"\n📊 STATISTICS")
        print("-" * 60)
        print(f"Total Files Scanned: {self.results['total_files']}")
        print(f"Illegal Files Found: {self.results['illegal_count']}")
        print(f"Safe Files: {self.results['safe_count']}")
        if self.results['illegal_count'] > 0:
            print(f"\n🚫 ILLEGAL FILES DETECTED")
            print("-" * 60)
            for i, file in enumerate(self.results['illegal_files'], 1):
                print(f"\n{i}. {file['name']}")
                print(f"   Reason: {file['reason']}")
                print(f"   Size: {file['size_kb']} KB")
        print(f"\n✅ SAFE FILES")
        print("-" * 60)
        print(f"Total Safe Files: {self.results['safe_count']}")
        if self.results['safe_count'] <= 10:
            for i, file in enumerate(self.results['safe_files'], 1):
                print(f"{i}. {file['name']}")
        else:
            for i, file in enumerate(self.results['safe_files'][:10], 1):
                print(f"{i}. {file['name']}")
            print(f"... and {self.results['safe_count'] - 10} more safe files")
        print(f"\n{'='*60}")
        print(f"Created by: abhinavshiva36-hue")
        print(f"Repository: https://github.com/abhinavshiva36-hue/Checking")
        print(f"{'='*60}\n")
    
    def save_report(self, output_file='abhinav_detector_report.json'):
        with open(output_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        print(f"✅ Report saved to: {output_file}")

def main():
    parser = argparse.ArgumentParser(
        description='ABHINAV DETECTOR - Scan for illegal files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""Examples:
  python abhinav_detector.py                    # Scan current directory
  python abhinav_detector.py /path/to/scan      # Scan specific directory
  python abhinav_detector.py /path -o report.json  # Save report to file
        """
    )
    parser.add_argument('path', nargs='?', default='.', 
                       help='Path to scan (default: current directory)')
    parser.add_argument('-o', '--output', help='Output report file (JSON)')
    parser.add_argument('-q', '--quiet', action='store_true', 
                       help='Suppress console output')
    args = parser.parse_args()
    detector = AbiNavDetector(args.path)
    detector.scan_directory()
    if not args.quiet:
        detector.print_report()
    if args.output:
        detector.save_report(args.output)
    return detector.results['illegal_count']

if __name__ == '__main__':
    exit_code = main()
    exit(exit_code)
`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pythonCode));
    element.setAttribute('download', 'abhinav_detector.py');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showStatus(scanStatus, '✅ abhinav_detector.py downloaded successfully! You can now run it locally with: python abhinav_detector.py', 'success');
}

function showStatus(element, message, type) {
    element.className = `status show ${type}`;
    element.textContent = message;
}

function init() {
    if (localStorage.getItem('github_token')) {
        state.hasPermission = true;
        showStatus(permissionStatus, '✅ Permission already granted - Ready to scan', 'success');
        scanBtn.disabled = false;
        permissionBtn.textContent = '✅ Permission Granted';
        permissionBtn.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', init);