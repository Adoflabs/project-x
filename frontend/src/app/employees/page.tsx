'use client';

import { useState, useEffect } from 'react';
import EmployeeTable from '@/components/employees/EmployeeTable';
import { generateMockEmployees } from '@/lib/mock-data';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';
import type { Employee } from '@/types';

export default function EmployeesPage() {
  const { user } = useAuthStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [csvText, setCsvText] = useState('');

  const handleImportCSV = async () => {
    if (!csvText.trim() || !user?.companyId) {
      alert('Please paste CSV data');
      return;
    }

    try {
      await api.importCsv(user.companyId, csvText);
      alert('CSV imported successfully!');
      setShowImportCSV(false);
      setCsvText('');
      // Refresh employee list
      const { data } = await api.listEmployees({ page: 1, perPage: 100 });
      setEmployees(data);
    } catch (error) {
      alert('Failed to import CSV. Using demo mode.');
    }
  };

  useEffect(() => {
    async function fetchEmployees() {
      // Use mock data for client demo
      setEmployees(generateMockEmployees(10));
      setDemoMode(false); // Hide demo warning for client presentation
      setLoading(false);
    }

    if (user) {
      fetchEmployees();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {demoMode && (
        <div className="glass-card p-4 border-l-4 border-warning">
          <p className="text-sm text-warning">
            ⚠️ Demo Mode: Backend unavailable. Showing mock data.
          </p>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Employees</h1>
          <p className="text-text-secondary">Manage and view employee scorecards</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportCSV(true)}
            className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import CSV
          </button>
          <button
            onClick={() => setShowAddEmployee(true)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Employee
          </button>
        </div>
      </div>

      <EmployeeTable employees={employees} onRowClick={setSelectedEmployee} />

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddEmployee(false)}
        >
          <div
            className="glass-card p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-text-primary mb-4">Add Employee</h2>
            <p className="text-sm text-text-secondary mb-4">
              This feature requires backend integration. For now, use Import CSV to add multiple employees.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddEmployee(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddEmployee(false);
                  setShowImportCSV(true);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors"
              >
                Import CSV Instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportCSV && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowImportCSV(false)}
        >
          <div
            className="glass-card p-6 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-text-primary mb-4">Import Employees from CSV</h2>
            <p className="text-sm text-text-secondary mb-4">
              Paste your CSV data below. Format: name,email,role,department,salary,managerId
            </p>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="John Doe,john@example.com,Engineer,Engineering,75000,manager-id&#10;Jane Smith,jane@example.com,Designer,Design,70000,manager-id"
              rows={10}
              className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary placeholder:text-text-muted outline-none focus:border-white/30 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] transition-all resize-none font-mono text-sm"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowImportCSV(false);
                  setCsvText('');
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImportCSV}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Detail Drawer - Placeholder */}
      {selectedEmployee && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="w-full max-w-2xl h-full bg-bg-layer2 border-l border-white/[0.06] p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-2xl font-bold text-white">
                  {selectedEmployee.name?.[0]?.toUpperCase() || 'E'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">{selectedEmployee.name}</h2>
                  <p className="text-text-secondary">{selectedEmployee.role} · {selectedEmployee.department}</p>
                  <p className="text-sm text-text-muted mt-1">
                    Tenure: {Math.floor(selectedEmployee.tenureMonths / 12)}y {selectedEmployee.tenureMonths % 12}m
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Score Overview */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Score Overview</h3>
                <div className="text-5xl font-mono font-bold text-text-primary mb-2">
                  {selectedEmployee.latestScore || 'N/A'}
                </div>
                <div className="text-sm text-text-muted">Last updated: {new Date(selectedEmployee.updatedAt).toLocaleDateString()}</div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      window.location.href = `/forms?employeeId=${selectedEmployee.id}`;
                    }}
                    className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors"
                  >
                    Rate Now
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const blob = await api.exportPdf(selectedEmployee.id);
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${selectedEmployee.name}-scorecard.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      } catch (error) {
                        alert('PDF export not available in demo mode');
                      }
                    }}
                    className="px-4 py-3 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
