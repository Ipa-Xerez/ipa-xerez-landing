import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";

interface EventCalendarExportProps {
  event: {
    id: number;
    title: string;
    description?: string;
    date: Date;
    location?: string;
  };
}

export default function EventCalendarExport({ event }: EventCalendarExportProps) {
  // Generate iCal format
  const generateIcal = () => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//IPA Xerez//Event Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:event-${event.id}@ipaxerez.es
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
LOCATION:${event.location || ""}
END:VEVENT
END:VCALENDAR`;

    return icalContent;
  };

  // Generate Google Calendar URL
  const generateGoogleCalendarUrl = () => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      details: event.description || "",
      location: event.location || "",
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Generate Outlook URL
  const generateOutlookUrl = () => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatOutlookDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    const params = new URLSearchParams({
      rru: "addevent",
      summary: event.title,
      description: event.description || "",
      location: event.location || "",
      startdt: formatOutlookDate(startDate),
      enddt: formatOutlookDate(endDate),
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  // Download iCal file
  const downloadIcal = () => {
    const icalContent = generateIcal();
    const blob = new Blob([icalContent], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, "-")}.ics`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        size="sm"
        variant="outline"
        onClick={() => window.open(generateGoogleCalendarUrl(), "_blank")}
        className="flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        Google Calendar
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => window.open(generateOutlookUrl(), "_blank")}
        className="flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        Outlook
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={downloadIcal}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Descargar iCal
      </Button>
    </div>
  );
}
