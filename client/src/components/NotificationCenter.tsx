import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCheck, Settings, Filter } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RichNotification } from "./RichNotification";
import { useState } from "react";

type PriorityFilter = "all" | "urgent" | "high" | "normal" | "low";

export function NotificationCenter() {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const { data: notifications = [] } = trpc.notifications.list.useQuery();
  const { data: unreadCount = 0 } = trpc.notifications.unreadCount.useQuery();
  
  const markAsReadMutation = trpc.notifications.markAsReadWithTimestamp.useMutation();
  
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      toast.success("Todas as notificações marcadas como lidas");
    },
  });
  
  const deleteMutation = trpc.notifications.delete.useMutation({
    onSuccess: () => {
      toast.success("Notificação excluída");
    },
  });

  // Filter notifications by priority
  const filteredNotifications = priorityFilter === "all" 
    ? notifications 
    : notifications.filter(n => n.priority === priorityFilter);

  // Separate unread and read notifications
  const unreadNotifications = filteredNotifications.filter(n => !n.isRead);
  const readNotifications = filteredNotifications.filter(n => n.isRead);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0" align="end">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50">
          <div>
            <h3 className="font-semibold text-lg">Notificações</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-600">{unreadCount} não lida{unreadCount > 1 ? 's' : ''}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Marcar todas
            </Button>
            <Link href="/settings/notifications">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="p-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex gap-1 flex-wrap">
              {(["all", "urgent", "high", "normal", "low"] as PriorityFilter[]).map((priority) => (
                <Button
                  key={priority}
                  size="sm"
                  variant={priorityFilter === priority ? "default" : "ghost"}
                  className="h-7 text-xs"
                  onClick={() => setPriorityFilter(priority)}
                >
                  {priority === "all" ? "Todas" : priority}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Notifications List */}
        <Tabs defaultValue="unread" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-none">
            <TabsTrigger value="unread">
              Não lidas ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              Todas ({filteredNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[500px]">
              {unreadNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Nenhuma notificação não lida</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {unreadNotifications.map((notification) => (
                    <RichNotification
                      key={notification.id}
                      id={notification.id}
                      type={notification.type}
                      title={notification.title}
                      message={notification.message}
                      imageUrl={notification.imageUrl}
                      actionUrl={notification.actionUrl}
                      actionLabel={notification.actionLabel}
                      priority={notification.priority}
                      isRead={notification.isRead}
                      createdAt={notification.createdAt}
                      onMarkAsRead={(id) => markAsReadMutation.mutate({ notificationId: id })}
                      onDelete={(id) => deleteMutation.mutate({ notificationId: id })}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[500px]">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {filteredNotifications.map((notification) => (
                    <RichNotification
                      key={notification.id}
                      id={notification.id}
                      type={notification.type}
                      title={notification.title}
                      message={notification.message}
                      imageUrl={notification.imageUrl}
                      actionUrl={notification.actionUrl}
                      actionLabel={notification.actionLabel}
                      priority={notification.priority}
                      isRead={notification.isRead}
                      createdAt={notification.createdAt}
                      onMarkAsRead={(id) => markAsReadMutation.mutate({ notificationId: id })}
                      onDelete={(id) => deleteMutation.mutate({ notificationId: id })}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
