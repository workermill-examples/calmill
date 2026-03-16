import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/slots";
import { z } from "zod";

// Validation schema for query parameters
const SlotsQuerySchema = z.object({
  eventTypeId: z.string().min(1, "Event type ID is required"),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
  timezone: z.string().min(1, "Timezone is required"),
});

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      eventTypeId: searchParams.get("eventTypeId"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      timezone: searchParams.get("timezone"),
    };

    const validatedParams = SlotsQuerySchema.parse(queryParams);

    // Validate date range
    const startDate = new Date(validatedParams.startDate);
    const endDate = new Date(validatedParams.endDate);

    if (startDate > endDate) {
      return NextResponse.json(
        {
          error: "validation",
          message: "Start date must be before or equal to end date",
        },
        { status: 400 },
      );
    }

    // Limit date range to prevent excessive queries (max 30 days)
    const maxDays = 30;
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff > maxDays) {
      return NextResponse.json(
        {
          error: "validation",
          message: `Date range cannot exceed ${maxDays} days`,
        },
        { status: 400 },
      );
    }

    // Validate timezone string (basic check)
    try {
      Intl.DateTimeFormat(undefined, { timeZone: validatedParams.timezone });
    } catch (error) {
      return NextResponse.json(
        { error: "validation", message: "Invalid timezone" },
        { status: 400 },
      );
    }

    // Get available slots
    const slots = await getAvailableSlots(validatedParams);

    // Return with cache headers (60 seconds)
    return NextResponse.json(
      { slots },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error in slots API:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "validation",
          message: "Invalid query parameters",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "internal", message: "Failed to get available slots" },
      { status: 500 },
    );
  }
}
