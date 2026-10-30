import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Company,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  TimesheetEntry,
  ShiftRoster,
  Holiday,
  PayrollRun,
  ExpenseClaim,
  BenefitPlan,
  Candidate,
  InterviewSession,
  OnboardingTask,
  BackgroundCheck,
  OffboardingRecord,
  GoalOKR,
  AppraisalReview,
  LMSCourse,
  CompetencyItem,
  SuccessionPlan,
  PulseSurveyResponse,
  PeerKudo,
  CompanyAsset,
  DocumentItem,
  WorkflowRule,
  ApiKeyIntegration,
  UserSession,
  UserRole,
  Announcement,
  PayslipTemplate
} from '../types';
import {
  initialCompany,
  initialEmployees,
  initialSessions,
  initialAnnouncements,
  defaultPayslipTemplate,
  initialAttendanceRecords,
  initialLeaveRequests,
  initialTimesheets,
  initialShiftRosters,
  initialHolidays,
  initialPayrollRuns,
  initialExpenseClaims,
  initialBenefitPlans,
  initialCandidates,
  initialInterviews,
  initialOnboardingTasks,
  initialBackgroundChecks,
  initialOffboardingRecords,
  initialGoalsOKR,
  initialAppraisals,
  initialCourses,
  initialCompetencies,
  initialSuccessionPlans,
  initialPulseSurvey,
  initialPeerKudos,
  initialCompanyAssets,
  initialDocuments,
  initialWorkflows,
  initialApiKeys,
} from '../data/initialData';

// Haversine formula to compute distance in meters between two lat/lng coords
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: { label: string; actionKey: string; payload?: any }[];
}

export interface HRContextType {
  // Setup & Auth
  isSetupComplete: boolean;
  completeInitialSetup: (
    companyData: Partial<Company>,
    adminData: { name: string; email: string; password?: string; designation?: string; avatar?: string }
  ) => void;
  currentUser: UserSession | null;
  activeRole: UserRole;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  loginUser: (email: string, password?: string, role?: UserRole) => { success: boolean; message: string };
  logoutUser: () => void;
  registerUser: (userData: Partial<UserSession> & { companyName?: string }) => void;
  allSessions: UserSession[];
  resetEntireSystem: () => void;

  // Company
  company: Company;
  updateCompany: (updates: Partial<Company>) => void;

  // Employees & Credentials
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'employeeCode'> & { password?: string }) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  selectedEmployeeDetail: Employee | null;
  setSelectedEmployeeDetail: (emp: Employee | null) => void;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'publishDate'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  // Payslip Customization & Template
  payslipTemplate: PayslipTemplate;
  updatePayslipTemplate: (updates: Partial<PayslipTemplate>) => void;
  resetPayslipTemplate: () => void;
  importPayslipTemplate: (jsonString: string) => boolean;

  // Attendance & Punch
  attendanceRecords: AttendanceRecord[];
  isPunchedIn: boolean;
  currentAttendanceRecord: AttendanceRecord | null;
  punchIn: (photoDataUrl: string, coords?: { latitude: number; longitude: number; accuracy?: number }) => { success: boolean; message: string };
  punchOut: (photoDataUrl: string) => { success: boolean; message: string };
  userLocation: { latitude: number; longitude: number; distanceMeters: number; isWithinGeofence: boolean } | null;
  refreshLocation: () => Promise<void>;

  // Leaves & Applications
  leaveRequests: LeaveRequest[];
  applyLeave: (request: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn' | 'employeeId' | 'employeeName' | 'employeeAvatar' | 'department'>) => void;
  updateLeaveStatus: (leaveId: string, status: 'Approved' | 'Rejected', reason?: string) => void;

  // Timesheets
  timesheets: TimesheetEntry[];
  addTimesheet: (entry: Omit<TimesheetEntry, 'id' | 'status' | 'totalHours'>) => void;
  updateTimesheetStatus: (id: string, status: 'Approved' | 'Rejected') => void;

  // Shifts & Holidays
  shiftRosters: ShiftRoster[];
  updateShift: (rosterId: string, day: keyof ShiftRoster['shifts'], shiftValue: string) => void;
  holidays: Holiday[];
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;

  // Payroll & Expenses
  payrollRuns: PayrollRun[];
  processPayrollRun: () => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  currencyRates: Record<string, number>;
  expenseClaims: ExpenseClaim[];
  addExpenseClaim: (claim: Omit<ExpenseClaim, 'id' | 'status' | 'employeeId' | 'employeeName'>) => void;
  updateExpenseStatus: (id: string, status: 'Approved' | 'Rejected' | 'Reimbursed') => void;
  benefitPlans: BenefitPlan[];
  toggleBenefitEnrollment: (planId: string) => void;

  // Talent & ATS
  candidates: Candidate[];
  updateCandidateStage: (candidateId: string, stage: Candidate['stage']) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'appliedDate'>) => void;
  interviews: InterviewSession[];
  scheduleInterview: (interview: Omit<InterviewSession, 'id' | 'status'>) => void;
  onboardingTasks: OnboardingTask[];
  toggleOnboardingTask: (taskId: string) => void;
  backgroundChecks: BackgroundCheck[];
  offboardingRecords: OffboardingRecord[];
  updateOffboardingStatus: (id: string, updates: Partial<OffboardingRecord>) => void;

  // Performance & Culture
  goalsOKR: GoalOKR[];
  addGoalOKR: (goal: Omit<GoalOKR, 'id'>) => void;
  updateGoalProgress: (goalId: string, newProgress: number) => void;
  appraisals: AppraisalReview[];
  addAppraisal: (review: Omit<AppraisalReview, 'id'>) => void;
  courses: LMSCourse[];
  toggleCourseEnrollment: (courseId: string) => void;
  updateCourseProgress: (courseId: string, percent: number) => void;
  competencies: CompetencyItem[];
  successionPlans: SuccessionPlan[];
  addSuccessionPlan: (plan: Omit<SuccessionPlan, 'id'>) => void;
  pulseSurvey: PulseSurveyResponse;
  votePulseSurvey: (optionLabel: string) => void;
  peerKudos: PeerKudo[];
  sendPeerKudo: (toEmployeeId: string, badge: PeerKudo['badge'], message: string, points: number) => void;
  likePeerKudo: (kudoId: string) => void;

  // Assets, Documents & Automation
  companyAssets: CompanyAsset[];
  addAsset: (asset: Omit<CompanyAsset, 'id'>) => void;
  assignAsset: (assetId: string, employeeId: string) => void;
  returnAsset: (assetId: string) => void;
  documents: DocumentItem[];
  uploadDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedDate'>) => void;
  workflows: WorkflowRule[];
  toggleWorkflow: (id: string) => void;
  apiKeys: ApiKeyIntegration[];

  // Smart Helper Assistant
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  assistantMessages: AssistantMessage[];
  sendAssistantQuery: (text: string) => void;
  clearAssistantChat: () => void;
  executeAssistantAction: (actionKey: string, payload?: any) => void;

  // Camera Punch Modal
  isPunchModalOpen: boolean;
  setIsPunchModalOpen: (open: boolean) => void;

  // Global Active Navigation state
  activeModule: 'core' | 'attendance' | 'payroll' | 'talent' | 'performance' | 'settings' | 'employee';
  setActiveModule: (module: 'core' | 'attendance' | 'payroll' | 'talent' | 'performance' | 'settings' | 'employee') => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

