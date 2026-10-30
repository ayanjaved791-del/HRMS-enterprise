import React from 'react';
import {
  LayoutDashboard,
  Users,
  Network,
  Clock,
  CalendarOff,
  Coins,
  UserPlus,
  TrendingUp,
  GraduationCap,
  FileText,
  BarChart3,
  ShieldCheck,
  Settings,
  Calendar,
  FileSpreadsheet,
  CalendarDays,
  Hourglass,
  Palette,
  Calculator,
  Receipt,
  Gift,
  Globe,
  Briefcase,
  UserCheck,
  Target,
  Award,
  Trophy,
  Smile,
  BookOpen,
  FolderLock,
  Laptop,
  Key,
  Building2,
  GitBranch,
  Megaphone,
  FileCheck2,
  ChevronRight,
  User
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

export interface ModuleNavTab {
  id: string;
  label: string;
  icon: any;
  badge?: string | number | null;
}

export const ModuleNavBar: React.FC = () => {
  const {
    activeSubTab,
    setActiveSubTab,
    setActiveModule,
    activeRole,
    currentUser,
    leaveRequests,
    expenseClaims,
    announcements,
    candidates,
    payrollRuns,
  } = useHR();

  const currentEmpId = currentUser?.employeeId || currentUser?.id;
  const myPendingLeaves = leaveRequests.filter(
    (l) => l.employeeId === currentEmpId && l.status === 'Pending'
  ).length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
  const pendingExpenses = expenseClaims.filter((e) => e.status === 'Pending').length;

  // Determine current parent module group from activeSubTab
  const getModuleGroup = (): { title: string; category: string; tabs: ModuleNavTab[] } => {
    // A. EMPLOYEE PORTAL SPECIFIC NAVBAR
    if (activeRole === 'employee') {
      if (['dashboard', 'employee-ess'].includes(activeSubTab)) {
        return {
          title: 'Personal Workspace & Attendance Overview',
          category: 'My Workspace',
          tabs: [
            { id: 'employee-ess', label: 'My Dashboard', icon: LayoutDashboard },
            { id: 'employee-profile', label: 'My Profile & Security', icon: User },
          ],
        };
      }
      if (['attendance', 'attendance-overview', 'project-timesheets'].includes(activeSubTab)) {
        return {
          title: 'My Biometric Attendance & Project Hours',
          category: 'My Attendance',
          tabs: [
            { id: 'attendance-overview', label: 'Punch Logs & History', icon: Clock },
            { id: 'project-timesheets', label: 'Project Timesheets', icon: FileSpreadsheet },
          ],
        };
      }
      if (['leave-management', 'leave-tracker', 'applications', 'employee-applications'].includes(activeSubTab)) {
        return {
          title: 'Paid Time Off & Leave Applications',
          category: 'Time-Off & Leaves',
          tabs: [
            { id: 'leave-tracker', label: 'My Leave Applications', icon: CalendarOff, badge: myPendingLeaves || null },
            { id: 'employee-applications', label: 'Submit Request', icon: Calendar },
          ],
        };
      }
      if (['payroll', 'payroll-engine', 'employee-payslips'].includes(activeSubTab)) {
        return {
          title: 'Monthly Payslips & Compensation Details',
          category: 'My Compensation',
          tabs: [
            { id: 'employee-payslips', label: 'Official Payslips', icon: Coins },
          ],
        };
      }
      if (['announcements', 'employee-announcements'].includes(activeSubTab)) {
        return {
          title: 'Organization Announcements & Broadcasts',
          category: 'Company Notices',
          tabs: [
            { id: 'employee-announcements', label: 'All Notices', icon: Megaphone, badge: announcements.length || null },
          ],
        };
      }
      if (['settings', 'employee-profile'].includes(activeSubTab)) {
        return {
          title: 'My Security Credentials & Profile Settings',
          category: 'My Profile',
          tabs: [
            { id: 'employee-profile', label: 'Profile & Password', icon: User },
          ],
        };
      }

      // Default employee tabs
      return {
        title: 'Employee Self-Service Portal',
        category: 'My Workspace',
        tabs: [
          { id: 'employee-ess', label: 'My Dashboard', icon: LayoutDashboard },
          { id: 'attendance-overview', label: 'My Attendance', icon: Clock },
          { id: 'leave-tracker', label: 'My Leaves', icon: CalendarOff, badge: myPendingLeaves || null },
          { id: 'employee-payslips', label: 'My Payslips', icon: Coins },
        ],
      };
    }

    // B. ADMIN CONSOLE SPECIFIC NAVBAR
    // 1. Dashboard
    if (['dashboard', 'admin-applications', 'admin-announcements', 'manager-mss'].includes(activeSubTab)) {
      return {
        title: 'Executive Dashboard & Workforce Signals',
        category: 'Dashboard',
        tabs: [
          { id: 'dashboard', label: 'Overview & Analytics', icon: LayoutDashboard },
          { id: 'admin-applications', label: 'Pending Approvals', icon: FileCheck2, badge: pendingLeaves + pendingExpenses || null },
          { id: 'admin-announcements', label: 'Broadcasts', icon: Megaphone, badge: announcements.length || null },
          { id: 'manager-mss', label: 'Manager Portal (MSS)', icon: Users },
        ],
      };
    }

    // 2. Employees
    if (['employees', 'onboarding', 'offboarding'].includes(activeSubTab)) {
      return {
        title: 'Employee Directory & Lifecycle',
        category: 'Employees',
        tabs: [
          { id: 'employees', label: 'Staff Directory', icon: Users },
          { id: 'onboarding', label: 'Digital Onboarding', icon: UserCheck },
          { id: 'offboarding', label: 'Offboarding Tracker', icon: CalendarOff },
        ],
      };
    }

    // 3. Organization
    if (['organization', 'org-chart', 'company-profile', 'workflow-builder'].includes(activeSubTab)) {
      return {
        title: 'Organization Architecture & Structure',
        category: 'Organization',
        tabs: [
          { id: 'org-chart', label: 'Hierarchy Org Chart', icon: Network },
          { id: 'company-profile', label: 'HQ & Geofencing', icon: Building2 },
          { id: 'workflow-builder', label: 'Automated Workflows', icon: GitBranch },
        ],
      };
    }

    // 4. Attendance
    if (['attendance', 'attendance-overview', 'shift-scheduler', 'project-timesheets', 'holiday-calendar', 'overtime-engine'].includes(activeSubTab)) {
      return {
        title: 'Time, Attendance & Shift Governance',
        category: 'Attendance',
        tabs: [
          { id: 'attendance-overview', label: 'Biometric Daily Logs', icon: Clock },
          { id: 'shift-scheduler', label: 'Shift Scheduler', icon: Calendar },
          { id: 'project-timesheets', label: 'Project Timesheets', icon: FileSpreadsheet },
          { id: 'holiday-calendar', label: 'Holiday Calendar', icon: CalendarDays },
          { id: 'overtime-engine', label: 'Overtime Engine', icon: Hourglass },
        ],
      };
    }

    // 5. Leave management
    if (['leave-management', 'leave-tracker', 'applications'].includes(activeSubTab)) {
      return {
        title: 'Leave & PTO Management',
        category: 'Leave management',
        tabs: [
          { id: 'leave-tracker', label: 'Leave Tracker', icon: CalendarOff },
          { id: 'applications', label: 'Time-Off Approvals', icon: FileCheck2, badge: pendingLeaves || null },
        ],
      };
    }

    // 6. Payroll
    if (['payroll', 'payroll-engine', 'payslip-studio', 'tax-calculator', 'expense-claims', 'benefits-portal', 'multi-currency'].includes(activeSubTab)) {
      return {
        title: 'Payroll, Taxation & Compensation Studio',
        category: 'Payroll',
        tabs: [
          { id: 'payroll-engine', label: 'Disbursal Engine', icon: Coins },
          { id: 'payslip-studio', label: 'Payslip Designer', icon: Palette },
          { id: 'tax-calculator', label: 'Tax Slabs Calculator', icon: Calculator },
          { id: 'expense-claims', label: 'Expense Reimbursements', icon: Receipt, badge: pendingExpenses || null },
          { id: 'benefits-portal', label: 'Benefits & Perks', icon: Gift },
          { id: 'multi-currency', label: 'Multi-Currency', icon: Globe },
        ],
      };
    }

    // 7. Recruitment
    if (['recruitment', 'ats', 'interviews', 'background-check'].includes(activeSubTab)) {
      return {
        title: 'Talent Acquisition & Candidate Pipelines',
        category: 'Recruitment',
        tabs: [
          { id: 'ats', label: 'Candidate Pipeline (ATS)', icon: Briefcase, badge: candidates.length || null },
          { id: 'interviews', label: 'Interview Scheduler', icon: Calendar },
          { id: 'background-check', label: 'Background Verifier', icon: ShieldCheck },
        ],
      };
    }

    // 8. Performance
    if (['performance', 'okr-goals', 'appraisal-matrix', 'competencies', 'peer-rewards', 'pulse-surveys', 'succession-bench'].includes(activeSubTab)) {
      return {
        title: 'Workforce Performance & Goal Frameworks',
        category: 'Performance',
        tabs: [
          { id: 'okr-goals', label: 'OKR Goal Tracker', icon: Target },
          { id: 'appraisal-matrix', label: '9-Box Reviews', icon: BarChart3 },
          { id: 'competencies', label: 'Competency Matrix', icon: Award },
          { id: 'peer-rewards', label: 'Peer Kudos Wall', icon: Trophy },
          { id: 'pulse-surveys', label: 'Sentiment Pulse', icon: Smile },
          { id: 'succession-bench', label: 'Succession Planning', icon: TrendingUp },
        ],
      };
    }

    // 9. Training
    if (['training', 'lms'].includes(activeSubTab)) {
      return {
        title: 'Learning Management System (LMS)',
        category: 'Training',
        tabs: [
          { id: 'lms', label: 'Course Catalog & Certifications', icon: BookOpen },
        ],
      };
    }

    // 10. Documents
    if (['documents', 'document-vault', 'asset-ledger'].includes(activeSubTab)) {
      return {
        title: 'Corporate Document Vault & Assets',
        category: 'Documents',
        tabs: [
          { id: 'document-vault', label: 'Document Vault', icon: FolderLock },
          { id: 'asset-ledger', label: 'Company Asset Ledger', icon: Laptop },
        ],
      };
    }

    // 11. Reports
    if (['reports', 'analytics'].includes(activeSubTab)) {
      return {
        title: 'Executive Workforce Intelligence & Reports',
        category: 'Reports',
        tabs: [
          { id: 'analytics', label: 'Workforce Analytics', icon: BarChart3 },
        ],
      };
    }

    // 12. User management
    if (['user-management', 'rbac', 'api-gateway'].includes(activeSubTab)) {
      return {
        title: 'Role Permissions & Access Control',
        category: 'User management',
        tabs: [
          { id: 'rbac', label: 'RBAC Permission Matrix', icon: ShieldCheck },
          { id: 'api-gateway', label: 'API Keys & Webhooks', icon: Key },
        ],
      };
    }

    // 13. Settings
    return {
      title: 'Enterprise Settings & Preferences',
      category: 'Settings',
      tabs: [
        { id: 'company-profile', label: 'Company Profile & Geofence', icon: Building2 },
        { id: 'api-gateway', label: 'Developer API Gateway', icon: Key },
        { id: 'workflow-builder', label: 'Workflow Automations', icon: GitBranch },
      ],
    };
  };

  const currentGroup = getModuleGroup();

  return (
    <div className="mb-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Category Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-[#0F766E] font-bold">{currentGroup.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold truncate">{currentGroup.title}</span>
        </div>
      </div>

      {/* Horizontal Scrollable Tabs Bar */}
      <div className="px-3 sm:px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none scroll-smooth">
        {currentGroup.tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeSubTab === tab.id ||
            (tab.id === 'dashboard' && activeSubTab === 'dashboard') ||
            (tab.id === 'employees' && activeSubTab === 'employees') ||
            (tab.id === 'org-chart' && activeSubTab === 'organization') ||
            (tab.id === 'attendance-overview' && activeSubTab === 'attendance') ||
            (tab.id === 'leave-tracker' && activeSubTab === 'leave-management') ||
            (tab.id === 'payroll-engine' && activeSubTab === 'payroll') ||
            (tab.id === 'ats' && activeSubTab === 'recruitment') ||
            (tab.id === 'okr-goals' && activeSubTab === 'performance') ||
            (tab.id === 'lms' && activeSubTab === 'training') ||
            (tab.id === 'document-vault' && activeSubTab === 'documents') ||
            (tab.id === 'analytics' && activeSubTab === 'reports') ||
            (tab.id === 'rbac' && activeSubTab === 'user-management') ||
            (tab.id === 'company-profile' && activeSubTab === 'settings');

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#CCFBF1] text-[#0F766E] font-bold shadow-2xs border border-teal-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isActive ? 'text-[#0F766E]' : 'text-slate-400'
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#0F766E] text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
