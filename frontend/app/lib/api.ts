// API configuration and client
const API_BASE_URL = 'http://localhost:8000/api';

// Types
export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_traffic: {
    in: number;
    out: number;
  };
  timestamp: string;
}

export interface SystemStatus {
  status: string;
  timestamp: string;
  version: string;
}

// API Client Class
class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    return headers;
  }

  // System monitoring endpoints
  async getSystemStatus(): Promise<SystemStatus> {
    const response = await fetch(`${API_BASE_URL}/status`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get system status');
    }

    return response.json();
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    const response = await fetch(`${API_BASE_URL}/metrics`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get system metrics');
    }

    return response.json();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
