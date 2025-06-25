import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    common: {
      labels: {
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        phoneNumber: 'Phone Number',
        address: 'Address',
        postalCode: 'Postal Code',
        city: 'City',
        dateOfBirth: 'Date of Birth',
        gender: 'Gender',
        male: 'Male',
        female: 'Female',
        other: 'Other'
      },
      status: {
        submitted: 'Submitted',
        placed: 'Placed',
        rejected: 'Rejected',
        present: 'Present',
        absent: 'Absent',
        completed: 'Completed',
        upcoming: 'Upcoming',
        paid: 'Paid',
        pending: 'Pending',
        current: 'Current',
        new: 'New',
        approved: 'Approved',
        active: 'Active',
        inactive: 'Inactive'
      },
      unread: 'Unread',
      notifications: 'Notifications',
      messages: 'Messages',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      confirm: 'Confirm',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      apply: 'Apply',
      clear: 'Clear',
      selectUnit: 'Select Unit',
      allUnits: 'All Units',
      filters: 'Filters',
      selectDistrict: 'Select District',
      allDistricts: 'All Districts',
      showAll: 'Show all',
      itemsPerPage: 'items per page',
      pageOf: 'Page {current} of {total}',
      approve: 'Approve',
      reject: 'Reject',
      save: 'Save',
      child: 'Child',
      duration: 'Duration',
      today: 'Today',
      thisWeek: 'This Week',
      refresh: 'Refresh',
      export: 'Export'
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      welcome: 'Welcome'
    },
    navigation: {
      dashboard: 'Dashboard',
      myApplications: 'My Applications',
      childrenList: 'Children List',
      dailySchedule: 'Daily Schedule',
      attendanceTracking: 'Attendance Tracking',
      messages: 'Messages',
      payments: 'Payments',
      documents: 'Documents',
      holidayRegistration: 'Holiday Registration',
      emergencyContacts: 'Emergency Contacts',
      noticeBoard: 'Notice Board',
      absenceReporting: 'Absence Reporting',
      consents: 'Consents & Forms',
      dailyEssentials: 'Daily Essentials',
      administrative: 'Administrative',
      descriptions: {
        dashboard: 'Overview and status',
        myApplications: 'Track application status',
        childrenList: 'Manage your children',
        dailySchedule: 'View today\'s activities and schedule',
        attendanceTracking: 'Track daily attendance',
        messages: 'Communication center',
        payments: 'View invoices and payments'
      }
    },
    attendance: {
      title: 'Attendance Tracking',
      description: 'Track your child\'s daily attendance and check-in times',
      todaysStatus: 'Today\'s Status',
      weeklyOverview: 'Weekly Overview',
      checkedInAt: 'Checked in at',
      expectedCheckout: 'Expected checkout',
      attendanceRate: 'Attendance Rate',
      averageDailyHours: 'Average Daily Hours',
      absencesThisMonth: 'Absences This Month',
      selectChild: 'Select Child',
      timeIn: 'In',
      timeOut: 'Out',
      absent: 'Absent'
    },
    guardian: {
      dashboard: {
        welcome: 'Welcome back',
        subtitle: 'Here\'s what\'s happening with your applications',
        newApplication: 'New Application',
        applications: 'Applications',
        applicationsDescription: 'Track the status of your kindergarten applications',
        messages: 'Messages',
        messagesDescription: 'Recent communications from kindergartens and staff',
        payments: 'Payments',
        paymentsDescription: 'Upcoming and recent payments',
        dueDate: 'Due',
        quickActions: 'Quick Actions',
        quickActionsDescription: 'Frequently used features and shortcuts',
        recentMessages: 'Recent Messages',
        recentMessagesDescription: 'Latest communications',
        upcomingPayments: 'Upcoming Payments',
        myApplications: 'My Applications',
        applicationsOverview: 'Overview of all your kindergarten applications',
        viewAll: 'View All',
        submitted: 'Submitted',
        paymentOverview: 'Payment Overview',
        recentInvoices: 'Recent Invoices and Payments'
      },
      schedule: {
        title: 'Daily Schedule',
        description: 'View your child\'s daily activities and schedule',
        viewWeek: 'View Week',
        currentActivity: 'Current Activity',
        todaySchedule: 'Today\'s Schedule',
        date: '{date}',
        activities: {
          arrival: 'Arrival',
          breakfast: 'Breakfast',
          outdoorPlay: 'Outdoor Play',
          learningTime: 'Learning Time',
          lunch: 'Lunch',
          restTime: 'Rest Time',
          pickup: 'Pickup'
        },
        locations: {
          mainRoom: 'Main Room',
          diningRoom: 'Dining Room',
          playground: 'Playground',
          classroom: 'Classroom',
          restRoom: 'Rest Room'
        }
      },
      documents: {
        title: 'Documents',
        description: 'Access important documents and information about your child\'s kindergarten',
        badge: 'Document Center',
        search: 'Search documents...',
        filter: 'Filter',
        categoriesTitle: 'Categories',
        documentsTitle: 'Documents',
        of: 'of',
        documentsCount: 'documents',
        recentUpdates: 'Recent Updates',
        recentDescription: 'Newly published documents and updates',
        published: 'Published',
        download: 'Download'
      }
    },
    educator: {
      dashboard: {
        welcome: 'Welcome back',
        subtitle: 'Here\'s your daily overview',
        newActivity: 'New Activity',
        children: 'Children',
        childrenDescription: 'Today\'s attendance and group overview',
        activities: 'Activities',
        activitiesDescription: 'Today\'s schedule and activities',
        messages: 'Messages',
        messagesDescription: 'Recent communications from parents and staff'
      }
    },
    stats: {
      activeApplications: 'Active Applications',
      placedChildren: 'Placed Children',
      pendingPayments: 'Pending Payments',
      unreadMessages: 'Unread Messages'
    },
    admin: {
      dashboard: {
        title: 'Municipality System Administration',
        subtitle: 'Oslo Municipality - Central System Management',
        municipalityAdmin: 'Municipality Admin',
        microsoftEntraId: 'Microsoft Entra ID',
        english: 'English',
        administrator: 'Administrator',
        kpis: {
          totalDistricts: 'Total Districts',
          active: 'Active',
          systemUptime: 'System Uptime',
          totalChildren: 'Total Children',
          complianceScore: 'Compliance Score'
        },
        tabs: {
          systemOverview: 'System Overview',
          governance: 'Governance',
          operations: 'Operations',
          monitoring: 'Monitoring'
        },
        filters: {
          allModules: 'All Modules',
          systemConfig: 'System Config',
          governance: 'Governance',
          security: 'Security',
          dataManagement: 'Data Management',
          operations: 'Operations',
          analytics: 'Analytics'
        },
        modules: {
          globalSystemConfiguration: {
            title: 'Global System Configuration',
            description: 'System-wide parameters, feature flags, and global settings',
            action: 'Configure'
          },
          districtOversight: {
            title: 'District Oversight',
            description: 'Monitor and manage all districts across the municipality',
            action: 'Configure'
          },
          policyManagement: {
            title: 'Policy Management',
            description: 'Define municipality-wide policies and compliance rules',
            action: 'Configure'
          },
          userRoleTemplates: {
            title: 'User & Role Templates',
            description: 'Manage system-wide user roles and permission templates',
            action: 'Configure'
          },
          kindergartenClassification: {
            title: 'Kindergarten Classification',
            description: 'Manage kindergarten types, services, and master data',
            action: 'Configure'
          },
          placementWindows: {
            title: 'Placement Windows',
            description: 'Configure application periods and placement windows',
            action: 'Configure'
          },
          featureControlCenter: {
            title: 'Feature Control Center',
            description: 'Enable/disable features across all districts',
            action: 'Configure'
          },
          securityCompliance: {
            title: 'Security & Compliance',
            description: 'GDPR compliance, audit logs, and security monitoring',
            action: 'Configure'
          },
          analyticsDashboard: {
            title: 'Analytics Dashboard',
            description: 'Municipality-wide analytics and performance metrics',
            action: 'Configure'
          },
          dataIntegration: {
            title: 'Data Integration',
            description: 'Manage external system integrations and data flows',
            action: 'Configure'
          },
          communicationCenter: {
            title: 'Communication Center',
            description: 'Manage system-wide communications and notifications',
            action: 'Configure'
          },
          systemReleases: {
            title: 'System Releases',
            description: 'Manage feature releases and system updates',
            action: 'Configure'
          }
        }
      },
      approvals: {
        title: 'Approval Management',
        subtitle: 'Manage timetables and placement approvals',
        requestForReplace: 'Request for a replace',
        showOnlyCurrentUnits: 'Show only current units',
        tabs: {
          foreskola: 'Förskola',
          fritidshem: 'Fritidshem'
        },
        actions: {
          endRequest: 'End request',
          requestForReplace: 'Request for replace',
          rateCategoryAverageTime: 'Rate category/Average time',
          timetable: 'Timetable',
          reasontype: 'Reasontype',
          leave: 'Leave',
          approveReject: 'Approve/reject'
        },
        table: {
          id: '#',
          status: 'Status',
          replaceUnit: 'Replace unit',
          currentUnit: 'Current unit',
          child: 'Child',
          reqAdmissionEndDate: 'Req. admission end date',
          reqNewAdmissionStartDate: 'Req. new admission start date',
          reason: 'Reason',
          submitDate: 'Submit date',
          requestedBy: 'Requested by'
        },
        searchPlaceholder: 'ArnoldPreSchool2'
      },
      members: {
        title: 'Childcare Member Management',
        subtitle: 'Comprehensive management of childcare admissions and placements',
        showActiveOnly: 'Show only active members',
        tabs: {
          children: 'Children',
          guardians: 'Guardians'
        },
        actions: {
          manageAdmissions: 'Manage admissions',
          updateRecords: 'Update records',
          generateReports: 'Generate reports',
          exportData: 'Export data'
        },
        searchPlaceholder: 'Search members...',
        exportData: 'Export Data'
      }
    }
  },
  no: {
    common: {
      labels: {
        email: 'E-post',
        password: 'Passord',
        confirmPassword: 'Bekreft passord',
        firstName: 'Fornavn',
        lastName: 'Etternavn',
        phoneNumber: 'Telefonnummer',
        address: 'Adresse',
        postalCode: 'Postnummer',
        city: 'By',
        dateOfBirth: 'Fødselsdato',
        gender: 'Kjønn',
        male: 'Mann',
        female: 'Kvinne',
        other: 'Annet'
      },
      status: {
        submitted: 'Innsendt',
        placed: 'Plassert',
        rejected: 'Avslått',
        present: 'Tilstede',
        absent: 'Fraværende',
        completed: 'Fullført',
        upcoming: 'Kommende',
        paid: 'Betalt',
        pending: 'Venter',
        current: 'Nåværende',
        new: 'Ny',
        approved: 'Godkjent',
        active: 'Aktiv',
        inactive: 'Inaktiv'
      },
      unread: 'Ulest',
      notifications: 'Varsler',
      messages: 'Meldinger',
      settings: 'Innstillinger',
      profile: 'Profil',
      logout: 'Logg ut',
      loading: 'Laster...',
      error: 'En feil oppstod',
      success: 'Suksess',
      warning: 'Advarsel',
      info: 'Informasjon',
      confirm: 'Bekreft',
      cancel: 'Avbryt',
      edit: 'Rediger',
      delete: 'Slett',
      apply: 'Anvend',
      clear: 'Tøm',
      selectUnit: 'Velg enhet',
      allUnits: 'Alle enheter',
      filters: 'Filtre',
      selectDistrict: 'Velg bydel',
      allDistricts: 'Alle bydeler',
      showAll: 'Vis alle bydeler',
      itemsPerPage: 'elementer per side',
      pageOf: 'Side {current} av {total}',
      approve: 'Godkjenn',
      reject: 'Avslå',
      save: 'Lagre',
      child: 'Barn',
      duration: 'Varighet',
      today: 'I dag',
      thisWeek: 'Denne uken',
      refresh: 'Refresh',
      export: 'Export'
    },
    auth: {
      login: 'Logg inn',
      logout: 'Logg ut',
      welcome: 'Velkommen'
    },
    navigation: {
      dashboard: 'Dashbord',
      myApplications: 'Mine søknader',
      childrenList: 'Barneliste',
      dailySchedule: 'Dagsplan',
      attendanceTracking: 'Oppmøtesporing',
      messages: 'Meldinger',
      payments: 'Betalinger',
      documents: 'Dokumenter',
      holidayRegistration: 'Ferieregistrering',
      emergencyContacts: 'Nødkontakter',
      noticeBoard: 'Oppslagstavle',
      absenceReporting: 'Fraværsrapportering',
      consents: 'Samtykker og skjemaer',
      dailyEssentials: 'Daglige Essentials',
      administrative: 'Administrative',
      descriptions: {
        dashboard: 'Oversikt og status',
        myApplications: 'Spor søknadsstatus',
        childrenList: 'Administrer barna dine',
        dailySchedule: 'Se dagens aktiviteter og timeplan',
        attendanceTracking: 'Spor daglig oppmøte',
        messages: 'Kommunikasjonssenter',
        payments: 'Se fakturaer og betalinger'
      }
    },
    attendance: {
      title: 'Oppmøtesporing',
      description: 'Spor barnets daglige oppmøte og innsjekktider',
      todaysStatus: 'Dagens status',
      weeklyOverview: 'Ukeoversikt',
      checkedInAt: 'Sjekket inn',
      expectedCheckout: 'Forventet utsjekk',
      attendanceRate: 'Oppmøteprosent',
      averageDailyHours: 'Gjennomsnittlige timer per dag',
      absencesThisMonth: 'Fravær denne måneden',
      selectChild: 'Velg barn',
      timeIn: 'Inn',
      timeOut: 'Ut',
      absent: 'Fraværende'
    },
    guardian: {
      dashboard: {
        welcome: 'Velkommen tilbake',
        subtitle: 'Her er oversikten over søknadene dine',
        newApplication: 'Ny søknad',
        applications: 'Søknader',
        applicationsDescription: 'Følg status på barnehagesøknadene dine',
        messages: 'Meldinger',
        messagesDescription: 'Siste meldinger fra barnehager og ansatte',
        payments: 'Betalinger',
        paymentsDescription: 'Kommende og nylige betalinger',
        dueDate: 'Forfallsdato',
        quickActions: 'Hurtighandlinger',
        quickActionsDescription: 'Ofte brukte funksjoner og snarveier',
        recentMessages: 'Nylige meldinger',
        recentMessagesDescription: 'Siste kommunikasjon',
        upcomingPayments: 'Kommende betalinger',
        myApplications: 'Mine søknader',
        applicationsOverview: 'Oversikt over alle barnehagesøknadene dine',
        viewAll: 'Se alle',
        submitted: 'Innsendt',
        paymentOverview: 'Betalingsoversikt',
        recentInvoices: 'Nylige fakturaer og betalinger'
      },
      schedule: {
        title: 'Dagsplan',
        description: 'Se barnets daglige aktiviteter og timeplan',
        viewWeek: 'Se Uke',
        currentActivity: 'Nåværende Aktivitet',
        todaySchedule: 'Dagens Timeplan',
        date: '{date}',
        activities: {
          arrival: 'Ankomst',
          breakfast: 'Frokost',
          outdoorPlay: 'Utelek',
          learningTime: 'Læringstid',
          lunch: 'Lunsj',
          restTime: 'Hviletid',
          pickup: 'Henting'
        },
        locations: {
          mainRoom: 'Hovedrom',
          diningRoom: 'Spiserom',
          playground: 'Lekeplass',
          classroom: 'Klasserom',
          restRoom: 'Hvilerom'
        }
      },
      documents: {
        title: 'Dokumenter',
        description: 'Tilgang til viktige dokumenter og informasjon om barnets barnehage',
        badge: 'Dokumentsenter',
        search: 'Søk i dokumenter...',
        filter: 'Filter',
        categoriesTitle: 'Kategorier',
        documentsTitle: 'Dokumenter',
        of: 'av',
        documentsCount: 'dokumenter',
        recentUpdates: 'Siste oppdateringer',
        recentDescription: 'Nylig publiserte dokumenter og oppdateringer',
        published: 'Publisert',
        download: 'Last ned'
      }
    },
    educator: {
      dashboard: {
        welcome: 'Velkommen tilbake',
        subtitle: 'Her er dagens oversikt',
        newActivity: 'Ny aktivitet',
        children: 'Barn',
        childrenDescription: 'Dagens oppmøte og gruppeoversikt',
        activities: 'Aktiviteter',
        activitiesDescription: 'Dagens timeplan og aktiviteter',
        messages: 'Meldinger',
        messagesDescription: 'Siste meldinger fra foreldre og ansatte'
      }
    },
    stats: {
      activeApplications: 'Aktive søknader',
      placedChildren: 'Plasserte barn',
      pendingPayments: 'Ventende betalinger',
      unreadMessages: 'Uleste meldinger'
    },
    admin: {
      dashboard: {
        title: 'Kommunal systemadministrasjon',
        subtitle: 'Oslo Kommune - Sentral systemhåndtering',
        municipalityAdmin: 'Kommune Admin',
        microsoftEntraId: 'Microsoft Entra ID',
        english: 'Engelsk',
        administrator: 'Administrator',
        kpis: {
          totalDistricts: 'Totale distrikter',
          active: 'Aktive',
          systemUptime: 'System oppetid',
          totalChildren: 'Totale barn',
          complianceScore: 'Compliance score'
        },
        tabs: {
          systemOverview: 'Systemoversikt',
          governance: 'Styring',
          operations: 'Drift',
          monitoring: 'Overvåking'
        },
        filters: {
          allModules: 'Alle moduler',
          systemConfig: 'Systemkonfigurasjon',
          governance: 'Styring',
          security: 'Sikkerhet',
          dataManagement: 'Datahåndtering',
          operations: 'Drift',
          analytics: 'Analyse'
        },
        modules: {
          globalSystemConfiguration: {
            title: 'Global systemkonfigurasjon',
            description: 'Systemdekkende parametere, funksjoner og globale innstillinger',
            action: 'Konfigurer'
          },
          districtOversight: {
            title: 'Distriktsoversikt',
            description: 'Overvåk og administrer alle distrikter i kommunen',
            action: 'Konfigurer'
          },
          policyManagement: {
            title: 'Retningslinjer',
            description: 'Definer kommunedekkende retningslinjer og compliance-regler',
            action: 'Konfigurer'
          },
          userRoleTemplates: {
            title: 'Bruker- og rollemaler',
            description: 'Administrer systemdekkende brukerroller og tilgangsmaler',
            action: 'Konfigurer'
          },
          kindergartenClassification: {
            title: 'Barnehageklassifisering',
            description: 'Administrer barnehagetyper, tjenester og hoveddata',
            action: 'Konfigurer'
          },
          placementWindows: {
            title: 'Plasseringsvinduer',
            description: 'Konfigurer søknadsperioder og plasseringsvinduer',
            action: 'Konfigurer'
          },
          featureControlCenter: {
            title: 'Funksjonssentral',
            description: 'Aktiver/deaktiver funksjoner på tvers av alle distrikter',
            action: 'Konfigurer'
          },
          securityCompliance: {
            title: 'Sikkerhet og compliance',
            description: 'GDPR compliance, audit logger og sikkerhetsovervåking',
            action: 'Konfigurer'
          },
          analyticsDashboard: {
            title: 'Analysedashboard',
            description: 'Kommunedekkende analyser og ytelsesmetrikker',
            action: 'Konfigurer'
          },
          dataIntegration: {
            title: 'Dataintegrasjon',
            description: 'Administrer eksterne systemintegrasjoner og dataflyt',
            action: 'Konfigurer'
          },
          communicationCenter: {
            title: 'Kommunikasjonssenter',
            description: 'Administrer systemdekkende kommunikasjon og varsler',
            action: 'Konfigurer'
          },
          systemReleases: {
            title: 'Systemutgivelser',
            description: 'Administrer funksjonsutgivelser og systemoppdateringer',
            action: 'Konfigurer'
          }
        }
      },
      approvals: {
        title: 'Godkjenningsstyring',
        subtitle: 'Administrer timeplaner og plasseringsgodkjenninger',
        requestForReplace: 'Forespørsel om erstatning',
        showOnlyCurrentUnits: 'Vis bare nåværende enheter',
        tabs: {
          foreskola: 'Förskola',
          fritidshem: 'Fritidshem'
        },
        actions: {
          endRequest: 'Avslutt forespørsel',
          requestForReplace: 'Forespørsel om erstatning',
          rateCategoryAverageTime: 'Rate kategori/Gjennomsnittlig tid',
          timetable: 'Timeplan',
          reasontype: 'Årsakstype',
          leave: 'Permisjon',
          approveReject: 'Godkjenn/avslå'
        },
        table: {
          id: '#',
          status: 'Status',
          replaceUnit: 'Erstatningsenhet',
          currentUnit: 'Nåværende enhet',
          child: 'Barn',
          reqAdmissionEndDate: 'Ønsket opptakssluttdato',
          reqNewAdmissionStartDate: 'Ønsket ny opptaksstartdato',
          reason: 'Årsak',
          submitDate: 'Innsendingsdato',
          requestedBy: 'Forespurt av'
        },
        searchPlaceholder: 'ArnoldPreSchool2 '
      },
      members: {
        title: 'Childcare Member Management',
        subtitle: 'Comprehensive management of childcare admissions and placements',
        showActiveOnly: 'Vis bare aktive medlemmer',
        tabs: {
          children: 'Barn',
          guardians: 'Vårdnadspersoner'
        },
        actions: {
          manageAdmissions: 'Administrer opptak',
          updateRecords: 'Oppdatere registreringer',
          generateReports: 'Generere rapporter',
          exportData: 'Eksporter data'
        },
        searchPlaceholder: 'Søk medlemmer...',
        exportData: 'Eksporter Data'
      }
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})
