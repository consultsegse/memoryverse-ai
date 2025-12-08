import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  X,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RichNotificationProps {
  id: number;
  type: string;
  title: string;
  message: string;
  imageUrl?: string | null;
  actionUrl?: string | null;
  actionLabel?: string | null;
  priority: "low" | "normal" | "high" | "urgent";
  isRead: boolean;
  createdAt: Date;
  onMarkAsRead?: (id: number) => void;
  onDelete?: (id: number) => void;
  onClick?: (id: number) => void;
}

const priorityConfig = {
  low: {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: Info,
    badge: "bg-gray-500",
  },
  normal: {
    color: "bg-blue-50 text-blue-900 border-blue-200",
    icon: Info,
    badge: "bg-blue-500",
  },
  high: {
    color: "bg-orange-50 text-orange-900 border-orange-200",
    icon: AlertTriangle,
    badge: "bg-orange-500",
  },
  urgent: {
    color: "bg-red-50 text-red-900 border-red-200",
    icon: AlertCircle,
    badge: "bg-red-500",
  },
};

const typeIcons: Record<string, any> = {
  memory_completed: CheckCircle2,
  memory_failed: AlertCircle,
  new_like: "❤️",
  new_comment: "💬",
  payment_success: CheckCircle2,
  payment_failed: AlertCircle,
  system: Info,
  welcome: "🎉",
  milestone: "🏆",
  promotion: "🎁",
};

export function RichNotification({
  id,
  type,
  title,
  message,
  imageUrl,
  actionUrl,
  actionLabel,
  priority,
  isRead,
  createdAt,
  onMarkAsRead,
  onDelete,
  onClick,
}: RichNotificationProps) {
  const config = priorityConfig[priority];
  const PriorityIcon = config.icon;
  const TypeIcon = typeIcons[type];
  const isIconString = typeof TypeIcon === "string";

  const handleClick = () => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(id);
    }
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-md",
        !isRead && "border-l-4",
        !isRead && config.badge,
        isRead && "opacity-75"
      )}
    >
      <div className="flex gap-3 p-4">
        {/* Icon/Image */}
        <div className="flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              config.color
            )}>
              {isIconString ? (
                <span className="text-2xl">{TypeIcon}</span>
              ) : (
                <TypeIcon className="h-6 w-6" />
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm leading-tight">{title}</h4>
            
            {/* Priority Badge */}
            {priority !== "normal" && (
              <Badge variant="secondary" className={cn("text-xs", config.badge, "text-white")}>
                {priority}
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {message}
          </p>

          {/* Timestamp */}
          <p className="text-xs text-gray-400">
            {formatRelativeTime(createdAt)}
          </p>

          {/* Action Button */}
          {actionUrl && actionLabel && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(actionUrl, "_self");
                  handleClick();
                }}
              >
                {actionLabel}
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          {!isRead && onMarkAsRead && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(id);
              }}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-gray-400 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "agora";
  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
