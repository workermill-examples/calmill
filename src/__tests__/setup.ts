import "@testing-library/jest-dom/vitest";

// Mock Prisma client
import { vi } from "vitest";

vi.mock("@/generated/prisma/client", () => ({
  PrismaClient: vi.fn(() => ({
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    eventType: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    booking: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    schedule: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    availability: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    dateOverride: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    team: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    teamMember: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
  // Export enums
  TeamRole: {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
  },
  BookingStatus: {
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    CANCELLED: "CANCELLED",
    REJECTED: "REJECTED",
    RESCHEDULED: "RESCHEDULED",
  },
  SchedulingType: {
    ROUND_ROBIN: "ROUND_ROBIN",
    COLLECTIVE: "COLLECTIVE",
  },
}));

// Mock lib/prisma
vi.mock("@/lib/prisma", () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    eventType: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    booking: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    schedule: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    availability: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    dateOverride: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    team: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    teamMember: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };

  return {
    default: mockPrisma,
    prisma: mockPrisma,
  };
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    toString: vi.fn(),
  })),
  usePathname: vi.fn(() => "/test-path"),
  useParams: vi.fn(() => ({})),
}));

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: vi.fn(({ children }) => children),
}));

// Mock Intl.DateTimeFormat for timezone detection
class MockDateTimeFormat {
  private options: any;

  constructor(locale: any, options: any) {
    // Validate timezone if provided
    if (options && "timeZone" in options) {
      const invalidTimezones = ["Invalid/Timezone", "GMT+5", "America/Invalid"];
      if (
        !options.timeZone ||
        options.timeZone === "" ||
        invalidTimezones.includes(options.timeZone)
      ) {
        throw new RangeError("Invalid time zone specified");
      }
    }
    this.options = options;
  }

  resolvedOptions() {
    return { timeZone: this.options?.timeZone || "America/New_York" };
  }

  format() {
    return "12/25/2023";
  }

  formatToParts() {
    return [
      { type: "month", value: "12" },
      { type: "literal", value: "/" },
      { type: "day", value: "25" },
      { type: "literal", value: "/" },
      { type: "year", value: "2023" },
      { type: "timeZoneName", value: "EST" },
    ];
  }
}

Object.defineProperty(global.Intl, "DateTimeFormat", {
  writable: true,
  value: MockDateTimeFormat,
});

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock lib/utils
vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Mock date-fns
vi.mock("date-fns", () => ({
  format: vi.fn((date: Date, formatStr: string) => {
    if (formatStr === "d") return date.getDate().toString();
    if (formatStr === "h:mm a") {
      // Return time based on the actual date hour
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const minStr = minutes.toString().padStart(2, "0");
      return `${displayHour}:${minStr} ${period}`;
    }
    if (formatStr === "EEEE, MMMM do, yyyy")
      return "Monday, January 15th, 2024";
    if (formatStr === "EEEE, MMM d") return "Monday, Jan 15";
    return date.toISOString();
  }),
  addDays: vi.fn(
    (date: Date, days: number) =>
      new Date(date.getTime() + days * 24 * 60 * 60 * 1000),
  ),
  subDays: vi.fn(
    (date: Date, days: number) =>
      new Date(date.getTime() - days * 24 * 60 * 60 * 1000),
  ),
  startOfMonth: vi.fn(
    (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1),
  ),
  endOfMonth: vi.fn(
    (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0),
  ),
  startOfDay: vi.fn(
    (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate()),
  ),
  endOfDay: vi.fn(
    (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
  ),
  isSameDay: vi.fn(
    (date1: Date, date2: Date) =>
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear(),
  ),
  parseISO: vi.fn((dateStr: string) => {
    try {
      return new Date(dateStr);
    } catch {
      throw new Error("Invalid date");
    }
  }),
  isAfter: vi.fn(
    (date1: Date, date2: Date) => date1.getTime() > date2.getTime(),
  ),
  isBefore: vi.fn(
    (date1: Date, date2: Date) => date1.getTime() < date2.getTime(),
  ),
  isToday: vi.fn((date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }),
  isTomorrow: vi.fn(() => false),
  isYesterday: vi.fn(() => false),
}));

// Mock @generated/prisma (without /client)
vi.mock("@/generated/prisma", () => ({
  BookingStatus: {
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    CANCELLED: "CANCELLED",
    REJECTED: "REJECTED",
    RESCHEDULED: "RESCHEDULED",
  },
  TeamRole: {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
  },
  SchedulingType: {
    ROUND_ROBIN: "ROUND_ROBIN",
    COLLECTIVE: "COLLECTIVE",
  },
}));

// Mock @date-fns/tz
vi.mock("@date-fns/tz", () => ({
  TZDate: class TZDate extends Date {
    constructor(date?: string | number | Date, timezone?: string) {
      super(date || new Date());
    }
  },
  toZonedTime: vi.fn((date: Date, timezone: string) => date),
  fromZonedTime: vi.fn((date: Date, timezone: string) => date),
}));
