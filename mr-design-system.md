# MR Design System

Guia completa para construir y adaptar aplicaciones al ecosistema `mr-tools`.
Cada app debe funcionar embebida en el hub (via iframe) **y** como standalone sin cambios de codigo.

---

## 1. Stack tecnico

| Elemento | Version |
|----------|---------|
| Next.js  | 16.x    |
| React    | 19.x    |
| Tailwind | v4 (via PostCSS) |
| TypeScript | 5.x  |

> IMPORTANTE: Next.js 16 tiene breaking changes respecto a versiones anteriores. Leer `node_modules/next/dist/docs/` antes de escribir cualquier codigo. No asumir que las APIs son identicas a Next.js 13/14/15.

---

## 2. Fonts

Registrar en `layout.tsx` via `next/font/google`:

```typescript
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
```

Aplicar al `<html>`:

```tsx
<html className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}>
```

- **Space Grotesk**: fuente primaria para todo el UI. Clase Tailwind: `font-space`.
- **JetBrains Mono**: etiquetas, tags, metadata, numeros tecnicos. Clase CSS: `.mono`.

---

## 3. globals.css (copiar exacto)

```css
@import "tailwindcss";

:root {
  --mr-bg:        #0a0a0c;
  --mr-bg-2:      #111114;
  --mr-surface:   #16161a;
  --mr-surface-2: #1c1c21;
  --mr-surface-3: #22222a;
  --mr-border:    #26262d;
  --mr-border-2:  #34343d;
  --mr-fg:        #f4f4f5;
  --mr-fg-2:      #d4d4d8;
  --mr-muted:     #a1a1aa;
  --mr-muted-2:   #71717a;
  --mr-dim:       #52525b;
  --mr-blue:      #2563eb;
  --mr-blue-hi:   #3b82f6;
  --mr-blue-lo:   #1d4ed8;
  --mr-blue-soft: rgba(37,99,235,0.12);
  --mr-blue-ring: rgba(37,99,235,0.30);

  --mr-header-h:  56px;
  --mr-sidebar-w: 264px;
}

@theme {
  --color-mr-bg: var(--mr-bg);
  --color-mr-bg-2: var(--mr-bg-2);
  --color-mr-surface: var(--mr-surface);
  --color-mr-surface-2: var(--mr-surface-2);
  --color-mr-surface-3: var(--mr-surface-3);
  --color-mr-border: var(--mr-border);
  --color-mr-border-2: var(--mr-border-2);
  --color-mr-fg: var(--mr-fg);
  --color-mr-fg-2: var(--mr-fg-2);
  --color-mr-muted: var(--mr-muted);
  --color-mr-muted-2: var(--mr-muted-2);
  --color-mr-dim: var(--mr-dim);
  --color-mr-blue: var(--mr-blue);
  --color-mr-blue-hi: var(--mr-blue-hi);
  --color-mr-blue-lo: var(--mr-blue-lo);
  --color-mr-blue-soft: var(--mr-blue-soft);
  --color-mr-blue-ring: var(--mr-blue-ring);

  --font-space: var(--font-space-grotesk), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}

html, body, #root {
  margin: 0; padding: 0;
  height: 100%; width: 100%;
  background: var(--mr-bg);
  color: var(--mr-fg);
  font-family: var(--font-space-grotesk), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

* { box-sizing: border-box; }

.mono {
  font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
}

.mr-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.mr-scroll::-webkit-scrollbar-thumb {
  background: var(--mr-border-2);
  border-radius: 4px;
}
.mr-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.mr-scroll {
  scrollbar-color: var(--mr-border-2) transparent;
  scrollbar-width: thin;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}
```

---

## 4. Paleta de colores

### Fondos (de mas oscuro a mas claro)

| Variable Tailwind       | Hex        | Uso |
|------------------------|------------|-----|
| `bg-mr-bg`             | `#0a0a0c`  | Fondo principal del body y main |
| `bg-mr-bg-2`           | `#111114`  | Sidebar, StepBar, header de app |
| `bg-mr-surface`        | `#16161a`  | Hover de items, cards inactivas |
| `bg-mr-surface-2`      | `#1c1c21`  | Item activo en sidebar |
| `bg-mr-surface-3`      | `#22222a`  | Circulo de step pendiente |

### Bordes

