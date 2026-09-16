/**
 * demoData.js
 *
 * Large-scale deterministic demo dataset.
 *
 * Generated dataset:
 * - 1,000 students
 * - 100 teachers
 * - 20 courses
 * - 3,000+ enrollments
 * - 5,000+ assignments
 * - 3,000+ quizzes
 * - 5,000+ payments
 * - 5,000+ transactions
 * - 5,000+ notifications
 *
 * No external dependencies required.
 */

/* ============================================================
   DEMO AUTH
============================================================ */

export const demoCredentials = {
  password: 'DemoPass123!',
};


/* ============================================================
   SEEDED RANDOM GENERATOR
   Keeps generated data stable between refreshes.
============================================================ */

let seed = 20260913;

const random = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const randomInt = (min, max) =>
  Math.floor(random() * (max - min + 1)) + min;

const randomItem = (array) =>
  array[Math.floor(random() * array.length)];

const chance = (percentage) =>
  random() * 100 < percentage;


/* ============================================================
   DATE HELPERS
============================================================ */

const pad = (value) => String(value).padStart(2, '0');

const formatDate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;

const formatDateTime = (date) =>
  `${formatDate(date)}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:00`;

const randomDate = (start, end) => {
  const time =
    start.getTime() +
    random() * (end.getTime() - start.getTime());

  return new Date(time);
};

const today = new Date('2026-09-13T10:00:00');

const enrollmentStart = new Date('2026-01-10T00:00:00');
const enrollmentEnd = new Date('2026-09-10T00:00:00');

const pastYear = new Date('2025-09-01T00:00:00');


/* ============================================================
   NAME DATA
============================================================ */

const firstNames = [
  'Brandon',
  'Amina',
  'Theo',
  'Lena',
  'Brian',
  'Grace',
  'Daniel',
  'Faith',
  'Kevin',
  'Mercy',
  'Samuel',
  'Esther',
  'David',
  'Naomi',
  'James',
  'Joy',
  'Michael',
  'Ann',
  'Peter',
  'Wanjiku',
  'Brian',
  'Sheila',
  'Collins',
  'Diana',
  'Eric',
  'Irene',
  'Victor',
  'Purity',
  'Dennis',
  'Cynthia',
  'Joseph',
  'Sarah',
  'Alex',
  'Emily',
  'Martin',
  'Lucy',
  'Patrick',
  'Ruth',
  'George',
  'Mercy',
  'Ian',
  'Stella',
  'Mark',
  'Caroline',
  'Andrew',
  'Beatrice',
  'Moses',
  'Hannah',
  'Joshua',
  'Tabitha',
];

const lastNames = [
  'Carter',
  'Yusuf',
  'Williams',
  'Okoro',
  'Kamau',
  'Otieno',
  'Mwangi',
  'Wanjiru',
  'Kiptoo',
  'Cheruiyot',
  'Ochieng',
  'Njoroge',
  'Mutua',
  'Kipchoge',
  'Maina',
  'Kariuki',
  'Odhiambo',
  'Kimani',
  'Koech',
  'Barasa',
  'Omondi',
  'Kilonzo',
  'Muthoni',
  'Wekesa',
  'Chebet',
  'Njenga',
  'Were',
  'Mugendi',
  'Musyoka',
  'Kiplagat',
  'Onyango',
  'Mbugua',
  'Atieno',
  'Nyambura',
  'Moraa',
  'Wambui',
  'Gitau',
  'Kiprotich',
  'Abdi',
  'Hassan',
];


/* ============================================================
   COURSES
============================================================ */

