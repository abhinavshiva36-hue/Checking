# ABHINAV DETECTOR

**Advanced File Scanner Application** - Detect illegal and suspicious files in your repository, with special focus on Free Fire Max and malware detection.

## 🎯 Features

- 📋 **Permission-Based Scanning** - Request GitHub API access securely
- 🔍 **Deep File Analysis** - Scan all files in your repository
- ⚠️ **Intelligent Detection** - Identify Free Fire Max, malware, hacks, and other illegal files
- 📊 **Detailed Reports** - View comprehensive scan results with file details
- 📥 **Multiple Export Options**:
  - Download TXT reports
  - Download JSON data
  - **Download Python version** - Run locally on your own systems
- 📈 **Real-time Statistics** - Track scan progress and results

## 🚀 Quick Start

### Web Version

1. Open `index.html` in your browser
2. Click "Request Permission" and enter your GitHub Personal Access Token
3. Click "Check All Files" to start scanning
4. Review results and download reports

### Python Version

Download the `abhinav_detector.py` file from the web app, then:

```bash
# Scan current directory
python abhinav_detector.py

# Scan specific directory
python abhinav_detector.py /path/to/scan

# Save report to JSON
python abhinav_detector.py /path/to/scan -o report.json

# Quiet mode (no console output)
python abhinav_detector.py -q
```

## 🔐 Getting GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select these scopes:
   - `repo` - Full control of private repositories
   - `read:user` - Read user data
4. Click "Generate token"
5. Copy the token and paste it in the app

## 📝 What Gets Detected?

The scanner looks for:
- **Games**: Free Fire Max, Free Fire, Game Mods
- **Malware**: Trojans, Viruses, Ransomware, Spyware, Worms
- **Exploits**: Hacks, Backdoors, Keyloggers, Rootkits
- **Illegal Software**: Cracks, Keygens, Serial Keys, Warez
- **Executables**: .exe, .bat, .cmd, .scr, .vbs, .ps1, .com files
- **Other Threats**: Phishing, Adware, Botnets, Cryptolockers

## 📊 Report Formats

### Text Report (.txt)
- Human-readable format
- Easy to share and archive
- Contains all scan details and statistics

### JSON Report (.json)
- Machine-readable format
- Programmatic analysis support
- Complete file-by-file breakdown

### Python App (.py)
- Standalone, no dependencies required
- Run on any system with Python 3
- Same detection capabilities as web version
- Export results to JSON

## 🔧 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: GitHub REST API
- **Python Version**: Pure Python 3 (no dependencies)
- **Storage**: GitHub Repository

## 📈 Repository

- **Owner**: abhinavshiva36-hue
- **Repo**: Checking
- **Created**: 2026
- **License**: Open Source

## 🎓 How to Use

### Step 1: Grant Permission
Provide your GitHub token to access repository data securely.

### Step 2: Run Scan
Click "Check All Files" to analyze all repository files.

### Step 3: Review Results
- See files flagged as illegal with reasons
- Check safe files list
- Review statistics and detection rate

### Step 4: Download Reports
- Export as TXT for human review
- Export as JSON for data analysis
- Download Python version for local scanning

## ⚠️ Important Notes

- Tokens are stored in browser localStorage
- Never share your GitHub token publicly
- Reports are generated locally and not uploaded anywhere
- The Python version can work with local files or GitHub API

## 🤝 Created By

**abhinavshiva36-hue**

Repository: https://github.com/abhinavshiva36-hue/Checking

---

**ABHINAV DETECTOR v1.0** - Making repositories safer, one scan at a time! 🎯