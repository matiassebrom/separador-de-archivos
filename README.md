# Separador de Archivos

## ¿Qué hace esta aplicación?

Esta app permite separar y filtrar archivos Excel de manera rápida y personalizada. El usuario puede subir un archivo Excel, elegir cómo separar los datos (por columna), aplicar filtros opcionales, seleccionar qué columnas conservar y descargar los resultados en archivos separados (ZIP). El flujo es guiado paso a paso desde el frontend Angular, con backend FastAPI.

### Flujo principal:

1. **Subir archivo:** Selecciona y sube tu Excel.
2. **Elegir columna para separar:** Elige la columna por la que se dividirán los datos.
3. **Aplicar filtros (opcional):** Filtra los valores que quieres conservar por columna.
4. **Seleccionar columnas a guardar:** Elige qué columnas estarán en el resultado.
5. **Definir nombre base:** Elige el nombre para los archivos generados.
6. **Descargar archivos:** Descarga un ZIP con los archivos Excel separados según tu configuración.

Ideal para separar grandes listas, segmentar datos y automatizar tareas de exportación en Excel.

## 🚀 Setup y Ejecución

### Prerrequisitos
- Python 3.10+
- Node.js 18+
- npm

### Backend (FastAPI)

1. **Navegar al directorio del backend:**
   ```bash
   cd backend
   ```

2. **Crear entorno virtual (recomendado):**
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Ejecutar el servidor:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   El backend estará disponible en: http://localhost:8000

### Frontend (Angular)

1. **Navegar al directorio del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm start
   ```

   El frontend estará disponible en: http://localhost:4200

### 🧪 Ejecutar Tests

**Backend:**
```bash
cd backend
python -m pytest tests/ -v
```

**Frontend:**
```bash
cd frontend
npm test
```

### 📝 Desarrollo

- **Linting (Frontend):**
  ```bash
  cd frontend
  npx eslint src/ --ext .ts --fix
  ```

- **Build para producción:**
  ```bash
  # Backend: No requiere build
  # Frontend:
  cd frontend
  npm run build
  ```

## 📋 Notas de Seguridad

- El CORS está configurado para desarrollo (localhost:4200)
- Límite de archivos: 10MB
- Para producción, configurar CORS con dominios específicos
- Considerar autenticación para entornos multiusuario

## 📊 Code Review

Ver [CODE_REVIEW.md](CODE_REVIEW.md) para análisis detallado del código y recomendaciones de mejora.

---