export const courses = [
  {
    id: 1,
    courses: 'Foundations of Computer Science',
    department: 'Computer Science',
    level: 'Beginner',
    duration: '12 weeks',
  },
  {
    id: 2,
    courses: 'Creative Problem Solving',
    department: 'General Studies',
    level: 'Beginner',
    duration: '8 weeks',
  },
  {
    id: 3,
    courses: 'Communication for Leaders',
    department: 'Leadership',
    level: 'Intermediate',
    duration: '10 weeks',
  },
  {
    id: 4,
    courses: 'Web Development Fundamentals',
    department: 'Computer Science',
    level: 'Beginner',
    duration: '14 weeks',
  },
  {
    id: 5,
    courses: 'JavaScript Programming',
    department: 'Computer Science',
    level: 'Intermediate',
    duration: '12 weeks',
  },
  {
    id: 6,
    courses: 'Python Programming',
    department: 'Computer Science',
    level: 'Intermediate',
    duration: '12 weeks',
  },
  {
    id: 7,
    courses: 'Database Systems',
    department: 'Computer Science',
    level: 'Intermediate',
    duration: '10 weeks',
  },
  {
    id: 8,
    courses: 'Data Structures and Algorithms',
    department: 'Computer Science',
    level: 'Advanced',
    duration: '14 weeks',
  },
  {
    id: 9,
    courses: 'Digital Literacy',
    department: 'Technology',
    level: 'Beginner',
    duration: '6 weeks',
  },
  {
    id: 10,
    courses: 'Entrepreneurship',
    department: 'Business',
    level: 'Intermediate',
    duration: '8 weeks',
  },
  {
    id: 11,
    courses: 'Financial Literacy',
    department: 'Business',
    level: 'Beginner',
    duration: '8 weeks',
  },
  {
    id: 12,
    courses: 'Project Management',
    department: 'Business',
    level: 'Intermediate',
    duration: '10 weeks',
  },
  {
    id: 13,
    courses: 'UI/UX Design',
    department: 'Design',
    level: 'Intermediate',
    duration: '10 weeks',
  },
  {
    id: 14,
    courses: 'Cybersecurity Fundamentals',
    department: 'Cybersecurity',
    level: 'Intermediate',
    duration: '12 weeks',
  },
  {
    id: 15,
    courses: 'Cloud Computing',
    department: 'Technology',
    level: 'Advanced',
    duration: '12 weeks',
  },
  {
    id: 16,
    courses: 'Artificial Intelligence',
    department: 'Technology',
    level: 'Advanced',
    duration: '14 weeks',
  },
  {
    id: 17,
    courses: 'Critical Thinking',
    department: 'General Studies',
    level: 'Beginner',
    duration: '8 weeks',
  },
  {
    id: 18,
    courses: 'Career Development',
    department: 'Career Services',
    level: 'Intermediate',
    duration: '6 weeks',
  },
  {
    id: 19,
    courses: 'Professional Ethics',
    department: 'Leadership',
    level: 'Intermediate',
    duration: '6 weeks',
  },
  {
    id: 20,
    courses: 'Research Methods',
    department: 'Academic',
    level: 'Advanced',
    duration: '10 weeks',
  },
];


/* ============================================================
   SUBJECTS
============================================================ */

const subjects = [
  'Computer Science',
  'Mathematics',
  'Business',
  'Leadership',
  'Technology',
  'Design',
  'Cybersecurity',
  'Career Development',
  'Academic',
];


/* ============================================================
   STUDENT GENERATOR
============================================================ */

const generateStudent = (index) => {
  const firstName =
    index === 0 ? 'Brandon' : randomItem(firstNames);

  const lastName =
    index === 0 ? 'Carter' : randomItem(lastNames);

  const id = 101 + index;

  const progress = randomInt(15, 100);

  let grade = 'Not graded';

  if (progress >= 90) grade = 'A';
  else if (progress >= 85) grade = 'A-';
  else if (progress >= 80) grade = 'B+';
  else if (progress >= 75) grade = 'B';
  else if (progress >= 70) grade = 'B-';
  else if (progress >= 65) grade = 'C+';
  else if (progress >= 60) grade = 'C';
  else if (progress >= 50) grade = 'C-';
  else if (progress >= 40) grade = 'D';

  const status = chance(92)
    ? 'Active'
    : chance(50)
      ? 'Pending'
      : 'Inactive';

  const email =
    `${firstName}.${lastName}.${id}`
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '') +
    '@shiloh.test';

  return {
    id,
    student_id: `SHL-2026-${String(id).padStart(4, '0')}`,
    first_name: firstName,
    last_name: lastName,
    username: `${firstName} ${lastName}`,
    email,
    role: 'student',
    status,
    progress,
    grade,
    phone: `07${randomInt(10, 99)}${randomInt(
      100000,
      999999
    )}`,
    date_of_birth: formatDate(
      randomDate(
        new Date('2000-01-01'),
        new Date('2008-12-31')
      )
    ),
    registration_date: formatDate(
      randomDate(
        new Date('2025-01-01'),
        enrollmentEnd
      )
    ),
    lastActive: chance(70)
      ? 'Today'
      : chance(50)
        ? 'Yesterday'
        : `${randomInt(2, 14)} days ago`,
  };
};


