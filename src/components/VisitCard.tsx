import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, DollarSign, MapPin, User, Calendar, Trash2, Check, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
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

interface Observation {
  id: string;
  text: string;
  date: string;
}

interface Visit {
  id: string;
  producto: string;
  pais: string;
  consultor: string;
  tiempo: number;
  fecha: string;
  valorOportunidad: number;
  numeroOportunidad: string;
  observaciones: Observation[];
  terminado: boolean;
}

interface VisitCardProps {
  visit: Visit;
  onDeleteVisit: (id: string) => void;
  onUpdateVisit: (id: string, updates: Partial<Visit>) => void;
}

export const VisitCard = ({ visit, onDeleteVisit, onUpdateVisit }: VisitCardProps) => {
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [newObservation, setNewObservation] = useState("");

  const handleDelete = () => {
    onDeleteVisit(visit.id);
    toast.success("Visita comercial eliminada");
  };

  const handleToggleTerminado = () => {
    onUpdateVisit(visit.id, { terminado: !visit.terminado });
    toast.success(visit.terminado ? "Visita marcada como activa" : "Visita marcada como terminada");
  };

  const handleAddObservation = () => {
    if (!newObservation.trim()) {
      toast.error("La observación no puede estar vacía");
      return;
    }
    const observation: Observation = {
      id: Date.now().toString(),
      text: newObservation.trim(),
      date: new Date().toISOString(),
    };
    onUpdateVisit(visit.id, {
      observaciones: [...visit.observaciones, observation],
    });
    setNewObservation("");
    toast.success("Observación agregada");
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
              {visit.terminado && (
                <Badge variant="default" className="gap-1 shrink-0 bg-success ml-auto">
                  <Check className="w-3 h-3" />
                  Terminada
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              {visit.numeroOportunidad && (
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">N° Oportunidad:</span> 
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
            <Button 
              size="sm" 
              variant={visit.terminado ? "outline" : "default"}
              className="shadow-sm"
              onClick={handleToggleTerminado}
            >
              <Check className="w-4 h-4 mr-1" />
              {visit.terminado ? "Reactivar" : "Terminar"}
            </Button>
            <Dialog open={isObservationOpen} onOpenChange={setIsObservationOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="shadow-sm">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Observaciones ({visit.observaciones.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Observaciones de la Visita</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="observation">Nueva Observación</Label>
                    <Textarea
                      id="observation"
                      placeholder="Escribe tu observación..."
                      value={newObservation}
                      onChange={(e) => setNewObservation(e.target.value)}
                      className="mt-2 min-h-[80px]"
                    />
                    <Button onClick={handleAddObservation} className="w-full mt-2 bg-gradient-primary">
                      Agregar Observación
                    </Button>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Historial</h4>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {visit.observaciones.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No hay observaciones registradas
                        </p>
                      ) : (
                        visit.observaciones.map((obs) => (
                          <div key={obs.id} className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm text-foreground mb-1">{obs.text}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(obs.date).toLocaleString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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