import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface RideTypeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  estimatedTime: string;
  selected: boolean;
  onClick: () => void;
}

export const RideTypeCard = ({
  icon: Icon,
  title,
  description,
  estimatedTime,
  selected,
  onClick,
}: RideTypeCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2",
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "p-3 rounded-xl transition-colors",
            selected ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          <p className="text-xs font-medium text-primary">{estimatedTime}</p>
        </div>
      </div>
    </Card>
  );
};
