import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, DollarSign, MapPin, User, Calendar, Trash2, Building2, Hash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Visit {
  id: string;
  producto: string;
  pais: string;
  consultor: string;
  tiempo: number;
  fecha: string;
  valorOportunidad: number;
  clientName: string;
  numeroOportunidad: string;
}

interface VisitCardProps {
  visit: Visit;
  onDeleteVisit: (id: string) => void;
}

export const VisitCard = ({ visit, onDeleteVisit }: VisitCardProps) => {
  const handleDelete = () => {
    onDeleteVisit(visit.id);
    toast.success("Visita comercial eliminada");
  };

  return (
    <Card className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300 border-border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-6">
          {/* Left Section: Visit Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground truncate">{visit.producto}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              {visit.clientName && (
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Cliente:</span> 
                  <span className="font-medium">{visit.clientName}</span>
                </div>
              )}
              {visit.numeroOportunidad && (
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Oportunidad:</span> 
                  <span className="font-medium">{visit.numeroOportunidad}</span>
                </div>
              )}
              {visit.pais && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">País:</span> 
                  <span className="font-medium">{visit.pais}</span>
                </div>
              )}
              {visit.consultor && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Consultor:</span> 
                  <span className="font-medium">{visit.consultor}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Fecha:</span>
                <span className="font-medium">{new Date(visit.fecha).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Center Section: Stats */}
          <div className="flex items-center gap-6 px-6 border-l border-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tiempo</p>
                <p className="text-sm font-semibold text-foreground">{visit.tiempo}h</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-success/10">
                <DollarSign className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Oportunidad</p>
                <p className="text-sm font-semibold text-foreground">${visit.valorOportunidad.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex gap-2 shrink-0">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" className="shadow-sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente la visita comercial.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </Card>
  );
};