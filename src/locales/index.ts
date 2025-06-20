import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    common: {
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
        current: 'Current'
      },
      unread: 'Unread',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      child: 'Child',
      duration: 'Duration',
      today: 'Today',
      thisWeek: 'This Week'
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
    }
  },
  no: {
    common: {
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
        current: 'Nåværende'
      },
      unread: 'Ulest',
      profile: 'Profil',
      settings: 'Innstillinger',
      logout: 'Logg ut',
      child: 'Barn',
      duration: 'Varighet',
      today: 'I dag',
      thisWeek: 'Denne uken'
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
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
}) 