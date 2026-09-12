#!/data/data/com.termux/files/usr/bin/bash

# ABHINAV DETECTOR - Termux Version
# Advanced File Scanner for Illegal and Suspicious Files
# Repository: https://github.com/abhinavshiva36-hue/Checking
# Created by: abhinavshiva36-hue

DETECTOR_VERSION="1.0"
DETECTOR_NAME="ABHINAV DETECTOR"

# Color codes for Termux
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Illegal keywords to detect
ILLEGAL_KEYWORDS=(
    "free fire max"
    "freefiremax"
    "ffmax"
    "freefire"
    "malware"
    "trojan"
    "virus"
    "ransomware"
    "spyware"
    "hack"
    "exploit"
    "backdoor"
    "keylogger"
    "worm"
    ".exe"
    ".bat"
    ".cmd"
    ".scr"
    ".vbs"
    ".ps1"
    ".com"
    "game mod"
    "crack"
    "keygen"
    "serial key"
    "warez"
    "phishing"
    "adware"
    "rootkit"
    "botnet"
)

# Initialize counters
TOTAL_FILES=0
ILLEGAL_COUNT=0
SAFE_COUNT=0

print_header() {
    echo -e "\n${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}     ${CYAN}🎯 $DETECTOR_NAME v$DETECTOR_VERSION${NC}${PURPLE}             ║${NC}"
    echo -e "${PURPLE}║${NC}     Advanced File Scanner for Illegal Files${PURPLE}              ║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}\n"
}

print_usage() {
    echo -e "${CYAN}Usage:${NC}"
    echo -e "  bash abhinav_detector.sh [OPTIONS]"
    echo -e "\n${CYAN}Options:${NC}"
    echo -e "  ${GREEN}-p, --path PATH${NC}        Path to scan (default: current directory)"
    echo -e "  ${GREEN}-o, --output FILE${NC}      Save report to JSON file"
    echo -e "  ${GREEN}-q, --quiet${NC}            Quiet mode (no console output)"
    echo -e "  ${GREEN}-h, --help${NC}             Show this help message"
    echo -e "\n${CYAN}Examples:${NC}"
    echo -e "  bash abhinav_detector.sh                    # Scan current directory"
    echo -e "  bash abhinav_detector.sh -p /sdcard        # Scan specific directory"
    echo -e "  bash abhinav_detector.sh -p . -o report.json  # Save report"
    echo -e "\n${CYAN}Created by:${NC} abhinavshiva36-hue"
    echo -e "${CYAN}Repository:${NC} https://github.com/abhinavshiva36-hue/Checking\n"
}

is_illegal_file() {
    local filename=$(echo "$1" | tr '[:upper:]' '[:lower:]')
    
    for keyword in "${ILLEGAL_KEYWORDS[@]}"; do
        if [[ "$filename" == *"$keyword"* ]]; then
            echo "$keyword"
            return 0
        fi
    done
    return 1
}

scan_file() {
    local file="$1"
    local filename=$(basename "$file")
    
    if illegal_keyword=$(is_illegal_file "$filename"); then
        echo "ILLEGAL"
        return 0
    else
        echo "SAFE"
        return 1
    fi
}

scan_directory() {
    local scan_path="$1"
    
    if [ ! -d "$scan_path" ]; then
        echo -e "${RED}❌ Error: Directory not found: $scan_path${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}🔍 Scanning: $scan_path${NC}\n"
    
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            TOTAL_FILES=$((TOTAL_FILES + 1))
            result=$(scan_file "$file")
            
            if [ "$result" == "ILLEGAL" ]; then
                ILLEGAL_COUNT=$((ILLEGAL_COUNT + 1))
                filename=$(basename "$file")
                if [ "$QUIET_MODE" != "1" ]; then
                    echo -e "${RED}⚠️  ILLEGAL: $file${NC}"
                fi
                ILLEGAL_FILES+=("$file")
            else
                SAFE_COUNT=$((SAFE_COUNT + 1))
                SAFE_FILES+=("$file")
            fi
        fi
    done < <(find "$scan_path" -type f)
}

