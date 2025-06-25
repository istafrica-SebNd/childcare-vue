// Filter configurations for different admin pages

export interface FilterOption {
  label: string
  value: string | number | boolean
}

export interface FilterField {
  key: string
  type: 'dropdown' | 'text' | 'date' | 'number' | 'multiselect' | 'checkbox' | 'radio'
  label?: string
  placeholder?: string
  options?: FilterOption[]
  optionLabel?: string
  optionValue?: string
  class?: string
  defaultValue?: string | number | boolean | string[]
}

export interface FilterRow {
  label?: string
  fields: FilterField[]
}

// Approval Management Filters
export const approvalFilters: FilterRow[] = [
  {
    label: 'Fields',
    fields: [
      {
        key: 'status',
        type: 'dropdown' as const,
        placeholder: 'All Statuses',
        options: [
          { label: 'All Statuses', value: '' },
          { label: 'New', value: 'new' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
          { label: 'In Progress', value: 'inprogress' },
          { label: 'Pending', value: 'pending' }
        ]
      },
      {
        key: 'operator',
        type: 'dropdown' as const,
        placeholder: 'in',
        options: [
          { label: 'in', value: 'in' },
          { label: 'not in', value: 'notin' },
          { label: 'equals', value: 'equals' },
          { label: 'contains', value: 'contains' }
        ]
      },
      {
        key: 'value',
        type: 'dropdown' as const,
        placeholder: 'New',
        options: [
          { label: 'New', value: 'new' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
          { label: 'In Progress', value: 'inprogress' },
          { label: 'Pending', value: 'pending' }
        ]
      }
    ]
  }
]

// Member Management Filters
export const memberFilters: FilterRow[] = [
  {
    label: 'Member Details',
    fields: [
      {
        key: 'memberType',
        type: 'dropdown' as const,
        placeholder: 'All Member Types',
        options: [
          { label: 'All Types', value: '' },
          { label: 'Full-time', value: 'fulltime' },
          { label: 'Part-time', value: 'parttime' },
          { label: 'Temporary', value: 'temporary' }
        ]
      },
      {
        key: 'status',
        type: 'dropdown' as const,
        placeholder: 'All Statuses',
        options: [
          { label: 'All Statuses', value: '' },
          { label: 'Active', value: 'active' },
          { label: 'Pending', value: 'pending' },
          { label: 'Inactive', value: 'inactive' }
        ]
      },
      {
        key: 'admissionYear',
        type: 'dropdown' as const,
        placeholder: 'All Years',
        options: [
          { label: 'All Years', value: '' },
          { label: '2024', value: '2024' },
          { label: '2023', value: '2023' },
          { label: '2022', value: '2022' }
        ]
      }
    ]
  },
  {
    label: 'Advanced Filters',
    fields: [
      {
        key: 'ageRange',
        type: 'multiselect' as const,
        placeholder: 'Select Age Range',
        options: [
          { label: '0-1 years', value: '0-1' },
          { label: '2-3 years', value: '2-3' },
          { label: '4-5 years', value: '4-5' },
          { label: '6+ years', value: '6+' }
        ]
      },
      {
        key: 'hasSpecialNeeds',
        type: 'checkbox' as const,
        label: 'Has Special Needs'
      },
      {
        key: 'admissionDateFrom',
        type: 'date' as const,
        placeholder: 'From Date'
      },
      {
        key: 'admissionDateTo',
        type: 'date' as const,
        placeholder: 'To Date'
      }
    ]
  }
]

// Financial Reports Filters
export const financialFilters: FilterRow[] = [
  {
    label: 'Report Parameters',
    fields: [
      {
        key: 'reportType',
        type: 'radio' as const,
        options: [
          { label: 'Monthly', value: 'monthly' },
          { label: 'Quarterly', value: 'quarterly' },
          { label: 'Annual', value: 'annual' }
        ]
      },
      {
        key: 'municipality',
        type: 'multiselect' as const,
        placeholder: 'Select Municipalities',
        options: [
          { label: 'Oslo', value: 'oslo' },
          { label: 'Bergen', value: 'bergen' },
          { label: 'Trondheim', value: 'trondheim' },
          { label: 'Stavanger', value: 'stavanger' }
        ]
      }
    ]
  },
  {
    label: 'Amount Range',
    fields: [
      {
        key: 'minAmount',
        type: 'number' as const,
        placeholder: 'Minimum Amount'
      },
      {
        key: 'maxAmount',
        type: 'number' as const,
        placeholder: 'Maximum Amount'
      },
      {
        key: 'currency',
        type: 'dropdown' as const,
        placeholder: 'Currency',
        options: [
          { label: 'NOK', value: 'NOK' },
          { label: 'EUR', value: 'EUR' },
          { label: 'USD', value: 'USD' }
        ]
      }
    ]
  }
]

// Application Management Filters
export const applicationFilters: FilterRow[] = [
  {
    label: 'Application Status',
    fields: [
      {
        key: 'applicationStatus',
        type: 'dropdown' as const,
        placeholder: 'All Application Statuses',
        options: [
          { label: 'All Statuses', value: '' },
          { label: 'Submitted', value: 'submitted' },
          { label: 'Under Review', value: 'under_review' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
          { label: 'Waitlisted', value: 'waitlisted' }
        ]
      },
      {
        key: 'priority',
        type: 'dropdown' as const,
        placeholder: 'Priority Level',
        options: [
          { label: 'All Priorities', value: '' },
          { label: 'High', value: 'high' },
          { label: 'Medium', value: 'medium' },
          { label: 'Low', value: 'low' }
        ]
      },
      {
        key: 'emergencyApplication',
        type: 'checkbox' as const,
        label: 'Emergency Applications Only'
      }
    ]
  }
]
