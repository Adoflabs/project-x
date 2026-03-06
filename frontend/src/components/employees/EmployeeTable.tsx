'use client';

import { useState } from 'react';
import { Search, Filter, Columns, Upload, UserPlus, MoreVertical } from 'lucide-react';
import type { Employee } from '@/types';
import ScoreBadge from '../ui/ScoreBadge';
import TrendIndicator from '../ui/TrendIndicator';
import RiskPill from '../ui/RiskPill';

interface EmployeeTableProps {
  employees: Employee[];
  onRowClick?: (employee: Employee) => void;
}

export default function EmployeeTable({ employees, onRowClick }: EmployeeTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          Employees
          <span className="text-sm font-normal text-text-muted">({filteredEmployees.length})</span>
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
          <button className="px-3 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary placeholder:text-text-muted outline-none focus:border-white/30 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] transition-all"
          />
        </div>
        <button className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors flex items-center gap-2">
          <Columns className="w-4 h-4" />
          Columns
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Role / Dept
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Trend
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {filteredEmployees.map((employee) => (
              <tr
                key={employee.id}
                onClick={() => onRowClick?.(employee)}
                className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {employee.name?.[0]?.toUpperCase() || 'E'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{employee.name || 'Unknown'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-secondary">{employee.role || 'N/A'}</div>
                  <div className="text-xs text-text-muted">{employee.department || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.latestScore !== undefined ? (
                    <ScoreBadge score={employee.latestScore} size="sm" />
                  ) : (
                    <span className="text-sm text-text-muted">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.scoreTrend !== undefined ? (
                    <TrendIndicator value={employee.scoreTrend} size="sm" />
                  ) : (
                    <span className="text-sm text-text-muted">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.riskLevel ? (
                    <RiskPill level={employee.riskLevel} size="sm" />
                  ) : (
                    <span className="text-sm text-text-muted">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                  {new Date(employee.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-1 rounded hover:bg-white/[0.08] text-text-muted hover:text-text-secondary transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/[0.06]">
        <div className="text-sm text-text-muted">
          Showing 1–{filteredEmployees.length} of {employees.length} employees
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium">
            1
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