/* ============================================================
   GENERATE 1,000 STUDENTS
============================================================ */

export const students = Array.from(
  { length: 1000 },
  (_, index) => generateStudent(index)
);


/* ============================================================
   ENROLLMENTS
============================================================ */

export const enrollments = [];

students.forEach((student) => {
  const numberOfCourses = randomInt(2, 5);

  const selectedCourses = [...courses]
    .sort(() => random() - 0.5)
    .slice(0, numberOfCourses);

  selectedCourses.forEach((course, index) => {
    const progress =
      index === 0 && student.id === 101
        ? 68
        : randomInt(5, 100);

    enrollments.push({
      id: enrollments.length + 1,
      student_id: student.id,
      student_name: student.username,
      course_id: course.id,
      course: course.courses,
      enrollment_date: formatDate(
        randomDate(
          enrollmentStart,
          enrollmentEnd
        )
      ),
      progress,
      grade:
        progress >= 85
          ? 'A'
          : progress >= 75
            ? 'B+'
            : progress >= 65
              ? 'B'
              : progress >= 50
                ? 'C'
                : 'Not graded',
      status:
        progress < 20
          ? 'Just started'
          : progress >= 95
            ? 'Completed'
            : 'In progress',
    });
  });
});


/* ============================================================
   ASSIGNMENTS
============================================================ */

const assignmentTitles = [
  'Build a study planner',
  'Problem-solving reflection',
  'Create a project proposal',
  'Complete programming exercises',
  'Database design exercise',
  'Research and analysis report',
  'UI prototype submission',
  'Leadership reflection',
  'Build a responsive website',
  'Python programming challenge',
  'Cybersecurity case study',
  'Business model canvas',
  'Career development plan',
  'Algorithm analysis',
  'Communication presentation',
];

export const assignments = [];

enrollments.forEach((enrollment) => {
  const count = randomInt(1, 2);

  for (let i = 0; i < count; i++) {
    const dueDate = randomDate(
      new Date('2026-09-05'),
      new Date('2026-11-30')
    );

    assignments.push({
      id: assignments.length + 1,
      studentId: enrollment.student_id,
      courseId: enrollment.course_id,
      title: randomItem(assignmentTitles),
      subject:
        courses.find(
          (course) => course.id === enrollment.course_id
        )?.department || randomItem(subjects),
      course: enrollment.course,
      dueDate: formatDate(dueDate),
      status: randomItem([
        'Not started',
        'In progress',
        'Submitted',
        'Graded',
        'Late',
      ]),
      points: randomItem([
        10,
        15,
        20,
        25,
        30,
        40,
        50,
      ]),
      score: randomInt(0, 100),
    });
  }
});


/* ============================================================
   TEACHERS
============================================================ */

export const teachers = Array.from(
  { length: 100 },
  (_, index) => {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);

    const id = 201 + index;

    const subject = randomItem(subjects);

    return {
      id,
      name: `${firstName} ${lastName}`,
      email:
        `${firstName}.${lastName}.${id}`
          .toLowerCase()
          .replace(/[^a-z0-9.]/g, '') +
        '@shiloh.test',
      subject,
      department: subject,
      hire_date: formatDate(
        randomDate(
          new Date('2018-01-01'),
          new Date('2026-01-01')
        )
      ),
      status: chance(94)
        ? 'Active'
        : 'On Leave',
    };
  }
);


/* ============================================================
   QUIZZES
============================================================ */

const quizTitles = [
  'Knowledge check-in',
  'Module assessment',
  'Concept review',
  'Weekly quiz',
  'Practical assessment',
  'End of module quiz',
  'Learning checkpoint',
];