| Variable Tailwind       | Hex        | Uso |
|------------------------|------------|-----|
| `border-mr-border`     | `#26262d`  | Bordes principales (header, cards, separadores) |
| `border-mr-border-2`   | `#34343d`  | Bordes secundarios, scrollbar thumb |

### Texto

| Variable Tailwind       | Hex        | Uso |
|------------------------|------------|-----|
| `text-mr-fg`           | `#f4f4f5`  | Texto principal, activo |
| `text-mr-fg-2`         | `#d4d4d8`  | Texto secundario, steps completados |
| `text-mr-muted`        | `#a1a1aa`  | Iconos, texto de ayuda |
| `text-mr-muted-2`      | `#71717a`  | Texto muy secundario |
| `text-mr-dim`          | `#52525b`  | Steps pendientes, contadores, separadores |

### Azul (accent)

| Variable Tailwind       | Valor                       | Uso |
|------------------------|-----------------------------|-----|
| `bg-mr-blue`           | `#2563eb`                   | Indicador activo, step completado, botones primarios |
| `bg-mr-blue-hi`        | `#3b82f6`                   | Circulo del step actual, links hover |
| `bg-mr-blue-lo`        | `#1d4ed8`                   | Hover de boton primario |
| `bg-mr-blue-soft`      | `rgba(37,99,235,0.12)`      | Fondo del step actual en StepBar |
| `border-mr-blue-ring`  | `rgba(37,99,235,0.30)`      | Ring/outline del step actual |

### Status

| Estado | Background                    | Border                        | Texto      |
|--------|-------------------------------|-------------------------------|------------|
| Live   | `rgba(34,197,94,0.12)`        | `rgba(34,197,94,0.35)`        | `#86efac`  |
| Beta   | `rgba(234,179,8,0.12)`        | `rgba(234,179,8,0.35)`        | `#fde047`  |

---

## 5. Tipografia

| Contexto           | Tamano   | Peso        | Tracking          | Familia |
|--------------------|----------|-------------|-------------------|---------|
| Hero h1            | `40px`   | `font-medium` (500) | `tracking-[-1.2px]` | Space Grotesk |
| Subtitulo hero     | `14px`   | `font-light` (300) | `tracking-[0.1px]` | Space Grotesk |
| Labels secciones   | `10.5px` | `font-medium` | `tracking-[1.4px]` | JetBrains Mono |
| Nombres de app     | `13.5px` | `font-medium` | `tracking-[-0.1px]` | Space Grotesk |
| Taglines           | `11.5px` | normal      | default           | Space Grotesk |
| Texto cuerpo       | `14px`   | `font-light` | `tracking-[0.1px]` | Space Grotesk |
| Tags / badges      | `11px`   | normal      | `tracking-[0.4px]` | JetBrains Mono |
| Status pills       | `11px`   | normal      | `tracking-[0.8px]` | JetBrains Mono |
| Metadata / step    | `11px`   | normal      | `tracking-[0.4px]` | JetBrains Mono |
| Numeros de step    | `10px`   | `font-medium` | default         | JetBrains Mono |

**Regla rapida:** todo lo que sea label, etiqueta, numero, o codigo usa `.mono`. Todo el resto usa `font-space` (default del body).

---

## 6. Componentes compartidos

Copiar este archivo como `src/components/Shared.tsx` en cada app:

```typescript
import React from "react";

interface IconProps {
  className?: string;
}

export function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function MRLogo() {
  return (
    <div className="w-[26px] h-[26px] bg-mr-blue rounded-[6px] flex items-center justify-center text-white font-bold text-[12px] tracking-[-0.4px] font-space shadow-[inset_0_1px_0_rgba(255,255,255,0.22),_0_1px_0_rgba(0,0,0,0.3)]">
      MR
    </div>
  );
}

interface MRTagProps {
  children: React.ReactNode;
  accent?: boolean;
}

export function MRTag({ children, accent }: MRTagProps) {
  return (
    <span className={`mono text-[11px] tracking-[0.4px] px-[8px] py-[3px] rounded-full border lowercase leading-[1.4] whitespace-nowrap ${
      accent
        ? "border-mr-blue-ring bg-mr-blue-soft text-[#93c5fd]"
        : "border-mr-border bg-transparent text-mr-muted"
    }`}>
      {children}
    </span>
  );
}

interface MRDotProps {
  live?: boolean;
}

export function MRDot({ live }: MRDotProps) {
  return (
    <span
      className="inline-block w-[7px] h-[7px] rounded-full shrink-0"
      style={{
        background: live ? "#22c55e" : "#eab308",
        boxShadow: live
          ? "0 0 0 3px rgba(34,197,94,0.18)"
          : "0 0 0 3px rgba(234,179,8,0.18)",
      }}
    />
  );
}

interface StatusPillProps {
  status: "live" | "beta";
}

export function StatusPill({ status }: StatusPillProps) {
  const live = status === "live";
  return (
    <span className={`inline-flex items-center gap-[6px] px-[9px] py-[3px] rounded-full border text-[11px] font-mono tracking-[0.8px] uppercase ${
      live
        ? "bg-[rgba(34,197,94,0.12)] border-[rgba(34,197,94,0.35)] text-[#86efac]"
        : "bg-[rgba(234,179,8,0.12)] border-[rgba(234,179,8,0.35)] text-[#fde047]"
    }`}>
      <span className="w-[6px] h-[6px] rounded-full bg-current" />
      {status}
    </span>
  );
}
```

