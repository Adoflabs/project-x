import type { Employee, DashboardData, FlightRiskFlag, AuditLog, PeerFeedback, Score } from '@/types';

// Real employee data from CSV
const REAL_EMPLOYEES = [
  { id: 'E001', name: 'Alice Chen', role: 'Lead Dev', department: 'Engineering', salary: 145000, tenureMonths: 24, managerRating: 10, outputMetric: 9, teamFeedback: 4.8, missedCheckins: 0, notes: 'High performer, leads by example', lastMonthScore: 94 },
  { id: 'E002', name: 'Bob Smith', role: 'Sr. Dev', department: 'Engineering', salary: 130000, tenureMonths: 18, managerRating: 8, outputMetric: 7, teamFeedback: 4.0, missedCheckins: 0, notes: 'Consistent output', lastMonthScore: 72 },
  { id: 'E003', name: 'Charlie Day', role: 'Jr. Dev', department: 'Engineering', salary: 95000, tenureMonths: 4, managerRating: 6, outputMetric: 5, teamFeedback: 3.2, missedCheckins: 2, notes: 'Missed meetings; might be overwhelmed', lastMonthScore: 75 },
  { id: 'E004', name: 'Diana Prince', role: 'Sales Dir', department: 'Sales', salary: 110000, tenureMonths: 36, managerRating: 9, outputMetric: 9, teamFeedback: 4.5, missedCheckins: 0, notes: 'Exceeding targets', lastMonthScore: 88 },
  { id: 'E005', name: 'Ethan Hunt', role: 'Sales Rep', department: 'Sales', salary: 75000, tenureMonths: 8, managerRating: 4, outputMetric: 3, teamFeedback: 2.5, missedCheckins: 1, notes: 'Ethan is frustrated with the lead volume', lastMonthScore: 62 },
  { id: 'E006', name: 'Fiona Glen', role: 'Support', department: 'Ops', salary: 65000, tenureMonths: 12, managerRating: 9, outputMetric: 8, teamFeedback: 4.5, missedCheckins: 0, notes: 'Great customer feedback', lastMonthScore: 80 },
  { id: 'E007', name: 'George King', role: 'Account Mgr', department: 'Sales', salary: 82000, tenureMonths: 15, managerRating: 7, outputMetric: 6, teamFeedback: 3.8, missedCheckins: 0, notes: 'Steady progress', lastMonthScore: 77 },
  { id: 'E008', name: 'Hannah Abbott', role: 'Designer', department: 'Creative', salary: 88000, tenureMonths: 22, managerRating: 8, outputMetric: 8, teamFeedback: 4.2, missedCheckins: 0, notes: 'Creative and timely', lastMonthScore: 84 },
  { id: 'E009', name: 'Ian Wright', role: 'DevOps', department: 'Engineering', salary: 125000, tenureMonths: 10, managerRating: 5, outputMetric: 4, teamFeedback: 3.0, missedCheckins: 1, notes: 'Concerned about recent downtime errors', lastMonthScore: 70 },
  { id: 'E010', name: 'Jane Doe', role: 'HR Manager', department: 'Admin', salary: 90000, tenureMonths: 30, managerRating: 9, outputMetric: 9, teamFeedback: 4.9, missedCheckins: 0, notes: 'Excellent organizational skills', lastMonthScore: 92 },
];

