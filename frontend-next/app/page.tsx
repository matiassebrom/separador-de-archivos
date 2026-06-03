"use client";

import { useState } from "react";
import { StepBar } from "@/components/StepBar";
import { FileDropWidget } from "@/components/widgets/FileDropWidget";
import { ColumnSelectorWidget } from "@/components/widgets/ColumnSelectorWidget";
import { FilterWidget } from "@/components/widgets/FilterWidget";
import { ColumnChecklist } from "@/components/widgets/ColumnChecklist";
import { DownloadWidget } from "@/components/widgets/DownloadWidget";
import { useAppStateContext } from "@/context/AppStateContext";
import { ExcelRow, FilterConfig } from "@/lib/types";

const STEPS = [
  { id: 1, label: "Cargar archivo",       description: "Subí el Excel que querés separar. Se procesa en el navegador, sin subir a ningún servidor." },
  { id: 2, label: "Separar por",          description: "Elegí la columna cuyos valores únicos van a determinar los archivos de salida." },
  { id: 3, label: "Filtrar filas",        description: "Conservá solo las filas que cumplan una condición. Este paso es opcional." },
  { id: 4, label: "Seleccionar columnas", description: "Elegí qué columnas incluir en cada archivo de salida." },
  { id: 5, label: "Exportar",             description: "Configurá el nombre base y descargá el ZIP con todos los archivos separados." },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const { dispatch } = useAppStateContext();

  const handleFileLoaded = async (data: { headers: string[]; rows: ExcelRow[]; filename: string }) => {
    dispatch({ type: "SET_FILE_DATA", payload: data });
    dispatch({ type: "SET_BASE_NAME", payload: data.filename.replace(/\.xlsx?$/i, "") });
    setCurrentStep(2);
  };

  const handleColumnChosen = (col: string) => {
    dispatch({ type: "SET_SEPARATE_BY", payload: col });
    setCurrentStep(3);
  };

  const handleFilterChosen = (filter: FilterConfig | null) => {
    dispatch({ type: "SET_FILTER", payload: filter });
    setCurrentStep(4);
  };

  const handleColumnsChosen = (cols: string[]) => {
    dispatch({ type: "SET_KEEP_COLS", payload: cols });
    setCurrentStep(5);
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
    setCurrentStep(0);
  };

  return (
    <div className="h-screen flex flex-col bg-mr-bg text-mr-fg font-space overflow-hidden">
      {currentStep > 0 && <StepBar steps={STEPS} currentStep={currentStep} />}
      <main className="flex-1 overflow-y-auto mr-scroll px-[72px] py-[48px]">
        {currentStep === 0 && (
          <WelcomeScreen steps={STEPS} onStart={() => setCurrentStep(1)} />
        )}
        {currentStep === 1 && (
          <StepWrapper stepNum={1} title="Cargar archivo" description={STEPS[0].description}>
            <FileDropWidget onFileLoaded={handleFileLoaded} />
          </StepWrapper>
        )}
        {currentStep === 2 && (
          <StepWrapper stepNum={2} title="Columna de separación" description={STEPS[1].description} onBack={() => setCurrentStep(1)}>
            <ColumnSelectorWidget onColumnChosen={handleColumnChosen} />
          </StepWrapper>
        )}
        {currentStep === 3 && (
          <StepWrapper stepNum={3} title="Filtrar filas" description={STEPS[2].description} onBack={() => setCurrentStep(2)}>
            <FilterWidget onFilterChosen={handleFilterChosen} />
          </StepWrapper>
        )}
        {currentStep === 4 && (
          <StepWrapper stepNum={4} title="Seleccionar columnas" description={STEPS[3].description} onBack={() => setCurrentStep(3)}>
            <ColumnChecklist onColumnsChosen={handleColumnsChosen} />
          </StepWrapper>
        )}
        {currentStep === 5 && (
          <StepWrapper stepNum={5} title="Exportar" description={STEPS[4].description} onBack={() => setCurrentStep(4)} onReset={handleReset}>
            <DownloadWidget onDownloadComplete={() => {}} />
          </StepWrapper>
        )}
      </main>
    </div>
  );
}

interface Step {
  id: number;
  label: string;
  description: string;
}

interface WelcomeScreenProps {
  steps: Step[];
  onStart: () => void;
}

function WelcomeScreen({ steps, onStart }: WelcomeScreenProps) {
  return (
    <div className="max-w-[640px] w-full mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        {steps.map((step) => (
          <div key={step.id} className="flex gap-4 items-start">
            <span className="w-7 h-7 rounded-full bg-mr-surface-3 flex items-center justify-center mono text-[11px] font-medium text-mr-dim shrink-0 mt-0.5">
              {step.id}
            </span>
            <div>
              <p className="text-[14px] font-medium text-mr-fg leading-snug">{step.label}</p>
              <p className="text-[13px] text-mr-muted-2 font-light mt-0.5">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onStart}
        className="self-start bg-mr-blue hover:bg-mr-blue-lo text-white rounded-[6px] px-6 py-2.5 text-[14px] font-medium transition-colors cursor-pointer"
      >
        Iniciar
      </button>
    </div>
  );
}

interface StepWrapperProps {
  stepNum: number;
  title: string;
  description: string;
  children: React.ReactNode;
  onBack?: () => void;
  onReset?: () => void;
}

function StepWrapper({ stepNum, title, description, children, onBack, onReset }: StepWrapperProps) {
  return (
    <div className="max-w-[640px] w-full mx-auto flex flex-col gap-6">
      <div>
        <p className="mono text-[11px] text-mr-blue-hi tracking-[1.4px] mb-2">PASO {stepNum}</p>
        <h1 className="text-[28px] font-medium tracking-[-0.8px] leading-[1.1]">{title}</h1>
        <p className="mt-3 text-[14px] text-mr-muted-2 font-light">{description}</p>
      </div>
      {children}
      {(onBack || onReset) && (
        <div className="flex gap-3 pt-2">
          {onBack && (
            <button
              onClick={onBack}
              className="border border-mr-border text-mr-fg-2 hover:bg-mr-surface hover:text-mr-fg rounded-[6px] px-4 py-2 text-[14px] transition-colors cursor-pointer"
            >
              Atras
            </button>
          )}
          {onReset && (
            <button
              onClick={onReset}
              className="border border-mr-border text-mr-muted-2 hover:bg-mr-surface hover:text-mr-fg rounded-[6px] px-4 py-2 text-[14px] transition-colors cursor-pointer"
            >
              Empezar de nuevo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