// Storage helper functions
const getStored = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err);
  }
};

export const HRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if setup was previously completed
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(() => {
    return getStored<boolean>('hrmate_setup_complete_v2', true);
  });

  // Company state
  const [company, setCompany] = useState<Company>(() => {
    return getStored<Company>('hrmate_company_v2', initialCompany);
  });

  // User Sessions & Current User
  const [allSessions, setAllSessions] = useState<UserSession[]>(() => {
    return getStored<UserSession[]>('hrmate_sessions_v2', initialSessions);
  });

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const stored = getStored<UserSession | null>('hrmate_current_user_v2', null);
    if (stored) return stored;
    return initialSessions[0] || null;
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser?.role || 'admin';
  });

  // Navigation state
  const [activeModule, setActiveModule] = useState<'core' | 'attendance' | 'payroll' | 'talent' | 'performance' | 'settings' | 'employee'>('core');
  const [activeSubTab, setActiveSubTab] = useState<string>(activeRole === 'admin' ? 'dashboard' : 'employee-ess');

  // Modals & Details
  const [selectedEmployeeDetail, setSelectedEmployeeDetail] = useState<Employee | null>(null);
  const [isPunchModalOpen, setIsPunchModalOpen] = useState(false);

  // Employees
  const [employees, setEmployees] = useState<Employee[]>(() => {
    return getStored<Employee[]>('hrmate_employees_v2', initialEmployees);
  });

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    return getStored<Announcement[]>('hrmate_announcements_v2', initialAnnouncements);
  });

  // Payslip Template
  const [payslipTemplate, setPayslipTemplate] = useState<PayslipTemplate>(() => {
    return getStored<PayslipTemplate>('hrmate_payslip_template_v2', defaultPayslipTemplate);
  });

  // Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    return getStored<AttendanceRecord[]>('hrmate_attendance_v2', initialAttendanceRecords);
  });

  // Leave Requests (Employee applications)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    return getStored<LeaveRequest[]>('hrmate_leaves_v2', initialLeaveRequests);
  });

  // Timesheets
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(() => {
    return getStored<TimesheetEntry[]>('hrmate_timesheets_v2', initialTimesheets);
  });

  // Shift Rosters
  const [shiftRosters, setShiftRosters] = useState<ShiftRoster[]>(() => {
    return getStored<ShiftRoster[]>('hrmate_shifts_v2', initialShiftRosters);
  });

  // Holidays
  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    return getStored<Holiday[]>('hrmate_holidays_v2', initialHolidays);
  });

  // Payroll Runs
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(() => {
    return getStored<PayrollRun[]>('hrmate_payroll_runs_v2', initialPayrollRuns);
  });

  // Expense Claims
  const [expenseClaims, setExpenseClaims] = useState<ExpenseClaim[]>(() => {
    return getStored<ExpenseClaim[]>('hrmate_expenses_v2', initialExpenseClaims);
  });

  // Other entities
  const [benefitPlans, setBenefitPlans] = useState<BenefitPlan[]>(initialBenefitPlans);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [interviews, setInterviews] = useState<InterviewSession[]>(initialInterviews);
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(initialOnboardingTasks);
  const [backgroundChecks] = useState<BackgroundCheck[]>(initialBackgroundChecks);
  const [offboardingRecords, setOffboardingRecords] = useState<OffboardingRecord[]>(initialOffboardingRecords);
  const [goalsOKR, setGoalsOKR] = useState<GoalOKR[]>(initialGoalsOKR);
  const [appraisals, setAppraisals] = useState<AppraisalReview[]>(initialAppraisals);
  const [courses, setCourses] = useState<LMSCourse[]>(initialCourses);
  const [competencies] = useState<CompetencyItem[]>(initialCompetencies);
  const [successionPlans, setSuccessionPlans] = useState<SuccessionPlan[]>(initialSuccessionPlans);
  const [pulseSurvey, setPulseSurvey] = useState<PulseSurveyResponse>(initialPulseSurvey);
  const [peerKudos, setPeerKudos] = useState<PeerKudo[]>(initialPeerKudos);
  const [companyAssets, setCompanyAssets] = useState<CompanyAsset[]>(initialCompanyAssets);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>(initialWorkflows);
  const [apiKeys] = useState<ApiKeyIntegration[]>(initialApiKeys);

  // Sync to localStorage
  useEffect(() => {
    setStored('hrmate_setup_complete_v2', isSetupComplete);
  }, [isSetupComplete]);

  useEffect(() => {
    setStored('hrmate_company_v2', company);
  }, [company]);

  useEffect(() => {
    setStored('hrmate_sessions_v2', allSessions);
  }, [allSessions]);

  useEffect(() => {
    setStored('hrmate_current_user_v2', currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStored('hrmate_employees_v2', employees);
  }, [employees]);

  useEffect(() => {
    setStored('hrmate_announcements_v2', announcements);
  }, [announcements]);

  useEffect(() => {
    setStored('hrmate_payslip_template_v2', payslipTemplate);
  }, [payslipTemplate]);

  useEffect(() => {
    setStored('hrmate_attendance_v2', attendanceRecords);
  }, [attendanceRecords]);

  useEffect(() => {
    setStored('hrmate_leaves_v2', leaveRequests);
  }, [leaveRequests]);

  useEffect(() => {
    setStored('hrmate_expenses_v2', expenseClaims);
  }, [expenseClaims]);

  useEffect(() => {
    setStored('hrmate_payroll_runs_v2', payrollRuns);
  }, [payrollRuns]);

  // Currency
  const [selectedCurrency, setSelectedCurrency] = useState<string>(company.currency || 'USD');
  const currencyRates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.77,
    JPY: 153.4,
    INR: 84.1,
    AED: 3.67,
    CAD: 1.38,
    AUD: 1.51,
  };

  // Location Geofence state
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    distanceMeters: number;
    isWithinGeofence: boolean;
  } | null>(null);

  // Check geofence
  const refreshLocation = async () => {
    if (!navigator.geolocation) {
      setUserLocation({
        latitude: company.hqLocation.latitude,
        longitude: company.hqLocation.longitude,
        distanceMeters: 15,
        isWithinGeofence: true,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = calculateDistanceMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          company.hqLocation.latitude,
          company.hqLocation.longitude
        );
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          distanceMeters: dist,
          isWithinGeofence: dist <= company.hqLocation.radiusMeters,
        });
      },
      (err) => {
        console.warn('Geolocation unavailable, defaulting to HQ coordinates:', err.message);
        setUserLocation({
          latitude: company.hqLocation.latitude,
          longitude: company.hqLocation.longitude,
          distanceMeters: 24,
          isWithinGeofence: true,
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    refreshLocation();
  }, [company]);

  // Current user's attendance for today
  const todayStr = new Date().toISOString().split('T')[0];
  const currentAttendanceRecord =
    attendanceRecords.find(
      (rec) => rec.employeeId === (currentUser?.employeeId || currentUser?.id || 'emp_01') && rec.date === todayStr
    ) || null;

  const isPunchedIn = Boolean(currentAttendanceRecord && !currentAttendanceRecord.punchOutTime);

  // Punch actions
  const punchIn = (photoDataUrl: string, coords?: { latitude: number; longitude: number; accuracy?: number }) => {
    const empId = currentUser?.employeeId || currentUser?.id || 'emp_01';
    const emp = employees.find((e) => e.id === empId);
    const empName = emp ? `${emp.firstName} ${emp.lastName}` : (currentUser?.name || 'Staff Member');
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let withinFence = true;
    let dist = 20;
    if (coords) {
      dist = calculateDistanceMeters(coords.latitude, coords.longitude, company.hqLocation.latitude, company.hqLocation.longitude);
      withinFence = dist <= company.hqLocation.radiusMeters;
    }

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      employeeId: empId,
      employeeName: empName,
      date: todayStr,
      punchInTime: timeStr,
      punchInPhoto: photoDataUrl,
      coordinates: coords,
      isWithinGeofence: withinFence,
      locationLabel: withinFence ? `Office HQ (${dist}m from center)` : `Remote (${(dist / 1000).toFixed(1)}km away)`,
      status: now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15) ? 'Late' : 'On Time',
      notes: 'Live Camera & Geofence Verified',
    };

    setAttendanceRecords((prev) => [newRecord, ...prev.filter((r) => !(r.employeeId === empId && r.date === todayStr))]);
    return { success: true, message: `Successfully punched in at ${timeStr}` };
  };

  const punchOut = (photoDataUrl: string) => {
    const empId = currentUser?.employeeId || currentUser?.id || 'emp_01';
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendanceRecords((prev) =>
      prev.map((r) => {
        if (r.employeeId === empId && r.date === todayStr) {
          return {
            ...r,
            punchOutTime: timeStr,
            punchOutPhoto: photoDataUrl,
            workHours: 8.0,
          };
        }
        return r;
      })
    );
    return { success: true, message: `Successfully punched out at ${timeStr}` };
  };

  // Complete Initial Onboarding Setup
  const completeInitialSetup = (
    companyData: Partial<Company>,
    adminData: { name: string; email: string; password?: string; designation?: string; avatar?: string }
  ) => {
    const compId = `comp_${Date.now()}`;
    const newCompany: Company = {
      id: compId,
      name: companyData.name || 'Acme Global Enterprises',
      logo: companyData.logo || 'HRMate',
      industry: companyData.industry || 'Technology & Innovation',
      currency: companyData.currency || 'USD',
      timezone: companyData.timezone || 'America/New_York (EST)',
      hqLocation: companyData.hqLocation || {
        name: 'Corporate Headquarters',
        latitude: 37.7749,
        longitude: -122.4194,
        radiusMeters: 250,
      },
    };

    const adminSessionId = `admin_${Date.now()}`;
    const adminSession: UserSession = {
      id: adminSessionId,
      name: adminData.name,
      email: adminData.email.toLowerCase().trim(),
      role: 'admin',
      avatar:
        adminData.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      companyId: compId,
      designation: adminData.designation || 'Master Administrator',
      department: 'Executive Management',
      password: adminData.password || 'admin123',
    };

    const initialWelcomeAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title: `Welcome to ${newCompany.name} Enterprise HRMS`,
      content: `Welcome to our unified People Operations & Attendance Platform. From here, employees can complete biometric check-ins, request time off, and access authenticated payslips. Administrators can onboard employees, review applications, and broadcast organization-wide updates.`,
      category: 'General',
      priority: 'high',
      authorName: adminData.name,
      publishDate: todayStr,
      departmentTarget: 'All',
      pinned: true,
    };

    setCompany(newCompany);
    setAllSessions([adminSession]);
    setCurrentUser(adminSession);
    setActiveRole('admin');
    setAnnouncements([initialWelcomeAnnouncement]);
    setIsSetupComplete(true);
    setActiveModule('core');
    setActiveSubTab('dashboard');

    setStored('hrmate_company_v2', newCompany);
    setStored('hrmate_sessions_v2', [adminSession]);
    setStored('hrmate_current_user_v2', adminSession);
    setStored('hrmate_announcements_v2', [initialWelcomeAnnouncement]);
    setStored('hrmate_setup_complete_v2', true);
  };

  // Auth methods
  const switchUser = (userId: string) => {
    const session = allSessions.find((s) => s.id === userId);
    if (session) {
      setCurrentUser(session);
      setActiveRole(session.role);
      setActiveSubTab(session.role === 'admin' ? 'dashboard' : 'employee-ess');
    }
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
    }
    setActiveSubTab(role === 'admin' ? 'dashboard' : 'employee-ess');
  };

  // User Login (Validates against admin credentials or employee database)
  const loginUser = (email: string, password?: string, preferredRole?: UserRole): { success: boolean; message: string } => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPass = password?.trim();

    // 1. Check if user is an existing registered Admin
    const adminSession = allSessions.find(
      (s) => s.email.toLowerCase() === cleanEmail && (s.role === 'admin' || s.role === 'company_owner')
    );

    if (preferredRole === 'admin' || (!preferredRole && adminSession)) {
      if (!adminSession) {
        return { success: false, message: 'No administrator account found with this email address.' };
      }
      if (adminSession.password && cleanPass && adminSession.password !== cleanPass) {
        return { success: false, message: 'Invalid administrator password. Please check your credentials.' };
      }
      setCurrentUser(adminSession);
      setActiveRole('admin');
      setActiveModule('core');
      setActiveSubTab('dashboard');
      return { success: true, message: `Welcome back, Administrator ${adminSession.name}!` };
    }

    // 2. Check if user is an employee in the system (created by Admin)
    const emp = employees.find((e) => e.email.toLowerCase() === cleanEmail);
    if (!emp) {
      // Check allSessions for employee
      const empSession = allSessions.find((s) => s.email.toLowerCase() === cleanEmail && s.role === 'employee');
      if (empSession) {
        if (empSession.password && cleanPass && empSession.password !== cleanPass) {
          return { success: false, message: 'Incorrect employee password. Please check credentials provided by Admin.' };
        }
        setCurrentUser(empSession);
        setActiveRole('employee');
        setActiveModule('core');
        setActiveSubTab('employee-ess');
        return { success: true, message: `Welcome back, ${empSession.name}!` };
      }
      return {
        success: false,
        message: 'No employee record found for this email. Please ask your company administrator to onboard you.',
      };
    }

    // Check employee password
    if (emp.password && cleanPass && emp.password !== cleanPass) {
      return { success: false, message: 'Incorrect password. Please enter the password given to you by your Administrator.' };
    }

    // Find or create session for this employee
    let session = allSessions.find((s) => s.employeeId === emp.id || s.email.toLowerCase() === cleanEmail);
    if (!session) {
      session = {
        id: `user_emp_${emp.id}`,
        name: `${emp.firstName} ${emp.lastName}`,
        email: emp.email,
        role: 'employee',
        avatar: emp.avatar,
        companyId: company.id,
        department: emp.department,
        designation: emp.designation,
        employeeId: emp.id,
        password: emp.password,
      };
      setAllSessions((prev) => [...prev, session!]);
    } else {
      // Sync latest employee name and avatar in session
      session = {
        ...session,
        name: `${emp.firstName} ${emp.lastName}`,
        avatar: emp.avatar,
        department: emp.department,
        designation: emp.designation,
        password: emp.password || session.password,
      };
      setAllSessions((prev) => prev.map((s) => (s.id === session!.id ? session! : s)));
    }

    setCurrentUser(session);
    setActiveRole('employee');
    setActiveModule('core');
    setActiveSubTab('employee-ess');
    return { success: true, message: `Welcome to ${company.name}, ${emp.firstName}!` };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('hrmate_current_user_v2');
  };

  const registerUser = (userData: Partial<UserSession> & { companyName?: string }) => {
    if (userData.companyName) {
      setCompany((prev) => ({ ...prev, name: userData.companyName! }));
    }
    const newSession: UserSession = {
      id: `user_${Date.now()}`,
      name: userData.name || 'New Member',
      email: userData.email || 'user@example.com',
      role: userData.role || 'employee',
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      companyId: company.id,
      department: userData.department || 'Operations',
      designation: userData.designation || 'Specialist',
      password: userData.password,
    };
    setAllSessions((prev) => [...prev, newSession]);
    setCurrentUser(newSession);
    setActiveRole(newSession.role);
  };

  const updateCompany = (updates: Partial<Company>) => {
    setCompany((prev) => ({ ...prev, ...updates }));
  };

  // Reset entire system to first-time setup
  const resetEntireSystem = () => {
    localStorage.clear();
    setCompany(initialCompany);
    setAllSessions([]);
    setCurrentUser(null);
    setEmployees([]);
    setAnnouncements([]);
    setAttendanceRecords([]);
    setLeaveRequests([]);
    setTimesheets([]);
    setPayrollRuns([]);
    setExpenseClaims([]);
    setIsSetupComplete(false);
  };

  // Employee CRUD with automatic credential generation and live sync
  const addEmployee = (empData: Omit<Employee, 'id' | 'employeeCode'> & { password?: string }): Employee => {
    const nextCodeNum = 1000 + employees.length + 1;
    const empId = `emp_${Date.now()}`;
    const cleanPassword = empData.password?.trim() || 'Welcome@123';

    const newEmp: Employee = {
      ...empData,
      id: empId,
      employeeCode: `EMP-${nextCodeNum}`,
      password: cleanPassword,
      bankDetails: empData.bankDetails || {
        bankName: 'Standard Chartered Bank',
        accountNumber: `•••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
        ifscOrRouting: 'SCBL0001290',
        branch: 'Corporate Finance Hub',
      },
    };

    // Also automatically create their login UserSession
    const empSession: UserSession = {
      id: `session_${empId}`,
      name: `${newEmp.firstName} ${newEmp.lastName}`,
      email: newEmp.email.toLowerCase().trim(),
      role: 'employee',
      avatar: newEmp.avatar,
      companyId: company.id,
      department: newEmp.department,
      designation: newEmp.designation,
      employeeId: empId,
      password: cleanPassword,
    };

    // Auto-generate an initial payslip run voucher for this employee
    const initialRun: PayrollRun = {
      id: `run_${empId}`,
      period: 'October 2026',
      employeeId: empId,
      employeeName: `${newEmp.firstName} ${newEmp.lastName}`,
      department: newEmp.department,
      designation: newEmp.designation,
      basicSalary: newEmp.salary.baseMonthly,
      hra: newEmp.salary.hra,
      allowances: newEmp.salary.specialAllowance,
      statutoryTax: Math.round(newEmp.salary.baseMonthly * 0.12),
      providentFund: Math.round(newEmp.salary.baseMonthly * 0.05),
      benefitsDeduction: 120,
      reimbursements: 0,
      grossSalary: newEmp.salary.baseMonthly + newEmp.salary.hra + newEmp.salary.specialAllowance,
      netPayable:
        newEmp.salary.baseMonthly +
        newEmp.salary.hra +
        newEmp.salary.specialAllowance -
        (Math.round(newEmp.salary.baseMonthly * 0.12) + Math.round(newEmp.salary.baseMonthly * 0.05) + 120),
      paymentStatus: 'Paid',
      disbursedDate: todayStr,
      bankAccount: newEmp.bankDetails?.accountNumber || '•••• •••• 4092',
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setAllSessions((prev) => [...prev, empSession]);
    setPayrollRuns((prev) => [initialRun, ...prev]);

    return newEmp;
  };

  // Update employee (Crucial: syncs changes both ways! If employee updates profile, Admin data changes; if admin updates employee, employee session reflects it)
  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const updated = { ...e, ...updates };
          return updated;
        }
        return e;
      })
    );

    // If selected employee is currently open in drawer/modal, sync it
    if (selectedEmployeeDetail && selectedEmployeeDetail.id === id) {
      setSelectedEmployeeDetail((prev) => (prev ? { ...prev, ...updates } : null));
    }

    // Sync UserSession and currentUser if it matches this employee
    setAllSessions((prev) =>
      prev.map((s) => {
        if (s.employeeId === id || (updates.email && s.email.toLowerCase() === updates.email.toLowerCase())) {
          return {
            ...s,
            name:
              updates.firstName && updates.lastName
                ? `${updates.firstName} ${updates.lastName}`
                : updates.firstName
                ? `${updates.firstName} ${s.name.split(' ')[1] || ''}`
                : s.name,
            email: updates.email || s.email,
            avatar: updates.avatar || s.avatar,
            department: updates.department || s.department,
            designation: updates.designation || s.designation,
            password: updates.password !== undefined ? updates.password : s.password,
          };
        }
        return s;
      })
    );

    if (currentUser && (currentUser.employeeId === id || (updates.email && currentUser.email.toLowerCase() === updates.email.toLowerCase()))) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          name:
            updates.firstName && updates.lastName
              ? `${updates.firstName} ${updates.lastName}`
              : updates.firstName
              ? `${updates.firstName} ${prev.name.split(' ')[1] || ''}`
              : prev.name,
          email: updates.email || prev.email,
          avatar: updates.avatar || prev.avatar,
          department: updates.department || prev.department,
          designation: updates.designation || prev.designation,
          password: updates.password !== undefined ? updates.password : prev.password,
        };
      });
    }

    // Sync employee names in payroll runs, attendance records, and leave requests
    if (updates.firstName || updates.lastName || updates.department || updates.designation) {
      const emp = employees.find((e) => e.id === id);
      const newFullName = `${updates.firstName || emp?.firstName || ''} ${updates.lastName || emp?.lastName || ''}`.trim();

      setLeaveRequests((prev) =>
        prev.map((l) =>
          l.employeeId === id
            ? {
                ...l,
                employeeName: newFullName || l.employeeName,
                employeeAvatar: updates.avatar || l.employeeAvatar,
                department: updates.department || l.department,
              }
            : l
        )
      );

      setAttendanceRecords((prev) =>
        prev.map((a) => (a.employeeId === id ? { ...a, employeeName: newFullName || a.employeeName } : a))
      );

      setPayrollRuns((prev) =>
        prev.map((p) =>
          p.employeeId === id
            ? {
                ...p,
                employeeName: newFullName || p.employeeName,
                department: updates.department || p.department,
                designation: updates.designation || p.designation,
                basicSalary: updates.salary?.baseMonthly ?? p.basicSalary,
                hra: updates.salary?.hra ?? p.hra,
                allowances: updates.salary?.specialAllowance ?? p.allowances,
                bankAccount: updates.bankDetails?.accountNumber ?? p.bankAccount,
              }
            : p
        )
      );
    }
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setAllSessions((prev) => prev.filter((s) => s.employeeId !== id));
    if (selectedEmployeeDetail?.id === id) {
      setSelectedEmployeeDetail(null);
    }
    if (currentUser?.employeeId === id) {
      logoutUser();
    }
  };

  // Announcements CRUD
  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'publishDate'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann_${Date.now()}`,
      publishDate: todayStr,
      authorName: currentUser?.name || 'Administrator',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Payslip Template Customization
  const updatePayslipTemplate = (updates: Partial<PayslipTemplate>) => {
    setPayslipTemplate((prev) => ({ ...prev, ...updates }));
  };

  const resetPayslipTemplate = () => {
    setPayslipTemplate(defaultPayslipTemplate);
  };

  const importPayslipTemplate = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed.headerTitle) {
        setPayslipTemplate((prev) => ({ ...prev, ...parsed }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Leave Actions
  const applyLeave = (requestData: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn' | 'employeeId' | 'employeeName' | 'employeeAvatar' | 'department'>) => {
    const emp = employees.find((e) => e.id === currentUser?.employeeId) || employees[0];
    const newLeave: LeaveRequest = {
      ...requestData,
      id: `leave_${Date.now()}`,
      employeeId: emp ? emp.id : (currentUser?.id || 'emp_01'),
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : (currentUser?.name || 'Staff Member'),
      employeeAvatar: emp ? emp.avatar : (currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
      department: emp ? emp.department : (currentUser?.department || 'Operations'),
      status: 'Pending',
      appliedOn: todayStr,
    };
    setLeaveRequests((prev) => [newLeave, ...prev]);
  };

  const updateLeaveStatus = (leaveId: string, status: 'Approved' | 'Rejected', reason?: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => {
        if (l.id === leaveId) {
          if (status === 'Approved' && l.status !== 'Approved') {
            const leaveTypeKey = l.type.toLowerCase() as keyof Employee['leaveBalances'];
            setEmployees((empList) =>
              empList.map((e) => {
                if (e.id === l.employeeId && e.leaveBalances[leaveTypeKey] !== undefined) {
                  return {
                    ...e,
                    leaveBalances: {
                      ...e.leaveBalances,
                      [leaveTypeKey]: Math.max(0, e.leaveBalances[leaveTypeKey] - l.days),
                    },
                  };
                }
                return e;
              })
            );
          }
          return {
            ...l,
            status,
            approvedBy: status === 'Approved' ? (currentUser?.name || 'Administrator') : undefined,
            rejectionReason: reason,
          };
        }
        return l;
      })
    );
  };

  // Timesheets
  const addTimesheet = (entry: Omit<TimesheetEntry, 'id' | 'status' | 'totalHours'>) => {
    const total = Object.values(entry.dailyHours).reduce((a, b) => a + b, 0);
    const newTs: TimesheetEntry = {
      ...entry,
      id: `ts_${Date.now()}`,
      totalHours: total,
      status: 'Submitted',
    };
    setTimesheets((prev) => [newTs, ...prev]);
  };

  const updateTimesheetStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setTimesheets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  // Shifts & Holidays
  const updateShift = (rosterId: string, day: keyof ShiftRoster['shifts'], shiftValue: string) => {
    setShiftRosters((prev) =>
      prev.map((r) => (r.id === rosterId ? { ...r, shifts: { ...r.shifts, [day]: shiftValue } } : r))
    );
  };

  const addHoliday = (holiday: Omit<Holiday, 'id'>) => {
    setHolidays((prev) => [{ ...holiday, id: `hol_${Date.now()}` }, ...prev]);
  };

  // Payroll & Expenses
  const processPayrollRun = () => {
    const newRuns: PayrollRun[] = employees.map((emp) => {
      const basic = emp.salary.baseMonthly;
      const hra = emp.salary.hra;
      const allow = emp.salary.specialAllowance;
      const tax = Math.round(basic * 0.12);
      const pf = Math.round(basic * 0.05);
      const ben = 120;
      const gross = basic + hra + allow;
      const net = gross - (tax + pf + ben);

      return {
        id: `run_${emp.id}_${Date.now()}`,
        period: 'November 2026',
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        designation: emp.designation,
        basicSalary: basic,
        hra,
        allowances: allow,
        statutoryTax: tax,
        providentFund: pf,
        benefitsDeduction: ben,
        reimbursements: 0,
        grossSalary: gross,
        netPayable: net,
        paymentStatus: 'Paid',
        disbursedDate: todayStr,
        bankAccount: emp.bankDetails?.accountNumber || '•••• •••• 5590',
      };
    });

    setPayrollRuns(newRuns);
  };

  const addExpenseClaim = (claim: Omit<ExpenseClaim, 'id' | 'status' | 'employeeId' | 'employeeName'>) => {
    const emp = employees.find((e) => e.id === currentUser?.employeeId) || employees[0];
    const newClaim: ExpenseClaim = {
      ...claim,
      id: `exp_${Date.now()}`,
      employeeId: emp ? emp.id : (currentUser?.id || 'emp_01'),
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : (currentUser?.name || 'Staff Member'),
      status: 'Pending',
    };
    setExpenseClaims((prev) => [newClaim, ...prev]);
  };

  const updateExpenseStatus = (id: string, status: 'Approved' | 'Rejected' | 'Reimbursed') => {
    setExpenseClaims((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const toggleBenefitEnrollment = (planId: string) => {
    setBenefitPlans((prev) =>
      prev.map((b) => (b.id === planId ? { ...b, isEnrolled: !b.isEnrolled, enrolledCount: b.isEnrolled ? b.enrolledCount - 1 : b.enrolledCount + 1 } : b))
    );
  };

  // Talent & ATS
  const updateCandidateStage = (candidateId: string, stage: Candidate['stage']) => {
    setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, stage } : c)));
  };

  const addCandidate = (candidate: Omit<Candidate, 'id' | 'appliedDate'>) => {
    setCandidates((prev) => [{ ...candidate, id: `cand_${Date.now()}`, appliedDate: todayStr }, ...prev]);
  };

  const scheduleInterview = (interview: Omit<InterviewSession, 'id' | 'status'>) => {
    setInterviews((prev) => [{ ...interview, id: `int_${Date.now()}`, status: 'Scheduled' }, ...prev]);
  };

  const toggleOnboardingTask = (taskId: string) => {
    setOnboardingTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
  };

  const updateOffboardingStatus = (id: string, updates: Partial<OffboardingRecord>) => {
    setOffboardingRecords((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  // Performance & Culture
  const addGoalOKR = (goal: Omit<GoalOKR, 'id'>) => {
    setGoalsOKR((prev) => [{ ...goal, id: `okr_${Date.now()}` }, ...prev]);
  };

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    setGoalsOKR((prev) => prev.map((g) => (g.id === goalId ? { ...g, progress: newProgress } : g)));
  };

  const addAppraisal = (review: Omit<AppraisalReview, 'id'>) => {
    setAppraisals((prev) => [{ ...review, id: `appr_${Date.now()}` }, ...prev]);
  };

  const toggleCourseEnrollment = (courseId: string) => {
    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, isEnrolled: !c.isEnrolled } : c)));
  };

  const updateCourseProgress = (courseId: string, percent: number) => {
    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, progressPercent: percent } : c)));
  };

  const addSuccessionPlan = (plan: Omit<SuccessionPlan, 'id'>) => {
    setSuccessionPlans((prev) => [{ ...plan, id: `succ_${Date.now()}` }, ...prev]);
  };

  const votePulseSurvey = (optionLabel: string) => {
    setPulseSurvey((prev) => {
      const updatedOpts = prev.options.map((opt) => {
        if (opt.label === optionLabel) {
          return { ...opt, count: opt.count + 1 };
        }
        return opt;
      });
      const newTotal = prev.totalVotes + 1;
      const calculatedOpts = updatedOpts.map((o) => ({
        ...o,
        percentage: Math.round((o.count / newTotal) * 100),
      }));
      return {
        ...prev,
        totalVotes: newTotal,
        options: calculatedOpts,
        userVotedOption: optionLabel,
      };
    });
  };

  const sendPeerKudo = (toEmployeeId: string, badge: PeerKudo['badge'], message: string, points: number) => {
    const targetEmp = employees.find((e) => e.id === toEmployeeId);
    const newKudo: PeerKudo = {
      id: `kudo_${Date.now()}`,
      fromName: currentUser?.name || 'Colleague',
      fromAvatar:
        currentUser?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      toName: targetEmp ? `${targetEmp.firstName} ${targetEmp.lastName}` : 'Team Member',
      toAvatar: targetEmp?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge,
      message,
      points,
      timestamp: 'Just now',
      likes: 0,
      likesCount: 0,
      hasLiked: false,
    };
    setPeerKudos((prev) => [newKudo, ...prev]);
  };

  const likePeerKudo = (kudoId: string) => {
    setPeerKudos((prev) =>
      prev.map((k) =>
        k.id === kudoId
          ? {
              ...k,
              hasLiked: !k.hasLiked,
              likes: Math.max(0, (k.likes || 0) + (k.hasLiked ? -1 : 1)),
              likesCount: Math.max(0, ((k.likesCount ?? k.likes) || 0) + (k.hasLiked ? -1 : 1)),
            }
          : k
      )
    );
  };

  // Assets & Documents
  const addAsset = (asset: Omit<CompanyAsset, 'id'>) => {
    setCompanyAssets((prev) => [{ ...asset, id: `asset_${Date.now()}` }, ...prev]);
  };

  const assignAsset = (assetId: string, employeeId: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    setCompanyAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a,
              status: 'Allocated',
              assignedToId: employeeId,
              assignedToName: emp ? `${emp.firstName} ${emp.lastName}` : undefined,
            }
          : a
      )
    );
  };

  const returnAsset = (assetId: string) => {
    setCompanyAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a,
              status: 'In Stock',
              assignedToId: undefined,
              assignedToName: undefined,
            }
          : a
      )
    );
  };

  const uploadDocument = (doc: Omit<DocumentItem, 'id' | 'uploadedDate'>) => {
    setDocuments((prev) => [{ ...doc, id: `doc_${Date.now()}`, uploadedDate: todayStr }, ...prev]);
  };

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w)));
  };

  // Smart Assistant
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg_01',
      sender: 'assistant',
      text: `Hello! I am your HRMate Smart Assistant. You can ask me to summarize attendance, verify leave applications, analyze payroll, or check OKR completion rates.`,
      timestamp: '09:00 AM',
      quickActions: [
        { label: '📊 Summarize today\'s attendance', actionKey: 'SUMMARIZE_ATTENDANCE' },
        { label: '⏳ Check pending leave requests', actionKey: 'CHECK_LEAVES' },
        { label: '💰 View monthly payroll totals', actionKey: 'VIEW_PAYROLL' },
      ],
    },
  ]);

  const sendAssistantQuery = (queryText: string) => {
    const userMsg: AssistantMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAssistantMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const lower = queryText.toLowerCase();
      let reply = '';
      let actions: { label: string; actionKey: string; payload?: any }[] | undefined = undefined;

      // 1. EMPLOYEE SCOPED ASSISTANT RESPONSES
      if (activeRole === 'employee') {
        const empId = currentUser?.employeeId || currentUser?.id;
        const myEmp = employees.find((e) => e.id === empId) || employees.find((e) => e.email.toLowerCase() === currentUser?.email.toLowerCase());
        const myAttendance = attendanceRecords.filter((r) => r.employeeId === empId);
        const myTodayRecord = myAttendance.find((r) => r.date === todayStr);
        const myLeaves = leaveRequests.filter((l) => l.employeeId === empId);
        const myPendingLeaves = myLeaves.filter((l) => l.status === 'Pending').length;
        const myPayslips = payrollRuns.filter((p) => p.employeeId === empId);

        // Security Guard: Check if employee is querying company-wide or other employee info
        const isAskingForEnterpriseData =
          lower.includes('all employee') ||
          lower.includes('other employee') ||
          lower.includes('company payroll') ||
          lower.includes('system summary') ||
          lower.includes('executive summary') ||
          lower.includes('total headcount') ||
          lower.includes('salary of') ||
          lower.includes('admin');

        if (isAskingForEnterpriseData) {
          reply = `🔒 Restricted Access:\nAs an employee, you only have permission to view and summarize your personal portal data (your attendance punches, leave balances, official payslips, and personal profile). Company-wide executive data is reserved for administrators.`;
          actions = [
            { label: 'Summarize My Attendance', actionKey: 'SUMMARIZE_MY_ATTENDANCE' },
            { label: 'Check My Leave Balances', actionKey: 'CHECK_MY_LEAVES' },
            { label: 'View My Latest Payslip', actionKey: 'VIEW_MY_PAYSLIP' },
          ];
        } else if (lower.includes('attendance') || lower.includes('punch') || lower.includes('checkin') || lower.includes('clock') || lower.includes('hour')) {
          reply = `📋 Your Personal Attendance Summary:\n• Status Today (${todayStr}): ${
            isPunchedIn || myTodayRecord
              ? `Clocked in at ${myTodayRecord?.punchInTime || '09:00 AM'} (Geofence Verified)`
              : 'Not checked in yet today'
          }\n• Total Verified Punches: ${myAttendance.length} records logged.\n• Working Shift: 09:00 AM - 05:00 PM EST.`;
          actions = [
            { label: isPunchedIn ? 'Clock Out Camera' : 'Camera Punch In', actionKey: 'OPEN_PUNCH_MODAL' },
            { label: 'View My Attendance History', actionKey: 'NAV_MY_ATTENDANCE' },
          ];
        } else if (lower.includes('leave') || lower.includes('vacation') || lower.includes('pto') || lower.includes('balance') || lower.includes('off')) {
          const annual = myEmp?.leaveBalances?.annual ?? 0;
          const sick = myEmp?.leaveBalances?.sick ?? 0;
          const casual = myEmp?.leaveBalances?.casual ?? 0;
          reply = `🏖️ Your Time-Off & Leave Balances:\n• Annual Leave Available: ${annual} days\n• Sick Leave Available: ${sick} days\n• Casual Leave Available: ${casual} days\n• Your Pending Applications: ${myPendingLeaves} request${myPendingLeaves === 1 ? '' : 's'}.`;
          actions = [
            { label: 'Submit Leave Request', actionKey: 'NAV_APPLY_LEAVE' },
            { label: 'View My Leave Applications', actionKey: 'NAV_MY_LEAVES' },
          ];
        } else if (lower.includes('payroll') || lower.includes('salary') || lower.includes('payslip') || lower.includes('wage') || lower.includes('pay')) {
          if (myPayslips.length > 0) {
            const latest = myPayslips[myPayslips.length - 1];
            reply = `💰 Your Official Payslip Summary:\n• Latest Period: ${latest.period}\n• Gross Earnings: $${latest.grossSalary.toLocaleString()} ${selectedCurrency}\n• Net Take-Home: $${(latest.netSalary ?? latest.netPayable).toLocaleString()} ${selectedCurrency}\n• Disbursement Status: ${latest.paymentStatus.toUpperCase()}`;
          } else if (myEmp?.salary) {
            reply = `💰 Your Compensation Profile:\n• Base Monthly: $${myEmp.salary.baseMonthly.toLocaleString()} ${myEmp.salary.currency || selectedCurrency}\n• Official Payslips: No monthly vouchers published yet by administrator.`;
          } else {
            reply = `💰 Official Payslips: No monthly payslip vouchers have been generated yet for your account.`;
          }
          actions = [
            { label: 'View Payslips Portal', actionKey: 'NAV_MY_PAYSLIPS' },
          ];
        } else if (lower.includes('profile') || lower.includes('password') || lower.includes('credential')) {
          reply = `👤 Your Profile & Security:\n• Name: ${currentUser?.name}\n• Email: ${currentUser?.email}\n• Department: ${currentUser?.department || 'Operations'}\n• Designation: ${currentUser?.designation || 'Team Member'}\nYou can update your password and security credentials anytime in My Profile.`;
          actions = [
            { label: 'Open Profile Settings', actionKey: 'NAV_MY_PROFILE' },
          ];
        } else {
          reply = `Hello ${currentUser?.name}! I am your personal ESS portal helper. I can summarize your personal attendance records, remaining leave balances, latest payslip breakdown, or application status.`;
          actions = [
            { label: 'Summarize My Attendance', actionKey: 'SUMMARIZE_MY_ATTENDANCE' },
            { label: 'Check My Leave Balances', actionKey: 'CHECK_MY_LEAVES' },
            { label: 'View My Latest Payslip', actionKey: 'VIEW_MY_PAYSLIP' },
          ];
        }
      } else {
        // 2. ADMIN CONSOLE SCOPED ASSISTANT RESPONSES (Enterprise System Summary)
        if (lower.includes('attendance') || lower.includes('present') || lower.includes('checkin') || lower.includes('clock')) {
          const todayCount = attendanceRecords.filter((r) => r.date === todayStr).length;
          reply = `📊 Organization Attendance Turnout for ${todayStr}:\n• Turnout: ${todayCount} of ${employees.length} employees checked in (${employees.length > 0 ? Math.round((todayCount / employees.length) * 100) : 0}%).\n• On-Site Verified: ${attendanceRecords.filter((r) => r.isWithinGeofence).length} biometric logs.\n• Absent / Not Yet Clocked In: ${Math.max(0, employees.length - todayCount)}.`;
          actions = [
            { label: 'Open Attendance Monitor', actionKey: 'NAV_ATTENDANCE' },
            { label: 'Biometric Camera Punch', actionKey: 'OPEN_PUNCH_MODAL' },
          ];
        } else if (lower.includes('leave') || lower.includes('vacation') || lower.includes('pto') || lower.includes('approval')) {
          const pending = leaveRequests.filter((l) => l.status === 'Pending').length;
          reply = `⏳ System Leave & Approvals Summary:\n• Pending Leave Approvals: ${pending} request${pending === 1 ? '' : 's'}.\n• Approved Leaves: ${leaveRequests.filter((l) => l.status === 'Approved').length}.\n• Total Leave Records: ${leaveRequests.length}.`;
          actions = [
            { label: 'Review Leave Tracker', actionKey: 'NAV_LEAVES' },
            ...(pending > 0 ? [{ label: 'Approve All Pending', actionKey: 'APPROVE_ALL_LEAVES' }] : []),
          ];
        } else if (lower.includes('payroll') || lower.includes('salary') || lower.includes('wage') || lower.includes('disburs')) {
          const totalBase = employees.reduce((sum, e) => sum + e.salary.baseMonthly, 0);
          reply = `💰 Enterprise Payroll Summary for ${company.name}:\n• Total Employees: ${employees.length}\n• Monthly Base Payroll Commitment: $${totalBase.toLocaleString()} ${selectedCurrency}\n• Total Disbursed Vouchers: ${payrollRuns.length} vouchers.\n• Total Paid: $${payrollRuns.filter((r) => r.paymentStatus === 'Paid').reduce((s, r) => s + (r.netSalary ?? r.netPayable), 0).toLocaleString()} ${selectedCurrency}.`;
          actions = [
            { label: 'Open Payroll Engine', actionKey: 'NAV_PAYROLL' },
          ];
        } else if (lower.includes('employee') || lower.includes('headcount') || lower.includes('staff') || lower.includes('directory')) {
          const depts = Array.from(new Set(employees.map((e) => e.department)));
          reply = `👥 Enterprise Workforce Directory:\n• Total Headcount: ${employees.length} team members\n• Active Departments: ${depts.join(', ') || 'None'}\n• Full-time: ${employees.filter((e) => e.employmentType === 'Full-time').length} · Part-time: ${employees.filter((e) => e.employmentType === 'Part-time').length}.`;
          actions = [
            { label: 'Open Employee Directory', actionKey: 'NAV_EMPLOYEES' },
          ];
        } else {
          reply = `Enterprise Executive Helper: Managing ${employees.length} employees, ${attendanceRecords.length} attendance logs, and ${leaveRequests.length} leave records across ${company.name}.`;
        }
      }

      const botMsg: AssistantMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: actions,
      };

      setAssistantMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  const executeAssistantAction = (actionKey: string) => {
    if (actionKey === 'SUMMARIZE_ATTENDANCE') {
      sendAssistantQuery('Summarize today\'s attendance');
    } else if (actionKey === 'CHECK_LEAVES') {
      sendAssistantQuery('Check pending leave requests');
    } else if (actionKey === 'VIEW_PAYROLL') {
      sendAssistantQuery('View monthly payroll totals');
    } else if (actionKey === 'APPROVE_ALL_LEAVES') {
      leaveRequests.forEach((l) => {
        if (l.status === 'Pending') {
          updateLeaveStatus(l.id, 'Approved');
        }
      });
      const confirmMsg: AssistantMessage = {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: '✅ All pending leave requests have been successfully approved and employee balances updated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAssistantMessages((prev) => [...prev, confirmMsg]);
    } else if (actionKey === 'NAV_ATTENDANCE') {
      setActiveModule('attendance');
      setActiveSubTab('attendance-overview');
    } else if (actionKey === 'NAV_LEAVES') {
      setActiveModule('attendance');
      setActiveSubTab('leave-tracker');
    } else if (actionKey === 'NAV_PAYROLL') {
      setActiveModule('payroll');
    } else if (actionKey === 'OPEN_PUNCH_MODAL') {
      setIsPunchModalOpen(true);
    } else if (actionKey === 'SUMMARIZE_MY_ATTENDANCE') {
      sendAssistantQuery('Summarize my attendance');
    } else if (actionKey === 'CHECK_MY_LEAVES') {
      sendAssistantQuery('Check my leave balances');
    } else if (actionKey === 'VIEW_MY_PAYSLIP') {
      sendAssistantQuery('View my latest payslip');
    } else if (actionKey === 'NAV_MY_ATTENDANCE') {
      setActiveModule('attendance');
      setActiveSubTab('attendance-overview');
    } else if (actionKey === 'NAV_APPLY_LEAVE') {
      setActiveModule('attendance');
      setActiveSubTab('employee-applications');
    } else if (actionKey === 'NAV_MY_LEAVES') {
      setActiveModule('attendance');
      setActiveSubTab('leave-tracker');
    } else if (actionKey === 'NAV_MY_PAYSLIPS') {
      setActiveModule('employee');
      setActiveSubTab('employee-payslips');
    } else if (actionKey === 'NAV_MY_PROFILE') {
      setActiveModule('employee');
      setActiveSubTab('employee-profile');
    } else if (actionKey === 'NAV_EMPLOYEES') {
      setActiveModule('core');
      setActiveSubTab('employees');
    }
  };

  const clearAssistantChat = () => {
    setAssistantMessages([
      {
        id: 'msg_cleared',
        sender: 'assistant',
        text: `Chat reset. Ask me anything about attendance, salaries, OKRs, candidates, or company policies!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: '📊 Summarize today\'s attendance', actionKey: 'SUMMARIZE_ATTENDANCE' },
          { label: '⏳ Check pending leave requests', actionKey: 'CHECK_LEAVES' },
        ],
      },
    ]);
  };

  return (
    <HRContext.Provider
      value={{
        isSetupComplete,
        completeInitialSetup,
        currentUser,
        activeRole,
        switchUser,
        switchRole,
        loginUser,
        logoutUser,
        registerUser,
        allSessions,
        resetEntireSystem,
        company,
        updateCompany,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        selectedEmployeeDetail,
        setSelectedEmployeeDetail,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        payslipTemplate,
        updatePayslipTemplate,
        resetPayslipTemplate,
        importPayslipTemplate,
        attendanceRecords,
        isPunchedIn,
        currentAttendanceRecord,
        punchIn,
        punchOut,
        userLocation,
        refreshLocation,
        leaveRequests,
        applyLeave,
        updateLeaveStatus,
        timesheets,
        addTimesheet,
        updateTimesheetStatus,
        shiftRosters,
        updateShift,
        holidays,
        addHoliday,
        payrollRuns,
        processPayrollRun,
        selectedCurrency,
        setSelectedCurrency,
        currencyRates,
        expenseClaims,
        addExpenseClaim,
        updateExpenseStatus,
        benefitPlans,
        toggleBenefitEnrollment,
        candidates,
        updateCandidateStage,
        addCandidate,
        interviews,
        scheduleInterview,
        onboardingTasks,
        toggleOnboardingTask,
        backgroundChecks,
        offboardingRecords,
        updateOffboardingStatus,
        goalsOKR,
        addGoalOKR,
        updateGoalProgress,
        appraisals,
        addAppraisal,
        courses,
        toggleCourseEnrollment,
        updateCourseProgress,
        competencies,
        successionPlans,
        addSuccessionPlan,
        pulseSurvey,
        votePulseSurvey,
        peerKudos,
        sendPeerKudo,
        likePeerKudo,
        companyAssets,
        addAsset,
        assignAsset,
        returnAsset,
        documents,
        uploadDocument,
        workflows,
        toggleWorkflow,
        apiKeys,
        isAssistantOpen,
        setIsAssistantOpen,
        assistantMessages,
        sendAssistantQuery,
        clearAssistantChat,
        executeAssistantAction,
        isPunchModalOpen,
        setIsPunchModalOpen,
        activeModule,
        setActiveModule,
        activeSubTab,
        setActiveSubTab,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
};
