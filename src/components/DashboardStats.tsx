import { Card } from "@/components/ui/card";
import { Clock, DollarSign, FolderOpen, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalProjects: number;
  totalPlannedHours: number;
  totalExecutedHours: number;
  totalRevenue: number;
}

export const DashboardStats = ({
  totalProjects,
  totalPlannedHours,
  totalExecutedHours,
  totalRevenue,
}: DashboardStatsProps) => {
  const stats = [
    {
      label: "Proyectos Activos",
      value: totalProjects,
      icon: FolderOpen,
      color: "primary",
      bgGradient: "bg-gradient-primary",
    },
    {
      label: "Horas Planificadas",
      value: `${totalPlannedHours}h`,
      icon: Clock,
      color: "accent",
      bgGradient: "bg-gradient-to-br from-accent/20 to-accent/5",
    },
    {
      label: "Horas Ejecutadas",
      value: `${totalExecutedHours}h`,
      icon: TrendingUp,
      color: "success",
      bgGradient: "bg-gradient-success",
    },
    {
      label: "Ingresos Generados",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "warning",
      bgGradient: "bg-gradient-to-br from-warning/20 to-warning/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300 border-border overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${stat.bgGradient}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
