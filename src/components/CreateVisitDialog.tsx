import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";

interface CreateVisitDialogProps {
  onCreateVisit: (visit: {
    producto: string;
    pais: string;
    consultor: string;
    tiempo: number;
    fecha: string;
    valorOportunidad: number;
  }) => void;
}

export const CreateVisitDialog = ({ onCreateVisit }: CreateVisitDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [producto, setProducto] = useState("");
  const [pais, setPais] = useState("");
  const [consultor, setConsultor] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [fecha, setFecha] = useState("");
  const [valorOportunidad, setValorOportunidad] = useState("");

  const handleSubmit = () => {
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

    onCreateVisit({
      producto: producto.trim(),
      pais: pais.trim(),
      consultor: consultor.trim(),
      tiempo: tiempoNum,
      fecha,
      valorOportunidad: valor,
    });

    setProducto("");
    setPais("");
    setConsultor("");
    setTiempo("");
    setFecha("");
    setValorOportunidad("");
    setIsOpen(false);
    toast.success("Visita comercial registrada exitosamente");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-gradient-primary shadow-glow hover:scale-105 transition-transform">
          <Briefcase className="w-5 h-5 mr-2" />
          Visita Comercial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Registrar Visita Comercial</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-4">
          <div>
            <Label htmlFor="producto">Producto</Label>
            <Input
              id="producto"
              placeholder="Ej: Solución Cloud"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pais">País</Label>
              <Input
                id="pais"
                placeholder="Ej: Colombia"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="consultor">Consultor</Label>
              <Input
                id="consultor"
                placeholder="Ej: Juan Pérez"
                value={consultor}
                onChange={(e) => setConsultor(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tiempo">Tiempo (horas)</Label>
              <Input
                id="tiempo"
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
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="valorOportunidad">Valor Oportunidad ($)</Label>
            <Input
              id="valorOportunidad"
              type="number"
              step="1000"
              min="0"
              placeholder="0.00"
              value={valorOportunidad}
              onChange={(e) => setValorOportunidad(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full bg-gradient-primary">
            Registrar Visita
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};