---

## 7. Componente StepBar

Barra de progreso de pasos. Va **siempre arriba** del contenido de la app (primer elemento dentro del layout, debajo del header en standalone).

**Estados visuales:**

| Estado      | Circulo                                              | Texto                        |
|-------------|------------------------------------------------------|------------------------------|
| Completado  | `bg-mr-blue text-white` con checkmark "✓"           | `text-mr-fg-2`               |
| Actual      | `bg-mr-blue-hi text-white` con ring                  | `text-mr-fg font-medium` + fondo `bg-mr-blue-soft` |
| Pendiente   | `bg-mr-surface-3 text-mr-dim`                        | `text-mr-dim`                |

**Codigo completo - copiar como `src/components/StepBar.tsx`:**

```typescript
import React from "react";

interface Step {
  id: number;
  label: string;
}

interface StepBarProps {
  steps: Step[];
  currentStep: number; // 1-indexed
}

export function StepBar({ steps, currentStep }: StepBarProps) {
  return (
    <div className="border-b border-mr-border bg-mr-bg-2 px-6 py-3 flex items-center gap-1 shrink-0 select-none">
      {steps.map((step, i) => {
        const isDone = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <React.Fragment key={step.id}>
            {i > 0 && (
              <span className="mono text-[11px] text-mr-dim px-1 shrink-0">›</span>
            )}
            <div
              className={`flex items-center gap-[6px] px-2 py-1 rounded-[6px] transition-colors ${
                isCurrent ? "bg-mr-blue-soft" : "bg-transparent"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center mono text-[10px] font-medium shrink-0 ${
                  isDone
                    ? "bg-mr-blue text-white"
                    : isCurrent
                    ? "bg-mr-blue-hi text-white ring-2 ring-mr-blue-ring"
                    : "bg-mr-surface-3 text-mr-dim"
                }`}
              >
                {isDone ? "✓" : step.id}
              </span>
              <span
                className={`mono text-[11px] tracking-[0.4px] whitespace-nowrap ${
                  isDone
                    ? "text-mr-fg-2"
                    : isCurrent
                    ? "text-mr-fg font-medium"
                    : "text-mr-dim"
                }`}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
```

**Ejemplo de uso:**

```typescript
const STEPS = [
  { id: 1, label: "Cargar archivo" },
  { id: 2, label: "Seleccionar variables" },
  { id: 3, label: "Exportar" },
];

// En el componente:
<StepBar steps={STEPS} currentStep={currentStep} />
```

---

## 8. Layout de la app

### Standalone (app corriendo sola)

```tsx
// src/app/layout.tsx
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="h-full bg-mr-bg text-mr-fg font-space overflow-hidden">
        {children}
      </body>
    </html>
  );
}
```

### Page principal de la app

```tsx
// src/app/page.tsx
"use client";

import { useState } from "react";
import { StepBar } from "@/components/StepBar";

const STEPS = [
  { id: 1, label: "Cargar archivo" },
  { id: 2, label: "Seleccionar variables" },
  { id: 3, label: "Exportar" },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="h-screen flex flex-col bg-mr-bg text-mr-fg font-space overflow-hidden">
      <StepBar steps={STEPS} currentStep={currentStep} />
      <main className="flex-1 overflow-y-auto mr-scroll px-[72px] py-[48px]">
        {currentStep === 1 && <Step1 onNext={() => setCurrentStep(2)} />}
        {currentStep === 2 && <Step2 onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />}
        {currentStep === 3 && <Step3 onBack={() => setCurrentStep(2)} />}
      </main>
    </div>
  );
}
```

### Comportamiento en iframe

Cuando el hub carga la app via iframe, el `h-screen` de la app se adapta al tamaño del iframe. **No se necesita ningun cambio de codigo.** El hub provee su propio header y sidebar; la app solo muestra `StepBar` + contenido.

El hub embebe con:
```tsx
<iframe src="https://mi-app.vercel.app" className="w-full h-full border-0" />
```

---

## 9. Patron de flujo guiado

### Pantalla de bienvenida (step 0)

**Toda app con flujo de pasos debe tener una pantalla de bienvenida** antes del step 1. Esta pantalla lista los pasos con su descripcion y tiene un boton "Iniciar". El `StepBar` no se muestra en esta pantalla.

Implementacion: `currentStep` arranca en `0`. El array `STEPS` incluye campo `description`. Al hacer reset, volver a `0`.

```tsx
const STEPS = [
  { id: 1, label: "Cargar archivo",  description: "Descripcion de lo que hace este paso." },
  { id: 2, label: "Configurar",      description: "Descripcion de lo que hace este paso." },
  { id: 3, label: "Exportar",        description: "Descripcion de lo que hace este paso." },
];

// En el layout:
{currentStep > 0 && <StepBar steps={STEPS} currentStep={currentStep} />}

// Pantalla 0:
{currentStep === 0 && <WelcomeScreen steps={STEPS} onStart={() => setCurrentStep(1)} />}
```

Componente `WelcomeScreen`:

```tsx
interface Step {
  id: number;
  label: string;
  description: string;
}

function WelcomeScreen({ steps, onStart }: { steps: Step[]; onStart: () => void }) {
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
```

---

Cada paso es un componente separado que recibe `onNext` y/o `onBack` como props.

### Botones de navegacion

```tsx
// Boton primario (avanzar)
<button
  onClick={onNext}
  className="bg-mr-blue hover:bg-mr-blue-lo text-white rounded-[6px] px-4 py-2 text-[14px] font-medium transition-colors cursor-pointer"
>
  Continuar
</button>

// Boton secundario (retroceder)
<button
  onClick={onBack}
  className="border border-mr-border text-mr-fg-2 hover:bg-mr-surface hover:text-mr-fg rounded-[6px] px-4 py-2 text-[14px] transition-colors cursor-pointer"
>
  Atras
</button>
```

### Estructura recomendada de cada step

```tsx
function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-[640px] flex flex-col gap-6">
      {/* Titulo del paso */}
      <div>
        <p className="mono text-[11px] text-mr-blue-hi tracking-[1.4px] mb-2">PASO 1</p>
        <h1 className="text-[28px] font-medium tracking-[-0.8px] leading-[1.1]">
          Cargar archivo
        </h1>
        <p className="mt-3 text-[14px] text-mr-muted-2 font-light">
          Descripcion breve de lo que hace este paso.
        </p>
      </div>

      {/* Contenido especifico del paso */}
      {/* ... inputs, dropzones, selects, etc ... */}

      {/* Navegacion */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onNext}
          className="bg-mr-blue hover:bg-mr-blue-lo text-white rounded-[6px] px-4 py-2 text-[14px] font-medium transition-colors cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
```

---

## 10. Estilos de UI frecuentes

### Cards / contenedores

```tsx
// Card basica
<div className="border border-mr-border rounded-[8px] bg-mr-surface p-4">
  ...
</div>

// Card con hover
<div className="border border-mr-border rounded-[8px] bg-mr-surface hover:bg-mr-surface-2 transition-colors p-4">
  ...
</div>
```

### Inputs

```tsx
<input
  type="text"
  className="w-full bg-mr-surface border border-mr-border rounded-[6px] px-3 py-2 text-[14px] text-mr-fg placeholder:text-mr-dim focus:outline-none focus:border-mr-blue-ring focus:ring-1 focus:ring-mr-blue-ring transition-colors"
  placeholder="Placeholder..."
/>
```

### Dropzone (arrastrar archivo)

```tsx
<div className="border-2 border-dashed border-mr-border rounded-[8px] bg-mr-surface p-8 text-center hover:border-mr-border-2 hover:bg-mr-surface-2 transition-colors cursor-pointer">
  <p className="text-mr-muted-2 text-[14px] font-light">
    Arrastra un archivo o haz click para seleccionar
  </p>
  <p className="mono text-[11px] text-mr-dim mt-1 tracking-[0.4px]">.csv, .xlsx</p>
</div>
```

### Divider

```tsx
<div className="border-t border-mr-border" />
```

### Label de seccion

```tsx
<p className="mono text-[10.5px] text-mr-muted-2 tracking-[1.4px] uppercase mb-2">
  Etiqueta seccion
</p>
```

---

## 11. Gradientes para nuevas apps

Formula: `linear-gradient(135deg, {color-oscuro}, {color-claro})`

Gradientes ya usados (no repetir):

| App       | Gradient |
|-----------|----------|
| Trazador  | `linear-gradient(135deg, #1e40af, #3b82f6)` - azul |
| Cuotero   | `linear-gradient(135deg, #0e7490, #06b6d4)` - cyan |
| Despachos | `linear-gradient(135deg, #4338ca, #818cf8)` - indigo |
| Separador | `linear-gradient(135deg, #065f46, #10b981)` - verde |

Gradientes disponibles para nuevas apps:

| Color     | Gradient sugerido |
|-----------|-------------------|
| Rojo/rose | `linear-gradient(135deg, #9f1239, #f43f5e)` |
| Naranja   | `linear-gradient(135deg, #9a3412, #f97316)` |
| Amarillo  | `linear-gradient(135deg, #92400e, #f59e0b)` |
| Violeta   | `linear-gradient(135deg, #5b21b6, #a78bfa)` |
| Rosa      | `linear-gradient(135deg, #831843, #ec4899)` |
| Slate     | `linear-gradient(135deg, #1e293b, #475569)` |

---

## 12. Border radius de referencia

| Valor         | Uso |
|---------------|-----|
| `rounded-[3px]` | Indicador activo sidebar (barra vertical) |
| `rounded-[6px]` | Botones, inputs, logo, chips, items de nav |
| `rounded-[7px]` | Items de sidebar |
| `rounded-[8px]` | Cards, contenedores, previews |
| `rounded-full`  | Tags, badges, dots, status pills, circulos de step |

---

## 13. Sombras

```
Inset highlight:  shadow-[inset_0_1px_0_rgba(255,255,255,0.22),_0_1px_0_rgba(0,0,0,0.3)]
App glyph:        shadow-[inset_0_1px_0_rgba(255,255,255,0.18),_0_1px_2px_rgba(0,0,0,0.3)]
```

Usar con moderacion. El sistema prefiere profundidad via color (surfaces mas claras) sobre sombras.

---

## 14. Checklist para nueva app

- [ ] `globals.css` copiado exacto con todas las variables `--mr-*`
- [ ] `layout.tsx` con Space Grotesk + JetBrains Mono via `next/font/google`
- [ ] Pantalla de bienvenida (step 0) con lista de pasos + boton Iniciar
- [ ] `StepBar` se oculta en step 0, visible en steps 1+
- [ ] `StepBar` muestra correctamente: completados (azul + checkmark), actual (azul brillante + fondo), pendientes (gris)
- [ ] Layout usa `h-screen flex flex-col overflow-hidden`
- [ ] Contenido scrollable usa `flex-1 overflow-y-auto mr-scroll`
- [ ] Botones usan las clases de boton primario/secundario definidas arriba
- [ ] Inputs tienen estilos `focus:border-mr-blue-ring focus:ring-1 focus:ring-mr-blue-ring`
- [ ] Tipografia: `.mono` para labels/tags/metadata, `font-space` para el resto
- [ ] App funciona correctamente en iframe (sin header propio) Y como standalone

---

## 15. Checklist para adaptar app existente

- [ ] Reemplazar CSS/colores propios por variables `--mr-*`
- [ ] Instalar Space Grotesk + JetBrains Mono
- [ ] Agregar pantalla de bienvenida (step 0) con descripcion de pasos + boton Iniciar
- [ ] Agregar `StepBar` si la app tiene flujo de pasos (oculto en step 0)
- [ ] Adaptar layout a `h-screen flex flex-col`
- [ ] Verificar que no hay `overflow: scroll` en el body (el hub necesita que el iframe no scrollee el body)
- [ ] Reemplazar botones propios por los patrones de boton del sistema
- [ ] Reemplazar inputs propios por el patron de input del sistema
- [ ] Verificar en iframe: abrir el hub y cargar la app para confirmar que se ve coherente