const questionTemplates = [
  {
    text: 'Which approach best supports effective learning?',
    options: [
      'Regular practice',
      'Avoiding feedback',
      'Skipping difficult topics',
    ],
    correctAnswer: 'Regular practice',
  },
  {
    text: 'What is an algorithm?',
    options: [
      'A repeatable set of steps',
      'A hardware device',
      'A file format',
    ],
    correctAnswer: 'A repeatable set of steps',
  },
  {
    text: 'What makes feedback useful?',
    options: [
      'It is specific',
      'It is vague',
      'It is delayed',
    ],
    correctAnswer: 'It is specific',
  },
];

export const quizzes = [];

courses.forEach((course) => {
  for (let i = 0; i < randomInt(2, 4); i++) {
    quizzes.push({
      id: quizzes.length + 1,
      courseId: course.id,
      title: randomItem(quizTitles),
      course: course.courses,
      questions: Array.from(
        { length: randomInt(3, 8) },
        (_, questionIndex) => {
          const question =
            randomItem(questionTemplates);

          return {
            id:
              quizzes.length * 10 +
              questionIndex +
              1,
            text: question.text,
            options: [...question.options],
            correctAnswer:
              question.correctAnswer,
          };
        }
      ),
    });
  }
});


/* ============================================================
   PAYMENTS
============================================================ */

export const payments = [];

students.forEach((student) => {
  const paymentCount = randomInt(2, 6);

  for (let i = 0; i < paymentCount; i++) {
    const amount = randomItem([
      50,
      100,
      150,
      200,
      250,
      300,
      400,
      500,
      750,
      1000,
    ]);

    payments.push({
      id: `PAY-${String(
        payments.length + 1
      ).padStart(6, '0')}`,
      studentId: student.id,
      studentName: student.username,
      description: randomItem([
        'Term tuition',
        'Library subscription',
        'Technology fee',
        'Registration fee',
        'Examination fee',
        'Learning materials',
        'Cafeteria subscription',
      ]),
      amount,
      date: formatDate(
        randomDate(
          pastYear,
          today
        )
      ),
      status: randomItem([
        'Paid',
        'Paid',
        'Paid',
        'Pending',
        'Failed',
      ]),
    });
  }
});


/* ============================================================
   TRANSACTIONS
============================================================ */

export const transactions = Array.from(
  { length: 5000 },
  (_, index) => ({
    id: `TX-${String(index + 1001).padStart(6, '0')}`,
    studentId:
      students[randomInt(0, students.length - 1)].id,
    description: randomItem([
      'Enrollment payment',
      'Tuition payment',
      'Library subscription',
      'Technology fee',
      'Cafeteria subscription',
      'Examination fee',
      'Registration payment',
      'Learning materials',
      'Course upgrade',
      'Late payment',
    ]),
    amount: randomItem([
      10,
      25,
      50,
      75,
      100,
      120,
      180,
      220,
      300,
      420,
      500,
      750,
      1000,
    ]),
    status: randomItem([
      'Completed',
      'Completed',
      'Completed',
      'Pending',
      'Processing',
      'Failed',
    ]),
    date: formatDate(
      randomDate(
        pastYear,
        today
      )
    ),
  })
);


/* ============================================================
   NOTIFICATIONS
============================================================ */

const notificationTemplates = [
  {
    type: 'Course update',
    subject: 'New course material available',
    message:
      'New learning material has been added to your course.',
  },
  {
    type: 'Reminder',
    subject: 'Assignment due soon',
    message:
      'You have an upcoming assignment that requires your attention.',
  },
  {
    type: 'Grade',
    subject: 'New grade available',
    message:
      'Your latest assessment has been graded.',
  },
  {
    type: 'Announcement',
    subject: 'Important academic announcement',
    message:
      'Please review the latest announcement from Academic Operations.',
  },
  {
    type: 'Payment',
    subject: 'Payment confirmation',
    message:
      'Your recent payment has been successfully processed.',
  },
];

export const notifications = Array.from(
  { length: 5000 },
  (_, index) => {
    const template =
      randomItem(notificationTemplates);

    return {
      id: `N-${String(index + 1).padStart(6, '0')}`,
      studentId:
        students[randomInt(0, students.length - 1)].id,
      type: template.type,
      subject: template.subject,
      message: template.message,
      read: chance(65),
      timestamp: formatDateTime(
        randomDate(
          pastYear,
          today
        )
      ),
    };
  }
);


