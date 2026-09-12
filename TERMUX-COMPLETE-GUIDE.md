# 🎯 ABHINAV DETECTOR - Complete Termux Installation & Setup Guide

**Created by:** abhinavshiva36-hue  
**Repository:** https://github.com/abhinavshiva36-hue/Checking  
**Version:** 1.0

---

## 📱 Complete Installation Steps for Termux

### Step 1️⃣: Download & Install Termux

**Option A: F-Droid (Recommended)**
1. Go to: https://f-droid.org/
2. Search for "Termux"
3. Download and install the latest version
4. Open Termux app

**Option B: Google Play Store**
1. Open Google Play Store
2. Search for "Termux"
3. Install from official Termux developer
4. Open Termux app

---

### Step 2️⃣: Grant Storage Permission in Termux

Run this command to enable storage access:

```bash
termux-setup-storage
```

**This allows Termux to access your phone's storage**

---

### Step 3️⃣: Update & Install Dependencies

Copy and paste this complete command:

```bash
pkg update -y && pkg upgrade -y && pkg install -y git bash coreutils
```

**This installs:**
- Git (to clone repository)
- Bash (shell environment)
- Coreutils (basic utilities)

---

### Step 4️⃣: Clone ABHINAV DETECTOR Repository

```bash
git clone https://github.com/abhinavshiva36-hue/Checking.git
```

Wait for it to complete.

---

### Step 5️⃣: Enter the Repository Directory

```bash
cd Checking
```

---

### Step 6️⃣: Make Script Executable

```bash
chmod +x abhinav_detector.sh
```

---

## 🚀 Running ABHINAV DETECTOR

### ✅ Basic Scan (Current Directory)

```bash
bash abhinav_detector.sh
```

**Output:**
- Shows all files scanned
- Lists illegal files found
- Shows detection statistics

---

### ✅ Scan Android Downloads Folder

```bash
bash abhinav_detector.sh -p ~/storage/downloads
```

**What it scans:**
- All files in Downloads folder
- Displays illegal files with ⚠️ icon
- Shows complete statistics

---

### ✅ Scan Entire Internal Storage

```bash
bash abhinav_detector.sh -p /sdcard
```

⚠️ **Warning:** This may take time (scans entire phone storage)

---

### ✅ Scan and Save Report as JSON

```bash
bash abhinav_detector.sh -p ~/storage/downloads -o report.json
```

**Creates:** `report.json` file with scan results

---

### ✅ Scan Multiple Folders

**Scan Downloads:**
```bash
bash abhinav_detector.sh -p ~/storage/downloads -o downloads_report.json
```

**Scan Documents:**
```bash
bash abhinav_detector.sh -p ~/storage/documents -o documents_report.json
```

**Scan Pictures:**
```bash
bash abhinav_detector.sh -p ~/storage/pictures -o pictures_report.json
```

---

### ✅ Quiet Mode (Silent Scan)

```bash
bash abhinav_detector.sh -p ~/storage/downloads -q
```

**No output on screen, just saves report**

---

### ✅ View Help & All Options

```bash
bash abhinav_detector.sh -h
```

or

```bash
bash abhinav_detector.sh --help
```

---

## 📁 All Available Storage Paths in Termux

| Folder | Path |
|--------|------|
| Downloads | `~/storage/downloads` |
| Documents | `~/storage/documents` |
| Pictures | `~/storage/pictures` |
| Videos | `~/storage/movies` |
| Music | `~/storage/music` |
| All Storage | `/sdcard` |
| Internal Storage | `/storage/emulated/0` |
| Camera | `~/storage/pictures/DCIM` |

---

## 🔍 What Gets Detected?

The scanner checks for these keywords:

### 🎮 Games & Mods
- Free Fire Max
- FreeFireMax
- Game Mods
- Game Hacks

### 🦠 Malware & Viruses
- Malware
- Trojans
- Virus
- Ransomware
- Spyware
- Worms
- Botnets

### 💻 Exploits & Hacks
- Hack Tools
- Exploits
- Backdoors
- Keyloggers
- Rootkits

### 📦 Cracked Software
- Crack
- Keygen
- Serial Keys
- Warez
- Phishing

### 📄 Suspicious Files
- .exe files
- .bat files
- .cmd files
- .scr files
- .vbs files
- .ps1 files
- .com files

---

## 📊 Example Output

### Running a Scan:
```
🎯 ABHINAV DETECTOR v1.0
Advanced File Scanner for Illegal Files

╔════════════════════════════════════════════════════════════╗
║           ABHINAV DETECTOR - SCAN REPORT                  ║
╚════════════════════════════════════════════════════════════╝

🔍 Scanning: /sdcard/Downloads

⚠️  ILLEGAL: /sdcard/Downloads/free_fire_max.apk
⚠️  ILLEGAL: /sdcard/Downloads/hack_tool.exe

📊 STATISTICS
─────────────────────────────────────────────────────────────
Total Files Scanned:  128
Illegal Files Found:  2
Safe Files:           126
Detection Rate:       1%

🚫 ILLEGAL FILES DETECTED (2)
─────────────────────────────────────────────────────────────
  1. /sdcard/Downloads/free_fire_max.apk
  2. /sdcard/Downloads/hack_tool.exe

✅ SAFE FILES (126)
─────────────────────────────────────────────────────────────
  1. /sdcard/Downloads/document.pdf
  2. /sdcard/Downloads/photo.jpg
  3. /sdcard/Downloads/video.mp4
  ... and 123 more safe files
```

