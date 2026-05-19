import { useState, useRef, useEffect } from "react";
import { Bell, Check, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { useNotificationStore } from "@/store/notification.store";
import { cn } from "@/lib/utils";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const { setUnreadCount, unreadCount } = useNotificationStore();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
    refetchInterval: 60000, // Poll every minute
  });

  const { data: countData } = useQuery({
    queryKey: ["unread-count"],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (countData !== undefined) {
      setUnreadCount(countData.count || 0);
    }
  }, [countData, setUnreadCount]);

  const readMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unread-count"]);
    }
  });

  const readAllMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unread-count"]);
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card rounded-xl shadow-xl border py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/20">
            <h3 className="font-bold text-sm">Notifications</h3>
            <button 
              onClick={() => readAllMutation.mutate()}
              className="text-xs text-primary hover:underline font-medium"
            >
              Mark all as read
            </button>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications?.data?.length > 0 ? (
              <div className="flex flex-col">
                {notifications.data.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => !notif.is_read && readMutation.mutate(notif.id)}
                    className={cn(
                      "px-4 py-3 border-b last:border-0 hover:bg-secondary/50 cursor-pointer transition-colors relative group",
                      !notif.is_read ? "bg-primary/5" : ""
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn("text-sm", !notif.is_read ? "font-bold" : "font-medium")}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                    
                    {!notif.is_read && (
                      <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                <div className="bg-muted p-3 rounded-full mb-3 text-muted-foreground">
                  <Bell size={24} />
                </div>
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">You have no new notifications.</p>
              </div>
            )}
          </div>
          
          <div className="border-t px-4 py-2 text-center bg-muted/10">
            <button className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
              View Notification History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