print_report() {
    echo -e "\n${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}           ABHINAV DETECTOR - SCAN REPORT${PURPLE}                  ║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}\n"
    
    echo -e "${CYAN}📊 STATISTICS${NC}"
    echo -e "${BLUE}─────────────────────────────────────────────────────────────${NC}"
    echo -e "Total Files Scanned:  ${BLUE}$TOTAL_FILES${NC}"
    echo -e "Illegal Files Found:  ${RED}$ILLEGAL_COUNT${NC}"
    echo -e "Safe Files:           ${GREEN}$SAFE_COUNT${NC}"
    
    if [ $TOTAL_FILES -gt 0 ]; then
        DETECTION_RATE=$((ILLEGAL_COUNT * 100 / TOTAL_FILES))
        echo -e "Detection Rate:       ${YELLOW}$DETECTION_RATE%${NC}"
    fi
    
    echo -e "\n"
    
    if [ $ILLEGAL_COUNT -gt 0 ]; then
        echo -e "${RED}🚫 ILLEGAL FILES DETECTED ($ILLEGAL_COUNT)${NC}"
        echo -e "${BLUE}─────────────────────────────────────────────────────────────${NC}"
        local i=1
        for file in "${ILLEGAL_FILES[@]}"; do
            echo -e "  ${RED}$i. $file${NC}"
            i=$((i + 1))
        done
        echo -e ""
    fi
    
    echo -e "${GREEN}✅ SAFE FILES ($SAFE_COUNT)${NC}"
    echo -e "${BLUE}─────────────────────────────────────────────────────────────${NC}"
    
    if [ $SAFE_COUNT -eq 0 ]; then
        echo -e "  ${YELLOW}No safe files found${NC}"
    elif [ $SAFE_COUNT -le 10 ]; then
        local i=1
        for file in "${SAFE_FILES[@]}"; do
            echo -e "  ${GREEN}$i. $file${NC}"
            i=$((i + 1))
        done
    else
        local i=1
        for file in "${SAFE_FILES[@]:0:10}"; do
            echo -e "  ${GREEN}$i. $file${NC}"
            i=$((i + 1))
        done
        echo -e "  ${YELLOW}... and $((SAFE_COUNT - 10)) more safe files${NC}"
    fi
    
    echo -e "\n${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC} 🎯 ABHINAV DETECTOR v$DETECTOR_VERSION - Scan Complete${PURPLE}         ║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}\n"
}

save_json_report() {
    local output_file="$1"
    
    {
        echo "{"
        echo "  \"detector\": \"$DETECTOR_NAME\","
        echo "  \"version\": \"$DETECTOR_VERSION\","
        echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
        echo "  \"repository\": {"
        echo "    \"owner\": \"abhinavshiva36-hue\","
        echo "    \"name\": \"Checking\","
        echo "    \"url\": \"https://github.com/abhinavshiva36-hue/Checking\""
        echo "  },"
        echo "  \"statistics\": {"
        echo "    \"totalFilesScanned\": $TOTAL_FILES,"
        echo "    \"illegalFilesFound\": $ILLEGAL_COUNT,"
        echo "    \"safeFiles\": $SAFE_COUNT"
        echo "  },"
        echo "  \"illegal_files\": ["
        
        for i in "${!ILLEGAL_FILES[@]}"; do
            echo "    {"
            echo "      \"name\": \"${ILLEGAL_FILES[$i]}\","
            echo "      \"status\": \"ILLEGAL\""
            echo "    }$([ $i -lt $((${#ILLEGAL_FILES[@]} - 1)) ] && echo ',' || echo '')"
        done
        
        echo "  ],"
        echo "  \"safe_files\": ["
        
        for i in "${!SAFE_FILES[@]}"; do
            echo "    {"
            echo "      \"name\": \"${SAFE_FILES[$i]}\","
            echo "      \"status\": \"SAFE\""
            echo "    }$([ $i -lt $((${#SAFE_FILES[@]} - 1)) ] && echo ',' || echo '')"
        done
        
        echo "  ]"
        echo "}"
    } > "$output_file"
    
    echo -e "${GREEN}✅ Report saved: $output_file${NC}"
}

# Parse command line arguments
SCAN_PATH="."
OUTPUT_FILE=""
QUIET_MODE=0

while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--path)
            SCAN_PATH="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -q|--quiet)
            QUIET_MODE=1
            shift
            ;;
        -h|--help)
            print_header
            print_usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            print_usage
            exit 1
            ;;
    esac
done

# Initialize arrays
ILLEGAL_FILES=()
SAFE_FILES=()

# Run scan
print_header
scan_directory "$SCAN_PATH"

# Print report
if [ "$QUIET_MODE" != "1" ]; then
    print_report
fi

# Save report if requested
if [ -n "$OUTPUT_FILE" ]; then
    save_json_report "$OUTPUT_FILE"
fi

# Exit with illegal count
exit $ILLEGAL_COUNT
