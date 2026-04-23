export interface Incident {
  id: string;
  type: 'FIRE' | 'MEDICAL' | 'DISASTER' | 'SECURITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'active' | 'resolved';
  location: string;
  createdAt: number;
  createdBy: string;
  resolvedAt?: number;
}

export interface Task {
  id: string;
  incidentId: string;
  title: string;
  assignedRole: 'security' | 'medical' | 'management' | 'admin';
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'critical' | 'high' | 'medium';
  estimatedMinutes: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'deployed' | 'unavailable';
}

export interface LogEntry {
  id: string;
  incidentId: string;
  message: string;
  actor: string;
  actorRole: string;
  timestamp: number;
}