function randomId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function generateMockEmployees(count = 10): Employee[] {
  return REAL_EMPLOYEES.map((emp) => {
    const riskLevel = emp.lastMonthScore < 65 ? 'high' : emp.lastMonthScore < 75 ? 'medium' : 'low';
    return {
      id: emp.id,
      companyId: 'demo-company-id',
      role: emp.role,
      department: emp.department,
      tenureMonths: emp.tenureMonths,
      missedCheckins: emp.missedCheckins,
      notes: emp.notes,
      createdAt: new Date(Date.now() - emp.tenureMonths * 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      name: emp.name,
      latestScore: emp.lastMonthScore,
      scoreTrend: emp.lastMonthScore > 80 ? 2.5 : emp.lastMonthScore < 70 ? -3.2 : 0.8,
      riskLevel: riskLevel as 'low' | 'medium' | 'high',
    };
  });
}

export function generateMockDashboard(): DashboardData {
  const employees = REAL_EMPLOYEES;
  const avgScore = employees.reduce((sum, e) => sum + e.lastMonthScore, 0) / employees.length;
  const atRisk = employees.filter(e => e.lastMonthScore < 70 || e.missedCheckins > 0).length;
  
  return {
    averageScore: Math.round(avgScore * 10) / 10,
    employeesAtRisk: atRisk,
    pendingRatings: 0,
    feedbackDue: 3,
    scoreTrends: Array.from({ length: 8 }, (_, i) => ({
      week: `W${i + 1}`,
      avg: avgScore - 5 + Math.random() * 10,
      deptAvg: avgScore - 3 + Math.random() * 8,
      atRisk: atRisk + Math.floor(Math.random() * 3) - 1,
    })),
    scoreDistribution: [
      { name: 'Excellent (80-100)', value: employees.filter(e => e.lastMonthScore >= 80).length, color: '#10b981' },
      { name: 'Good (60-79)', value: employees.filter(e => e.lastMonthScore >= 60 && e.lastMonthScore < 80).length, color: '#3b82f6' },
      { name: 'Needs Attention (<60)', value: employees.filter(e => e.lastMonthScore < 60).length, color: '#ef4444' },
    ],
    recentActivity: generateMockAuditLogs(5),
    topPerformers: employees
      .sort((a, b) => b.lastMonthScore - a.lastMonthScore)
      .slice(0, 5)
      .map(e => ({ name: e.name, score: e.lastMonthScore, department: e.department })),
  };
}

export function generateMockRiskFlags(): FlightRiskFlag[] {
  const riskEmployees = REAL_EMPLOYEES.filter(e => 
    e.lastMonthScore < 70 || e.missedCheckins > 0 || 
    e.notes.toLowerCase().includes('frustrated') || 
    e.notes.toLowerCase().includes('concerned') ||
    e.notes.toLowerCase().includes('overwhelmed')
  );

  return riskEmployees.map((emp, idx) => {
    let reason = '';
    let severity: 'low' | 'medium' | 'high' = 'low';
    
    if (emp.lastMonthScore < 65) {
      reason = `Low score (${emp.lastMonthScore}). `;
      severity = 'high';
    } else if (emp.lastMonthScore < 75) {
      reason = `Below average score (${emp.lastMonthScore}). `;
      severity = 'medium';
    }
    
    if (emp.missedCheckins > 0) {
      reason += `${emp.missedCheckins} missed check-ins. `;
      severity = emp.missedCheckins > 1 ? 'high' : 'medium';
    }
    
    if (emp.teamFeedback < 3.5) {
      reason += `Low peer feedback (${emp.teamFeedback}/5). `;
    }
    
    const keywords = ['frustrated', 'concerned', 'overwhelmed'];
    const foundKeywords = keywords.filter(kw => emp.notes.toLowerCase().includes(kw));
    if (foundKeywords.length > 0) {
      reason += `Keywords detected: "${foundKeywords.join('", "')}". `;
      severity = 'high';
    }
    
    if (emp.tenureMonths < 6) {
      reason += `New hire (<6 months). `;
    }

    return {
      id: idx + 1,
      employeeId: emp.id,
      reason: reason + `Notes: "${emp.notes}"`,
      triggeredBy: 'system',
      resolvedStatus: false,
      severity,
      createdAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
      employee: {
        id: emp.id,
        companyId: 'demo',
        tenureMonths: emp.tenureMonths,
        missedCheckins: emp.missedCheckins,
        createdAt: '',
        updatedAt: '',
        name: emp.name,
        role: emp.role,
        department: emp.department,
      },
    };
  });
}

export function generateMockAuditLogs(count = 10): AuditLog[] {
  const events = [
    { tableName: 'scores', reason: 'Monthly score calculation' },
    { tableName: 'peer_feedback', reason: 'Peer feedback submitted' },
    { tableName: 'companies', reason: 'Formula configuration changed' },
    { tableName: 'flight_risk_flags', reason: 'Risk flag triggered' },
    { tableName: 'employees', reason: 'Employee profile updated' },
  ];
  return Array.from({ length: count }, (_, i) => {
    const event = events[i % events.length];
    const emp = REAL_EMPLOYEES[i % REAL_EMPLOYEES.length];
    return {
      id: i + 1,
      tableName: event.tableName,
      changedBy: emp.name,
      employeeId: emp.id,
      oldValue: event.tableName === 'scores' ? { finalScore: emp.lastMonthScore - 5 } : undefined,
      newValue: event.tableName === 'scores' ? { finalScore: emp.lastMonthScore } : undefined,
      reason: event.reason,
      timestamp: new Date(Date.now() - i * 3600000 * Math.random() * 48).toISOString(),
      hash: 'sha256-' + randomId().slice(0, 16),
    };
  });
}

export function generateMockScores(months = 12): Score[] {
  return Array.from({ length: months }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (months - i - 1));
    const emp = REAL_EMPLOYEES[i % REAL_EMPLOYEES.length];
    return {
      id: i + 1,
      employeeId: emp.id,
      componentValues: { 
        manager_rating: emp.managerRating * 10, 
        output_metric: emp.outputMetric * 10, 
        team_feedback: emp.teamFeedback * 20 
      },
      finalScore: emp.lastMonthScore,
      formulaVersion: 1,
      month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      createdAt: d.toISOString(),
    };
  });
}

export function generatePayFairnessPoints(count = 10) {
  const deptColors: Record<string, string> = {
    Engineering: '#3b82f6',
    Sales: '#10b981',
    Ops: '#8b5cf6',
    Creative: '#06b6d4',
    Admin: '#f59e0b',
  };
  
  return REAL_EMPLOYEES.map((emp) => {
    // Calculate percentiles based on actual data
    const sortedBySalary = [...REAL_EMPLOYEES].sort((a, b) => a.salary - b.salary);
    const sortedByScore = [...REAL_EMPLOYEES].sort((a, b) => a.lastMonthScore - b.lastMonthScore);
    
    const salaryPercentile = (sortedBySalary.findIndex(e => e.id === emp.id) / REAL_EMPLOYEES.length) * 100;
    const scorePercentile = (sortedByScore.findIndex(e => e.id === emp.id) / REAL_EMPLOYEES.length) * 100;
    
    return {
      id: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      color: deptColors[emp.department] || '#6b7280',
      scorePercentile,
      salaryPercentile,
      tenure: emp.tenureMonths,
    };
  });
}

export function generateMockFeedback(): PeerFeedback[] {
  return REAL_EMPLOYEES.slice(0, 3).map((emp, i) => ({
    id: i + 1,
    fromEmployee: REAL_EMPLOYEES[(i + 1) % REAL_EMPLOYEES.length].id,
    toEmployee: emp.id,
    score: emp.teamFeedback,
    timestamp: new Date().toISOString(),
  }));
}
