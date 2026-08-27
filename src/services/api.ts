const API_BASE = typeof window !== 'undefined' ? '/api' : 'http://localhost:5000/api';

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    let url = `${API_BASE}${endpoint}`;
    let res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      ...options
    });

    // Fallback directly to localhost:5000 if proxy isn't caught
    if (!res.ok && API_BASE === '/api') {
      const fallbackUrl = `http://localhost:5000/api${endpoint}`;
      res = await fetch(fallbackUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {})
        },
        ...options
      });
    }

    if (!res.ok) {
      console.warn(`[API] Request to ${endpoint} returned status ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    // Try absolute localhost:5000 on network failure
    try {
      const fallbackUrl = `http://localhost:5000/api${endpoint}`;
      const res = await fetch(fallbackUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {})
        },
        ...options
      });
      if (res.ok) return await res.json();
    } catch (fallbackErr) {
      console.warn(`[API] Failed to fetch ${endpoint}:`, err);
    }
    return null;
  }
}

// User / Auth
export async function signupUser(userData: { name: string; email: string; password?: string; role?: string; district?: string }) {
  return apiRequest<{ success: boolean; user: any; error?: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

export async function loginUser(email: string, password?: string, role?: string) {
  return apiRequest<{ success: boolean; user: any; error?: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
}

export async function deleteUserAccount(userId: string) {
  return apiRequest<{ success: boolean; message: string }>(`/users/${userId}`, {
    method: 'DELETE'
  });
}

// Projects
export async function fetchProjects(userId?: string) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  return apiRequest<any[]>(`/projects${query}`);
}

export async function createProjectApi(projectData: any) {
  return apiRequest<any>('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData)
  });
}

// Applications
export async function fetchApplications(filters?: { userId?: string; projectId?: string; status?: string; department?: string }) {
  const params = new URLSearchParams();
  if (filters?.userId) params.append('userId', filters.userId);
  if (filters?.projectId) params.append('projectId', filters.projectId);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.department) params.append('department', filters.department);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<any[]>(`/applications${qs}`);
}

export async function createApplicationApi(appData: any) {
  return apiRequest<any>('/applications', {
    method: 'POST',
    body: JSON.stringify(appData)
  });
}

