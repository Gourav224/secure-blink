import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional


class FileHandler:
    def __init__(self, domain: str, output_dir: Optional[str] = None):
        self.domain = domain
        self.output_dir = output_dir or self._detect_output_dir()
        self.output_path = Path(self.output_dir)
        self.output_path.mkdir(exist_ok=True, parents=True)
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    def _detect_output_dir(self) -> str:
        if Path("/outputs").exists():
            return "/outputs"
        return "../outputs"
    
    def save_json(self, results: Dict[str, Any]) -> str:
        json_file = self.output_path / f"{self.domain}_{self.timestamp}.json"
        with open(json_file, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"[+] Results saved to {json_file}")
        return str(json_file)
    

