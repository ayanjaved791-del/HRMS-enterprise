import {
  Company,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  TimesheetEntry,
  ShiftRoster,
  OvertimeLog,
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
  Announcement,
  PayslipTemplate
} from '../types';

export const initialCompany: Company = {
  id: 'comp_default',
  name: 'Enterprise HRMS',
  logo: 'HRMate',
  industry: 'Corporate & Technology',
  currency: 'USD',
  timezone: 'America/New_York (EST)',
  hqLocation: {
    name: 'Corporate HQ Suite 400',
    latitude: 37.7749,
    longitude: -122.4194,
    radiusMeters: 200,
  },
};

// No fake dummy profiles — users create their own company and employee roster
export const initialEmployees: Employee[] = [];

export const initialSessions: UserSession[] = [
  {
    id: 'user_admin_01',
    name: 'Amara Morgan',
    email: 'admin@company.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    companyId: 'comp_default',
    designation: 'HR Director',
    department: 'Human Resources',
    password: 'admin',
  },
];

export const initialAnnouncements: Announcement[] = [];

export const defaultPayslipTemplate: PayslipTemplate = {
  fontFamily: 'Plus Jakarta Sans',
  primaryColor: '#0F766E',
  headerStyle: 'banner',
  headerTitle: 'CONFIDENTIAL SALARY DISBURSEMENT STATEMENT',
  headerSubtitle: 'Certified Monthly Compensation & Benefits Breakdown',
  companyTaxNumber: 'TAX-REG-2026-90812',
  showLogo: true,
  showQrCode: true,
  earningsHeading: 'Monthly Gross Earnings & Allowances',
  deductionsHeading: 'Statutory Taxes & Payroll Deductions',
  netPayHeading: 'Net Take-Home Disbursed Compensation',
  accountDetailsHeading: 'Disbursement Account Credentials',
  footerNote: 'This voucher is an authenticated digital record of payroll disbursement. Direct deposit verified through corporate banking gateway.',
  showEmployerSignature: true,
  signatoryTitle: 'Authorized Payroll Administrator',
  signatoryName: 'Office of People & Finance',
};

export const initialAttendanceRecords: AttendanceRecord[] = [];

export const initialLeaveRequests: LeaveRequest[] = [];

export const initialTimesheets: TimesheetEntry[] = [];

export const initialShiftRosters: ShiftRoster[] = [];

export const initialHolidays: Holiday[] = [];

export const initialPayrollRuns: PayrollRun[] = [];

export const initialExpenseClaims: ExpenseClaim[] = [];

export const initialBenefitPlans: BenefitPlan[] = [];

export const initialCandidates: Candidate[] = [];

export const initialInterviews: InterviewSession[] = [];

export const initialOnboardingTasks: OnboardingTask[] = [];

export const initialBackgroundChecks: BackgroundCheck[] = [];

export const initialOffboardingRecords: OffboardingRecord[] = [];

export const initialGoalsOKR: GoalOKR[] = [];

export const initialAppraisals: AppraisalReview[] = [];

export const initialCourses: LMSCourse[] = [];

export const initialCompetencies: CompetencyItem[] = [];

export const initialSuccessionPlans: SuccessionPlan[] = [];

export const initialPulseSurvey: PulseSurveyResponse = {
  id: 'pulse_active',
  question: 'How energized and supported do you feel by your team and leadership this week?',
  averageRating: 0,
  totalVotes: 0,
  options: [
    { label: 'Exceedingly Energized & Thriving', count: 0, percentage: 0 },
    { label: 'Steady & Well-Paced', count: 0, percentage: 0 },
    { label: 'Slightly Fatigued / Need Break', count: 0, percentage: 0 },
    { label: 'Overwhelmed & Seeking Support', count: 0, percentage: 0 },
  ],
  userVotedOption: undefined,
};

export const initialPeerKudos: PeerKudo[] = [];

export const initialCompanyAssets: CompanyAsset[] = [];

export const initialDocuments: DocumentItem[] = [];

export const initialWorkflows: WorkflowRule[] = [];

export const initialApiKeys: ApiKeyIntegration[] = [];

