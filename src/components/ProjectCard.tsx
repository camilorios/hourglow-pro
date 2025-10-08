import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, DollarSign, TrendingUp, Plus, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description: string;
  plannedHours: number;
  executedHours: number;
  hourlyRate: number;
  startDate: string;
  endDate: string;
}

interface ProjectCardProps {
  project: Project;
  onUpdateHours: (id: string, hours: number) => void;
}

export const ProjectCard = ({ project, onUpdateHours }: ProjectCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoursToAdd, setHoursToAdd] = useState("");

  const progress = (project.executedHours / project.plannedHours) * 100;
  const totalCost = project.executedHours * project.hourlyRate;
  const estimatedCost = project.plannedHours * project.hourlyRate;
  const isOverBudget = project.executedHours > project.plannedHours;

  // Calculate time-based status
  const now = new Date();
  const start = new Date(project.startDate);
  const end = new Date(project.endDate);
  const totalDuration = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  const timeProgress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  
  const getProjectStatus = () => {
    if (now < start) {
      return { label: "Pendiente", variant: "secondary" as const, icon: Clock };
    }
    if (now > end) {
      return progress >= 100 
        ? { label: "Completado", variant: "default" as const, icon: TrendingUp }
        : { label: "Retrasado", variant: "destructive" as const, icon: AlertCircle };
    }
    
    // Project is in progress
    if (progress < timeProgress - 10) {
      return { label: "Atrasado", variant: "destructive" as const, icon: AlertCircle };
    } else if (progress > timeProgress + 10) {
      return { label: "Adelantado", variant: "default" as const, icon: TrendingUp };
    } else {
      return { label: "En Progreso", variant: "outline" as const, icon: Clock };
    }
  };

  const status = getProjectStatus();
  const StatusIcon = status.icon;

  const handleAddHours = () => {
    const hours = parseFloat(hoursToAdd);
    if (isNaN(hours) || hours <= 0) {
      toast.error("Por favor ingrese un número válido de horas");
      return;
    }
    onUpdateHours(project.id, hours);
    setHoursToAdd("");
    setIsOpen(false);
    toast.success(`${hours} horas agregadas al proyecto`);
  };

  return (
    <Card className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300 border-border overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
              <Badge variant={status.variant} className="gap-1">
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(project.startDate).toLocaleDateString()}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(project.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary shadow-sm hover:shadow-glow">
                <Plus className="w-4 h-4 mr-1" />
                Horas
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Horas</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="hours">Horas trabajadas</Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="0.0"
                    value={hoursToAdd}
                    onChange={(e) => setHoursToAdd(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <Button onClick={handleAddHours} className="w-full bg-gradient-primary">
                  Agregar Horas
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso</span>
              <span className={`font-semibold ${isOverBudget ? 'text-warning' : 'text-success'}`}>
                {project.executedHours} / {project.plannedHours} hrs
              </span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Planificado</p>
                <p className="text-sm font-semibold text-foreground">{project.plannedHours}h</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ejecutado</p>
                <p className="text-sm font-semibold text-foreground">{project.executedHours}h</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <DollarSign className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Costo</p>
                <p className="text-sm font-semibold text-foreground">${totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {isOverBudget && (
            <div className="mt-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-xs text-warning font-medium">
                ⚠️ Proyecto sobre presupuesto: ${(totalCost - estimatedCost).toLocaleString()} adicionales
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