/* ============================================================
   CALENDAR EVENTS
============================================================ */

const eventTitles = [
  'Computer Science workshop',
  'Assignment clinic',
  'Learning community meetup',
  'Career guidance session',
  'Academic advising',
  'Student orientation',
  'Programming workshop',
  'Technology seminar',
  'Leadership seminar',
  'Project presentation',
  'Assessment preparation',
  'Study group',
];

export const calendarEvents = Array.from(
  { length: 500 },
  (_, index) => {
    const date = randomDate(
      new Date('2026-09-01'),
      new Date('2026-12-31')
    );

    const startHour = randomInt(8, 16);

    const start = new Date(date);
    start.setHours(startHour, 0, 0, 0);

    const end = new Date(start);
    end.setMinutes(
      end.getMinutes() +
      randomItem([30, 60, 90, 120])
    );

    return {
      id: `event-${index + 1}`,
      title: randomItem(eventTitles),
      start: formatDateTime(start),
      end: formatDateTime(end),
      location: randomItem([
        'Innovation Lab',
        'Main Hall',
        'Auditorium',
        'Student Hub',
        'Online',
        'Computer Lab',
        'Library',
      ]),
    };
  }
);


/* ============================================================
   GENERAL EVENTS
============================================================ */

export const events = Array.from(
  { length: 250 },
  (_, index) => {
    const date = randomDate(
      new Date('2026-09-01'),
      new Date('2026-12-31')
    );

    return {
      id: `e${index + 1}`,
      title: randomItem([
        'New student welcome',
        'Career pathways panel',
        'Technology workshop',
        'Academic success seminar',
        'Student community meetup',
        'Innovation challenge',
        'Career preparation session',
        'Leadership forum',
        'Alumni networking event',
      ]),
      date: formatDate(date),
      time: randomItem([
        '9:00 AM - 10:30 AM',
        '10:00 AM - 12:00 PM',
        '1:00 PM - 3:00 PM',
        '2:00 PM - 4:00 PM',
        '4:00 PM - 5:30 PM',
      ]),
      location: randomItem([
        'Main Hall',
        'Auditorium',
        'Student Hub',
        'Innovation Lab',
        'Online',
      ]),
      description:
        'Join the Shiloh learning community for an engaging academic and professional development session.',
    };
  }
);


/* ============================================================
   CLASSMATES
============================================================ */

const classmates = students
  .filter((student) => student.id !== 101)
  .map((student) => {
    const enrollment =
      enrollments.find(
        (item) =>
          item.student_id === student.id
      );

    return {
      id: student.id,
      username: student.username,
      email: student.email,
      course:
        enrollment?.course ||
        randomItem(courses).courses,
      progress: student.progress,
    };
  });


/* ============================================================
   ATTENDANCE
============================================================ */

const attendanceTotal = 1000;

const attendance = {
  present: randomInt(75, 90),
  absent: randomInt(4, 12),
  late: randomInt(4, 12),
};


/* ============================================================
   REPORT DATA
============================================================ */

const report = {
  attendance:
    Math.round(
      (attendance.present /
        (attendance.present +
          attendance.absent +
          attendance.late)) *
        100
    ),

  lessonsCompleted: randomInt(12, 35),

  averageGrade: randomInt(68, 94),

  weeklyMinutes: randomInt(90, 420),

  labels: [
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
  ],

  grades: [
    randomInt(65, 85),
    randomInt(68, 88),
    randomInt(70, 90),
    randomInt(72, 94),
    randomInt(75, 96),
  ],
};


/* ============================================================
   DEMO STUDENT
============================================================ */

const demoStudent = students.find(
  (student) => student.id === 101
);


/* ============================================================
   DEMO TEACHER
============================================================ */

const demoTeacher =
  teachers[0];


/* ============================================================
   DEMO ADMIN
============================================================ */

const demoAdmin = {
  id: 301,
  name: 'Jordan Ellis',
  department: 'Academic Operations',
};


/* ============================================================
   DEMO USER OBJECT
============================================================ */

