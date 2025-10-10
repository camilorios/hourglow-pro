import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, DollarSign, MapPin, User, Calendar, Trash2, Building2, Hash, Pencil } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  onUpdateVisit: (id: string, visitData: Omit<Visit, "id">) => void;
}

export const VisitCard = ({ visit, onDeleteVisit, onUpdateVisit }: VisitCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [producto, setProducto] = useState(visit.producto);
  const [pais, setPais] = useState(visit.pais);
  const [consultor, setConsultor] = useState(visit.consultor);
  const [tiempo, setTiempo] = useState(visit.tiempo.toString());
  const [fecha, setFecha] = useState(visit.fecha);
  const [valorOportunidad, setValorOportunidad] = useState(visit.valorOportunidad.toString());
  const [clientName, setClientName] = useState(visit.clientName);
  const [numeroOportunidad, setNumeroOportunidad] = useState(visit.numeroOportunidad);

  const handleDelete = () => {
    onDeleteVisit(visit.id);
    toast.success("Visita comercial eliminada");
  };

  const handleUpdate = () => {
    if (!producto.trim()) {
      toast.error("El producto es requerido");
      return;
    }

    const tiempoNum = parseFloat(tiempo);
    if (isNaN(tiempoNum) || tiempoNum <= 0) {
      toast.error("Por favor ingrese un tiempo válido");
      return;
    }

    const valor = parseFloat(valorOportunidad);
    if (isNaN(valor) || valor <= 0) {
      toast.error("Por favor ingrese un valor de oportunidad válido");
      return;
    }

    if (!fecha) {
      toast.error("La fecha es requerida");
      return;
    }

    onUpdateVisit(visit.id, {
      producto: producto.trim(),
      pais: pais.trim(),
      consultor: consultor.trim(),
      tiempo: tiempoNum,
      fecha,
      valorOportunidad: valor,
      clientName: clientName.trim(),
      numeroOportunidad: numeroOportunidad.trim(),
    });

    setIsEditOpen(false);
    toast.success("Visita comercial actualizada");
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
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="shadow-sm">
                  <Pencil className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Editar Visita Comercial</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 pt-4">
                  <div>
                    <Label htmlFor="edit-producto">Producto</Label>
                    <Input
                      id="edit-producto"
                      placeholder="Ej: Solución Cloud"
                      value={producto}
                      onChange={(e) => setProducto(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-clientName">Nombre del Cliente</Label>
                      <Input
                        id="edit-clientName"
                        placeholder="Ej: TechCorp S.A."
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-numeroOportunidad">Número de Oportunidad</Label>
                      <Input
                        id="edit-numeroOportunidad"
                        placeholder="Ej: OPP-2025-001"
                        value={numeroOportunidad}
                        onChange={(e) => setNumeroOportunidad(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-pais">País</Label>
                      <Input
                        id="edit-pais"
                        placeholder="Ej: Colombia"
                        value={pais}
                        onChange={(e) => setPais(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-consultor">Consultor</Label>
                      <Input
                        id="edit-consultor"
                        placeholder="Ej: Juan Pérez"
                        value={consultor}
                        onChange={(e) => setConsultor(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-tiempo">Tiempo (horas)</Label>
                      <Input
                        id="edit-tiempo"
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="0.0"
                        value={tiempo}
                        onChange={(e) => setTiempo(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-fecha">Fecha</Label>
                      <Input
                        id="edit-fecha"
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-valorOportunidad">Valor Oportunidad ($)</Label>
                    <Input
                      id="edit-valorOportunidad"
                      type="number"
                      step="1000"
                      min="0"
                      placeholder="0.00"
                      value={valorOportunidad}
                      onChange={(e) => setValorOportunidad(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <Button onClick={handleUpdate} className="w-full bg-gradient-primary">
                    Actualizar Visita
                  </Button>
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