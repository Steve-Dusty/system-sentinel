export interface MonitoredService {
  id: string;
  name: string;
  ip: string;
  port: number;
  description?: string;
  status: 'online' | 'offline' | 'warning';
  lastCheck: Date;
  metrics: {
    responseTime: number;
    uptime: number;
    errors: number;
  };
}