export const demoUsers = {

  /* ==========================================================
     STUDENT
  ========================================================== */

  student: {

    demo: true,

    access_token: 'demo-student-token',

    refresh_token: 'demo-student-refresh-token',

    username: 'Brandon Carter',

    email: 'brandon.demo@shiloh.test',

    role: 'student',

    student: {

      id: 101,

      student_id: 'SHL-2026-0101',

      first_name: 'Brandon',

      last_name: 'Carter',

      enrollments:
        enrollments
          .filter(
            (item) =>
              item.student_id === 101
          )
          .slice(0, 10),

    },

    courses: courses.map(
      ({
        id,
        courses: courseName,
      }) => ({
        id,
        courses: courseName,
      })
    ),

    assignments:
      assignments
        .filter(
          (item) =>
            item.studentId === 101
        )
        .slice(0, 20),

    quizzes,

    classmates,

    report,

    calendarEvents,

    events,

    payments: {

      balance: randomInt(0, 1500),

      totalPaid: randomInt(1000, 5000),

      totalDue: randomInt(2000, 6000),

      nextDue: '2026-09-30',

      invoiceNumber: 'INV-2026-0101',

      history:
        payments
          .filter(
            (payment) =>
              payment.studentId === 101
          )
          .slice(0, 20),

    },

    notifications:
      notifications
        .filter(
          (notification) =>
            notification.studentId === 101
        )
        .slice(0, 30),

  },


  /* ==========================================================
     TEACHER
  ========================================================== */

  teacher: {

    demo: true,

    access_token: 'demo-teacher-token',

    refresh_token: 'demo-teacher-refresh-token',

    username: 'Maya Thompson',

    email: 'maya.demo@shiloh.test',

    role: 'teacher',

    subject: 'Computer Science',

    teacher: {

      id: 201,

      name: 'Maya Thompson',

      subject: 'Computer Science',

      hire_date: '2023-08-14',

      enrollments:
        enrollments
          .filter(
            (item) =>
              item.course.includes(
                'Computer Science'
              )
          )
          .slice(0, 500),

      students:
        students
          .slice(0, 500)
          .map((student) => {

            const enrollment =
              enrollments.find(
                (item) =>
                  item.student_id ===
                  student.id
              );

            return {
              id: student.id,
              student_name:
                student.username,
              email: student.email,
              course:
                enrollment?.course ||
                'Foundations of Computer Science',
              progress:
                student.progress,
              lastActive:
                student.lastActive,
            };

          }),

      notifications:
        notifications
          .slice(0, 100),

      settings: {

        emailNotifications: true,

        weeklyDigest: true,

        availability:
          'Mon - Fri, 9:00 AM - 4:00 PM',

      },

    },

  },


  /* ==========================================================
     ADMIN
  ========================================================== */

  admin: {

    demo: true,

    access_token: 'demo-admin-token',

    refresh_token: 'demo-admin-refresh-token',

    username: 'Jordan Ellis',

    email: 'jordan.demo@shiloh.test',

    role: 'admin',

    admin: demoAdmin,

    students:
      students.map(
        (student) => ({
          id: student.id,
          username: student.username,
          email: student.email,
          role: 'student',
          status: student.status,
        })
      ),

    teachers:
      teachers.map(
        (teacher) => ({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          subject: teacher.subject,
        })
      ),

    attendance,

    transactions,

  },

};


/* ============================================================
   DATASET EXPORT
   Useful for admin dashboards, tables and API simulations.
============================================================ */

export const demoDataset = {

  students,

  teachers,

  courses,

  enrollments,

  assignments,

  quizzes,

  payments,

  notifications,

  calendarEvents,

  events,

  transactions,

  classmates,

  attendance,

};


/* ============================================================
   DATASET STATISTICS
============================================================ */

export const demoDatasetStats = {

  students: students.length,

  teachers: teachers.length,

  courses: courses.length,

  enrollments: enrollments.length,

  assignments: assignments.length,

  quizzes: quizzes.length,

  payments: payments.length,

  notifications: notifications.length,

  calendarEvents: calendarEvents.length,

  events: events.length,

  transactions: transactions.length,

};


/* ============================================================
   DEMO USER ACCESSOR
============================================================ */

export const getDemoUser = (role) => {

  if (!demoUsers[role]) {
    throw new Error(
      `Unknown demo role: ${role}`
    );
  }

  return {
    ...demoUsers[role],
  };

};


// export { demoCredentials };
