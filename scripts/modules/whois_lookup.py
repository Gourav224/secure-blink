from typing import Optional, Dict, Any
import whois


class WhoisLookup:
    @staticmethod
    def lookup(domain: str) -> Optional[Dict[str, Any]]:
        try:
            whois_data = whois.whois(domain)
            return {
                "registrar": getattr(whois_data, 'registrar', None),
                "creation_date": str(getattr(whois_data, 'creation_date', None)),
                "expiration_date": str(getattr(whois_data, 'expiration_date', None)),
                "name_servers": getattr(whois_data, 'name_servers', None),
            }
        except Exception:
            return None

