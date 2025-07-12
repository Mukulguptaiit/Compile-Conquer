import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: "answer" | "comment" | "mention";
  message: string;
  time: string;
  read: boolean;
}

interface NotificationDropdownProps {
  count: number;
  onClearAll: () => void;
}

export function NotificationDropdown({ count, onClearAll }: NotificationDropdownProps) {
  const notifications: Notification[] = [
    {
      id: "1",
      type: "answer",
      message: "John Doe answered your question about React hooks",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "comment",
      message: "Sarah mentioned you in a comment",
      time: "4 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "mention",
      message: "New comment on your answer",
      time: "1 day ago",
      read: true,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {count > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {count > 9 ? "9+" : count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {count > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Mark all read
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-4 flex flex-col items-start space-y-1 cursor-pointer"
              >
                <div className="flex items-center w-full">
                  <div className={`w-2 h-2 rounded-full mr-3 ${!notification.read ? "bg-primary" : "bg-transparent"}`} />
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-4 text-center">
          <Button variant="link" className="w-full">
            View all notifications
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}