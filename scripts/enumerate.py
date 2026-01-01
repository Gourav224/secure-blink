import json
import sys
from datetime import datetime
from modules import (
    AmassRunner,
    DNSValidator,
    HTTPValidator,
    WhoisLookup,
    FileHandler,
)


class SubdomainEnumerator:
    def __init__(self, domain: str):
        self.domain = domain
        self.subdomains = []
        self.active_subdomains = []
        self.results = {
            "domain": domain,
            "timestamp": datetime.now().isoformat(),
            "total_subdomains": 0,
            "active_subdomains": 0,
            "subdomains": [],
            "active": [],
            "inactive": []
        }
        
        # Initialize modules
        self.amass_runner = AmassRunner(domain)
        self.dns_validator = DNSValidator()
        self.http_validator = HTTPValidator()
        self.whois_lookup = WhoisLookup()
        self.file_handler = FileHandler(domain)
    
    def run_amass(self) -> bool:
        if not self.amass_runner.run():
            return False
        
        self.subdomains = self.amass_runner.parse_output()
        return True
    
    def validate_subdomains(self):
        print(f"[*] Validating {len(self.subdomains)} subdomains...")
        
        # Get WHOIS info for main domain
        print(f"[*] Performing WHOIS lookup for {self.domain}...")
        whois_info = self.whois_lookup.lookup(self.domain)
        if whois_info:
            self.results["whois_info"] = whois_info
            print("[+] WHOIS lookup completed")
        else:
            print("[-] WHOIS lookup failed or not available")
        
        # Validate each subdomain
        for subdomain in self.subdomains:
            print(f"[*] Checking {subdomain}...", end=" ")
            
            subdomain_info = {
                "name": subdomain,
                "dns_resolves": False,
                "http_accessible": False,
                "ip_addresses": [],
                "details": {}
            }
            
            # Check DNS resolution
            ip_addresses = self.dns_validator.resolve(subdomain)
            if ip_addresses:
                subdomain_info["dns_resolves"] = True
                subdomain_info["ip_addresses"] = ip_addresses
                print(f"DNS✓ ({', '.join(ip_addresses[:2])}{'...' if len(ip_addresses) > 2 else ''})", end=" ")
                
                # Check HTTP accessibility
                http_status = self.http_validator.check(subdomain)
                if http_status["accessible"]:
                    subdomain_info["http_accessible"] = True
                    subdomain_info["details"] = http_status
                    self.active_subdomains.append(subdomain)
                    print(f"HTTP✓ ({http_status['status_code']})")
                else:
                    print("HTTP✗")
            else:
                print("DNS✗")
            
            self.results["subdomains"].append(subdomain_info)
            
            # Categorize as active or inactive
            if subdomain_info["dns_resolves"] or subdomain_info["http_accessible"]:
                self.results["active"].append(subdomain_info)
            else:
                self.results["inactive"].append(subdomain_info)
        
        # Update summary statistics
        self.results["total_subdomains"] = len(self.subdomains)
        self.results["active_subdomains"] = len(self.active_subdomains)
        
        print(f"\n[+] Validation complete: {len(self.active_subdomains)} active subdomains")

    def save_results(self) -> str:
        return self.file_handler.save_json(self.results)
    
    def run(self):
        if self.run_amass():
            self.validate_subdomains()
            output_file = self.save_results()
            # Print JSON to stdout for API integration (last line)
            print(json.dumps(self.results))
            return self.results
        return None


def main():
    if len(sys.argv) < 2:
        print("Usage: python enumerate.py <domain>")
        sys.exit(1)
    
    domain = sys.argv[1]
    enumerator = SubdomainEnumerator(domain)
    results = enumerator.run()
    
    if results:
        sys.exit(0)
    else:
        print("Enumeration failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