export async function updateApplicationStatusApi(id: string, status: string, remarks?: string, officerName?: string) {
  return apiRequest<any>(`/applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, remarks, officerName })
  });
}

// NOC Applications
export async function fetchNocApplications(filters?: { userId?: string; projectId?: string; status?: string; nocType?: string }) {
  const params = new URLSearchParams();
  if (filters?.userId) params.append('userId', filters.userId);
  if (filters?.projectId) params.append('projectId', filters.projectId);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.nocType) params.append('nocType', filters.nocType);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<any[]>(`/noc-applications${qs}`);
}

export async function createNocApplicationApi(nocData: any) {
  return apiRequest<any>('/noc-applications', {
    method: 'POST',
    body: JSON.stringify(nocData)
  });
}

export async function issueNocCertificateApi(id: string, certType: 'PROVISIONAL' | 'FINAL') {
  return apiRequest<any>(`/noc-applications/${id}/issue-certificate`, {
    method: 'POST',
    body: JSON.stringify({ certType })
  });
}

// Documents
export async function fetchDocuments(projectId?: string, userId?: string) {
  const params = new URLSearchParams();
  if (projectId) params.append('projectId', projectId);
  if (userId) params.append('userId', userId);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<any[]>(`/documents${qs}`);
}

export async function uploadDocumentApi(docData: any) {
  return apiRequest<any>('/documents', {
    method: 'POST',
    body: JSON.stringify(docData)
  });
}

// Queries
export async function raiseApplicationQueryApi(id: string, queryData: { officerName?: string; department?: string; queryCategory?: string; queryText: string; dueDate?: string }) {
  return apiRequest<any>(`/applications/${id}/query`, {
    method: 'POST',
    body: JSON.stringify(queryData)
  });
}

export async function respondToApplicationQueryApi(queryId: string, responseText: string, responseDocName?: string) {
  return apiRequest<any>(`/queries/${queryId}/respond`, {
    method: 'POST',
    body: JSON.stringify({ responseText, responseDocName })
  });
}

export async function raiseNocQueryApi(nocId: string, question: string, raisedBy?: string) {
  return apiRequest<any>(`/noc-applications/${nocId}/query`, {
    method: 'POST',
    body: JSON.stringify({ question, raisedBy })
  });
}

export async function respondToNocQueryApi(nocId: string, queryId: string, responseText: string, responseDocName?: string) {
  return apiRequest<any>(`/noc-applications/${nocId}/query-response`, {
    method: 'POST',
    body: JSON.stringify({ queryId, responseText, responseDocName })
  });
}

// Compliance Tasks
export async function fetchComplianceTasks(projectId?: string, userId?: string) {
  const params = new URLSearchParams();
  if (projectId) params.append('projectId', projectId);
  if (userId) params.append('userId', userId);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<any[]>(`/compliance${qs}`);
}

export async function renewComplianceTaskApi(taskId: string) {
  return apiRequest<any>(`/compliance/${taskId}/renew`, {
    method: 'POST'
  });
}

// Joint Inspections
export async function fetchJointInspections() {
  return apiRequest<any[]>('/joint-inspections');
}

export async function createJointInspectionApi(inspData: any) {
  return apiRequest<any>('/joint-inspections', {
    method: 'POST',
    body: JSON.stringify(inspData)
  });
}

// Incentive Schemes
export async function fetchIncentiveSchemes() {
  return apiRequest<any[]>('/incentives');
}

// Audit Logs
export async function fetchAuditLogs() {
  return apiRequest<any[]>('/audit-logs');
}

export async function createAuditLogApi(logData: any) {
  return apiRequest<any>('/audit-logs', {
    method: 'POST',
    body: JSON.stringify(logData)
  });
}

// Notifications
export async function fetchNotifications() {
  return apiRequest<any[]>('/notifications');
}

export async function markNotificationReadApi(id: string) {
  return apiRequest<any>(`/notifications/${id}/read`, {
    method: 'PUT'
  });
}

// Rules Engine
export async function fetchRules() {
  return apiRequest<any[]>('/rules');
}

export async function createRuleApi(ruleData: any) {
  return apiRequest<any>('/rules', {
    method: 'POST',
    body: JSON.stringify(ruleData)
  });
}

// AI OCR & RAG
export async function apiAnalyzeDocumentOCR(docData: {
  docName: string;
  category: string;
  fileUrl?: string;
  projectProfile?: any;
  requiredChecklist?: string[];
}) {
  return apiRequest<{
    confidence: number;
    extractedFields?: {
      applicantName: string;
      businessName: string;
      registrationNumber: string;
      issueDate: string;
      expiryDate?: string;
      issuingAuthority: string;
      documentType: string;
      isExpired: boolean;
      isNameMismatch: boolean;
      isUnreadable: boolean;
      qualityScore: number;
    };
    extractedName?: string;
    extractedRegNo?: string;
    extractedExpiry?: string;
    extractedAddress?: string;
    status: 'Valid' | 'Expired' | 'Name Mismatch' | 'Blurry / Unreadable' | 'Pending Review';
    issues: string[];
    recommendations: string[];
    checklistValidation?: {
      isComplete: boolean;
      missingDocuments: string[];
      providedDocuments: string[];
    };
  }>('/ai/ocr-analyze', {
    method: 'POST',
    body: JSON.stringify(docData)
  });
}

export async function apiPreValidateChecklist(params: {
  approvalName: string;
  requiredDocs: string[];
  uploadedDocs: Array<{ docName: string; category: string; expiryDate?: string; status?: string }>;
  businessName: string;
}) {
  return apiRequest<{
    isValidForSubmission: boolean;
    missingDocuments: string[];
    expiredDocuments: string[];
    nameMismatchedDocuments: string[];
    warnings: string[];
    readinessScore: number;
  }>('/ai/pre-validate-checklist', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export async function apiQueryRegulatoryRAG(params: {
  query: string;
  projectContext?: any;
  language?: string;
}) {
  return apiRequest<{
    matches: any[];
    answer: string;
    statutoryCitations: string[];
    topic?: string;
  }>('/ai/rag-query', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export async function apiExplainOfficerQuery(params: {
  queryText: string;
  approvalName: string;
}) {
  return apiRequest<{
    originalQuery: string;
    plainExplanation: string;
    actionSteps: string[];
  }>('/ai/explain-query', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}


