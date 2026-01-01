export interface EnumerationRequest {
    domain: string;
}

export interface SubdomainDetails {
    accessible: boolean;
    status_code?: number;
    protocol?: string;
    url?: string;
}

export interface SubdomainInfo {
    name: string;
    dns_resolves: boolean;
    http_accessible: boolean;
    ip_addresses?: string[];
    details: SubdomainDetails;
}

export interface WhoisInfo {
    registrar?: string;
    creation_date?: string;
    expiration_date?: string;
    name_servers?: string[];
}

export interface EnumerationResult {
    domain: string;
    timestamp: string;
    total_subdomains: number;
    active_subdomains: number;
    subdomains: SubdomainInfo[];
    active: SubdomainInfo[];
    inactive: SubdomainInfo[];
    whois_info?: WhoisInfo;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    metadata?: {
        processingTime?: string;
        totalSubdomains?: number;
        activeSubdomains?: number;
    };
}

export interface HealthCheckResponse {
    status: string;
    timestamp: string;
    service: string;
}

export interface ScanListItem {
    filename: string;
    path: string;
}

export interface ScanListResponse {
    count: number;
    scans: ScanListItem[];
    message?: string;
}
