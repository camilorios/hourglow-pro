import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CreateProjectDialogProps {
  onCreateProject: (project: {
    name: string;
    description: string;
    plannedHours: number;
    startDate: string;
    endDate: string;
  }) => void;
}

export const CreateProjectDialog = ({ onCreateProject }: CreateProjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [plannedHours, setPlannedHours] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("El nombre del proyecto es requerido");
      return;
    }

    const hours = parseFloat(plannedHours);
    if (isNaN(hours) || hours <= 0) {
      toast.error("Por favor ingrese horas planificadas válidas");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Las fechas de inicio y fin son requeridas");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("La fecha de inicio no puede ser posterior a la fecha de fin");
      return;
    }

    onCreateProject({
      name: name.trim(),
      description: description.trim(),
      plannedHours: hours,
      startDate,
      endDate,
    });

    setName("");
    setDescription("");
    setPlannedHours("");
    setStartDate("");
    setEndDate("");
    setIsOpen(false);
    toast.success("Proyecto creado exitosamente");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-gradient-primary shadow-glow hover:scale-105 transition-transform">
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Crear Nuevo Proyecto</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-4">
          <div>
            <Label htmlFor="name">Nombre del Proyecto</Label>
            <Input
              id="name"
              placeholder="Ej: Desarrollo Web Corporativo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe brevemente el proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="hours">Horas Planificadas</Label>
            <Input
              id="hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="0.0"
              value={plannedHours}
              onChange={(e) => setPlannedHours(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Tarifa: $50/hora
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Fecha de Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="endDate">Fecha de Fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-gradient-primary">
            Crear Proyecto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
