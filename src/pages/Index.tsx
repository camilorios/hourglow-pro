import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { DashboardStats } from "@/components/DashboardStats";
import tigoLogo from "@/assets/tigo-business-logo.png";

interface Project {
  id: string;
  name: string;
  description: string;
  plannedHours: number;
  executedHours: number;
  hourlyRate: number;
  startDate: string;
  endDate: string;
  clientName: string;
  consultant: string;
  pm: string;
  country: string;
}

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Desarrollo Web Corporativo",
      description: "Sitio web completo para empresa de tecnología con panel de administración",
      plannedHours: 120,
      executedHours: 85,
      hourlyRate: 50,
      startDate: "2025-01-01",
      endDate: "2025-03-15",
      clientName: "TechCorp S.A.",
      consultant: "Ana García",
      pm: "Carlos Ruiz",
      country: "Chile",
    },
    {
      id: "2",
      name: "App Móvil E-commerce",
      description: "Aplicación móvil para tienda online con integración de pagos",
      plannedHours: 200,
      executedHours: 150,
      hourlyRate: 50,
      startDate: "2024-12-01",
      endDate: "2025-04-30",
      clientName: "ShopNow Inc.",
      consultant: "Pedro Martínez",
      pm: "Laura Sánchez",
      country: "México",
    },
    {
      id: "3",
      name: "Sistema de Gestión",
      description: "Software de gestión interna para control de inventario y ventas",
      plannedHours: 160,
      executedHours: 95,
      hourlyRate: 50,
      startDate: "2025-01-15",
      endDate: "2025-05-20",
      clientName: "Retail Plus",
      consultant: "Jorge López",
      pm: "María González",
      country: "Colombia",
    },
  ]);

  const handleCreateProject = (projectData: {
    name: string;
    description: string;
    plannedHours: number;
    startDate: string;
    endDate: string;
    clientName: string;
    consultant: string;
    pm: string;
    country: string;
    hourlyRate: number;
  }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      ...projectData,
      executedHours: 0,
    };
    setProjects([...projects, newProject]);
  };

  const handleUpdateHours = (id: string, hoursToAdd: number) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, executedHours: project.executedHours + hoursToAdd }
          : project
      )
    );
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const totalPlannedHours = projects.reduce((sum, p) => sum + p.plannedHours, 0);
  const totalExecutedHours = projects.reduce((sum, p) => sum + p.executedHours, 0);
  const totalRevenue = projects.reduce((sum, p) => sum + p.executedHours * p.hourlyRate, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={tigoLogo} 
            alt="Tigo Business" 
            className="h-16 md:h-20 object-contain"
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Gestión de Proyectos
              </h1>
              <p className="text-muted-foreground">
                Control y seguimiento de horas por proyecto
              </p>
            </div>
            <CreateProjectDialog onCreateProject={handleCreateProject} />
          </div>

          <DashboardStats
            totalProjects={projects.length}
            totalPlannedHours={totalPlannedHours}
            totalExecutedHours={totalExecutedHours}
            totalRevenue={totalRevenue}
          />
        </div>

        {/* Projects Grid */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Proyectos Activos
          </h2>
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No hay proyectos registrados
              </p>
              <p className="text-sm text-muted-foreground">
                Crea tu primer proyecto para comenzar
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onUpdateHours={handleUpdateHours}
                  onUpdateProject={handleUpdateProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
