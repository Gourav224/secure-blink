import socket
import requests
from typing import List, Optional, Dict, Any


class DNSValidator:
    @staticmethod
    def resolve(subdomain: str) -> Optional[List[str]]:
        try:
            ip_addresses = []
            
            # Try IPv4
            try:
                ipv4 = socket.gethostbyname(subdomain)
                ip_addresses.append(ipv4)
            except socket.gaierror:
                pass
            
            # Try to get all addresses (including IPv6)
            try:
                addr_info = socket.getaddrinfo(subdomain, None)
                for info in addr_info:
                    ip = info[4][0]
                    if ip not in ip_addresses:
                        ip_addresses.append(ip)
            except socket.gaierror:
                pass
            
            return ip_addresses if ip_addresses else None
        except Exception:
            return None


class HTTPValidator:
    @staticmethod
    def check(subdomain: str, timeout: int = 5) -> Dict[str, Any]:
        for protocol in ['https', 'http']:
            try:
                url = f"{protocol}://{subdomain}"
                response = requests.get(
                    url,
                    timeout=timeout,
                    allow_redirects=True,
                    verify=False
                )
                return {
                    "accessible": True,
                    "status_code": response.status_code,
                    "protocol": protocol,
                    "url": url
                }
            except requests.RequestException:
                continue
        
        return {"accessible": False}

