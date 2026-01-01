import subprocess
import json
from pathlib import Path
from typing import List


class AmassRunner:
    def __init__(self, domain: str, timeout: int = 300):
        self.domain = domain
        self.timeout = timeout
        self.output_base = Path("/tmp/amass_output")
    
    def run(self) -> bool:
        print(f"[*] Starting Amass enumeration for {self.domain}...")
        try:
            process = subprocess.run(
                ["amass", "enum", "-passive", "-d", self.domain, "-oA", str(self.output_base)],
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            if process.returncode == 0:
                print("[+] Amass enumeration completed")
                return True
            print(f"[-] Amass failed: {process.stderr}")
            return False
        except subprocess.TimeoutExpired:
            print("[-] Amass timed out")
            return False
        except Exception as e:
            print(f"[-] Error running Amass: {str(e)}")
            return False
    
    def parse_output(self) -> List[str]:
        json_file = self.output_base.with_suffix(".json")
        txt_file = self.output_base.with_suffix(".txt")
        subdomains = []
        
        if json_file.exists() and json_file.stat().st_size > 0:
            try:
                with open(json_file) as f:
                    for line in f:
                        line = line.strip()
                        if not line:
                            continue
                        try:
                            data = json.loads(line)
                            subdomain = data.get('name', '').strip()
                            if subdomain and '.' in subdomain and '-->' not in subdomain:
                                if subdomain not in subdomains:
                                    subdomains.append(subdomain)
                        except (json.JSONDecodeError, KeyError):
                            continue
            except Exception as e:
                print(f"[-] Error reading JSON: {e}")
        
        if not subdomains and txt_file.exists() and txt_file.stat().st_size > 0:
            try:
                with open(txt_file) as f:
                    for line in f:
                        if '--> node -->' in line:
                            subdomain = line.split('--> node -->')[1].split('(')[0].strip()
                            if subdomain and '.' in subdomain and subdomain not in subdomains:
                                subdomains.append(subdomain)
            except Exception as e:
                print(f"[-] Error reading TXT: {e}")
        
        if not subdomains:
            print(f"[-] No subdomains found in {json_file} or {txt_file}")
        else:
            print(f"[+] Found {len(subdomains)} unique subdomains")
        return subdomains