---

## 💾 JSON Report Format

When you use `-o report.json`:

```json
{
  "detector": "ABHINAV DETECTOR",
  "version": "1.0",
  "timestamp": "2026-09-12T14:35:26Z",
  "repository": {
    "owner": "abhinavshiva36-hue",
    "name": "Checking",
    "url": "https://github.com/abhinavshiva36-hue/Checking"
  },
  "statistics": {
    "totalFilesScanned": 128,
    "illegalFilesFound": 2,
    "safeFiles": 126
  },
  "illegal_files": [
    {
      "name": "/sdcard/Downloads/free_fire_max.apk",
      "status": "ILLEGAL"
    },
    {
      "name": "/sdcard/Downloads/hack_tool.exe",
      "status": "ILLEGAL"
    }
  ]
}
```

---

## ⚡ Advanced Tips & Tricks

### 📌 Create Quick Alias Command

Add this to `~/.bashrc`:

```bash
echo 'alias abhinav="cd ~/Checking && bash abhinav_detector.sh"' >> ~/.bashrc
source ~/.bashrc
```

**Now you can run from anywhere:**
```bash
abhinav -p ~/storage/downloads -o report.json
```

---

### 📌 View Report File

After scanning, view your JSON report:

```bash
cat report.json
```

---

### 📌 Share Report with Others

Copy report to cloud or email:

```bash
# View and copy content
cat report.json

# Or send to specific location
cp report.json ~/storage/downloads/
```

---

### 📌 Regular Scanning (Cron-like)

Keep scanning Downloads weekly:

```bash
bash abhinav_detector.sh -p ~/storage/downloads -o ~/storage/downloads/scan_$(date +%Y%m%d).json
```

---

## 🆘 Troubleshooting Guide

### ❌ Problem: "Permission Denied"

**Solution:**
```bash
chmod +x abhinav_detector.sh
```

---

### ❌ Problem: "Directory not found"

**Solution:**
```bash
# First, grant storage access
termux-setup-storage

# Then try again
bash abhinav_detector.sh -p ~/storage/downloads
```

---

### ❌ Problem: "Git not found"

**Solution:**
```bash
pkg install -y git
```

---

### ❌ Problem: Command works but no output

**Solution (silent mode):**
```bash
bash abhinav_detector.sh -p ~/storage/downloads -q -o report.json
```

---

### ❌ Problem: Need to update the script

**Solution:**
```bash
cd ~/Checking
git pull origin main
```

---

## 📞 Quick Reference Commands

| Command | Purpose |
|---------|---------|
| `bash abhinav_detector.sh` | Scan current folder |
| `bash abhinav_detector.sh -h` | Show help |
| `bash abhinav_detector.sh -p /sdcard` | Scan phone storage |
| `bash abhinav_detector.sh -p ~/storage/downloads -o report.json` | Scan Downloads & save |
| `bash abhinav_detector.sh -q` | Quiet scan (no console output) |
| `cat report.json` | View scan results |
| `cd Checking && git pull` | Update script |

---

## 🎯 Complete Example Workflow

### Step-by-Step Process:

**1. Open Termux**
```bash
# Already done when you opened app
```

**2. First time setup:**
```bash
termux-setup-storage
pkg update -y && pkg upgrade -y && pkg install -y git bash coreutils
git clone https://github.com/abhinavshiva36-hue/Checking.git
cd Checking
chmod +x abhinav_detector.sh
```

**3. Scan Downloads:**
```bash
bash abhinav_detector.sh -p ~/storage/downloads -o report.json
```

**4. View Results:**
```bash
cat report.json
```

**5. Share Results:**
```bash
cp report.json ~/storage/downloads/
```

---

## ✅ Verification Checklist

- ✅ Termux installed and running
- ✅ Storage permission granted
- ✅ Git, Bash, Coreutils installed
- ✅ Repository cloned to ~/Checking
- ✅ Script is executable (chmod +x)
- ✅ Successfully scanned a folder
- ✅ Report saved as JSON

---

## 📝 Important Notes

1. **First Scan May Take Time** - Initial scan processes all files
2. **Large Folders** - Scanning /sdcard may take 5-10 minutes
3. **Storage Access** - Grant all permissions when prompted
4. **JSON Reports** - Automatically saved in current directory
5. **Updates** - Run `git pull` to update the detector

---

## 🔗 Useful Links

- **GitHub Repository:** https://github.com/abhinavshiva36-hue/Checking
- **Termux Project:** https://termux.com/
- **F-Droid Store:** https://f-droid.org/

---

## 👤 Created By

**abhinavshiva36-hue**

---

## 📜 License

**Open Source** - Free to Use and Modify

---

## 🎉 You're All Set!

Your ABHINAV DETECTOR is now ready to scan for illegal and suspicious files on your Android phone using Termux!

**Start scanning:**
```bash
bash ~/Checking/abhinav_detector.sh -p ~/storage/downloads -o report.json
```

**Happy Scanning! 🎯**
