import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const notifications = [
  { id: 1, title: "Nowa awaria", description: "Hack Squat", time: "2 min temu", unread: true },
  { id: 2, title: "Nowa awaria", description: "ISO Chest Press", time: "1 godz. temu", unread: true },
  { id: 3, title: "Błąd płatności", description: "Twoja subskrypcja wygasła.", time: "5 godz. temu", unread: false },
];

export function NotificationCenter() {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-0 h-4 w-4 justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-70 p-0" align="end">

        <ScrollArea className={cn(notifications.length > 0 ? "h-[300px]" : "")}>
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex flex-col gap-1 p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${n.unread ? "pr-4" : ""}`}>
                      {n.title}
                    </span>
                    {n.unread && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {n.description}
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {n.time}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-sm text-muted-foreground">
              Brak nowych powiadomień
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}