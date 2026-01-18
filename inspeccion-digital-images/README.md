# Inspección Digital - Sunmi V2s 📱

**Inspección Digital** es una aplicación móvil nativa desarrollada para dispositivos **Sunmi V2s** que permite la gestión, creación y visualización de formularios de inspección en campo. Diseñada para trabajar tanto en modo online como offline, garantiza la continuidad operativa en cualquier entorno.

## Descripción del Proyecto

Esta aplicación móvil está desarrollada específicamente para dispositivos de punto de venta **Sunmi V2s**, permitiendo a inspectores y personal de campo registrar información mediante formularios digitales personalizables. El sistema incluye capacidades de impresión térmica integrada, captura de imágenes, geolocalización y sincronización de datos.

## Tecnologías

### Framework y Plataforma
* **Framework:** React Native 0.80.1
* **Lenguaje:** TypeScript 5.0.4
* **UI Library:** React 19.1.0
* **Navegación:** React Navigation 7.x
* **State Management:** Redux Toolkit 2.8.2 + React Redux 9.2.0

### Características Nativas
* **Impresora Térmica:** `@mitsuharu/react-native-sunmi-printer-library` (2.3.0)
* **Base de Datos Local:** SQLite Storage (6.0.1)
* **Almacenamiento Seguro:** React Native Keychain (10.0.0)
* **Geolocalización:** React Native Geolocation Service (5.3.1)
* **Captura de Imágenes:** React Native Image Picker (8.2.1)
* **Detección de Conectividad:** NetInfo (11.4.1)

### Dependencias Clave
* **Persistencia:** AsyncStorage (2.2.0)
* **HTTP Client:** Axios (1.10.0)
* **Seguridad:** BCrypt.js (3.0.2)
* **UI Components:** Vector Icons, Linear Gradient, Modal DateTime Picker
* **Animaciones:** React Native Reanimated (3.18.0)

## Funcionalidades Principales

### 1. Autenticación Segura

Sistema de login con almacenamiento seguro de credenciales.

* **Login Offline:** Autenticación local con credenciales almacenadas
* **Validación de Usuarios:** Verificación de permisos y roles
* **Almacenamiento Seguro:** Uso de Keychain para credenciales sensibles
* **Interfaz Intuitiva:** Diseño limpio y profesional

![Pantalla de Login](inspeccion-digital-images/login.jpeg)

### 2. Menú Principal

Dashboard centralizado con acceso rápido a todas las funcionalidades.

* **Navegación Clara:** Botones grandes y accesibles
* **Acceso Rápido:** Shortcuts a las funciones más utilizadas
* **Estado de Sincronización:** Indicador de conectividad y datos pendientes
* **Perfil de Usuario:** Información del inspector actual

![Menú Principal](inspeccion-digital-images/main-menu.jpeg)

### 3. Gestión de Formularios

Sistema completo para crear, editar y visualizar formularios de inspección.

#### 3.1 Menú de Formularios

Acceso organizado a las diferentes opciones de gestión de formularios.

* **Crear Formulario:** Generación de nuevos formularios
* **Listar Formularios:** Visualización de formularios existentes
* **Sincronizar:** Envío y recepción de datos con el servidor
* **Buscar:** Filtrado y búsqueda de formularios específicos

![Menú de Formularios](inspeccion-digital-images/menu-formularios.jpeg)

#### 3.2 Generar Formulario

Interfaz para la creación de nuevos formularios de inspección.

* **Campos Dinámicos:** Tipos de pregunta configurables
* **Captura de Imágenes:** Adjuntar fotos a las inspecciones
* **Geolocalización:** Registro automático de ubicación
* **Validación en Tiempo Real:** Verificación de campos obligatorios
* **Guardado Offline:** Almacenamiento local cuando no hay conexión

![Generar Formulario](inspeccion-digital-images/generar-formulario.jpeg)

#### 3.3 Listar Formularios

Vista de todos los formularios registrados con opciones de filtrado.

* **Lista Completa:** Visualización de todos los formularios
* **Filtros Avanzados:** Por fecha, estado, tipo, inspector
* **Indicadores de Estado:** Sincronizado, pendiente, error
* **Búsqueda Rápida:** Localización por ID o datos del formulario

![Listar Formularios](inspeccion-digital-images/listar-formularios.jpeg)

#### 3.4 Listado de Formularios (Vista Detallada)

Tabla detallada con información completa de cada formulario.

* **Información Completa:** Todos los campos visibles
* **Ordenamiento:** Por columnas (fecha, ID, estado)
* **Acciones Rápidas:** Editar, eliminar, imprimir, compartir
* **Paginación:** Navegación eficiente en grandes volúmenes

![Listado de Formularios](inspeccion-digital-images/listado-formularios.jpeg)

#### 3.5 Visualizar Formulario

Vista detallada de un formulario individual.

* **Datos Completos:** Toda la información del formulario
* **Imágenes Adjuntas:** Galería de fotos capturadas
* **Ubicación en Mapa:** Visualización de coordenadas GPS
* **Opciones de Impresión:** Impresión directa en Sunmi V2s
* **Exportar/Compartir:** Envío por email o mensajería

![Visualizar Formulario](inspeccion-digital-images/show-formualarios.jpeg)

### 4. Modo Offline

Funcionalidad completa sin conexión a internet.

* **Almacenamiento Local:** SQLite para datos estructurados
* **Cola de Sincronización:** Registro de operaciones pendientes
* **Indicador Visual:** Notificación clara del estado de conexión
* **Sincronización Automática:** Al recuperar conexión

![Modo Sin Conexión](inspeccion-digital-images/menu-no-conecition.jpeg)

### 5. Impresión Térmica

Integración nativa con la impresora Sunmi V2s.

* **Impresión Directa:** Tickets y comprobantes desde la app
* **Formatos Personalizables:** Templates configurables
* **Vista Previa:** Verificación antes de imprimir
* **Códigos de Barras/QR:** Generación automática

## 🏗️ Arquitectura del Proyecto

```
sunmi-V2s/
├── android/                    # Configuración nativa Android
├── ios/                        # Configuración nativa iOS
├── src/
│   ├── components/            # Componentes reutilizables
│   │   ├── commerce/         # Componentes de comercio
│   │   ├── fine/             # Componentes de multas
│   │   ├── login/            # Componentes de autenticación
│   │   ├── modal/            # Modales personalizados
│   │   ├── notconnected/     # Indicador offline
│   │   ├── profile/          # Perfil de usuario
│   │   ├── question-option/  # Inputs de formularios
│   │   ├── top-bar/          # Barra superior
│   │   └── vehicle/          # Componentes de vehículos
│   │
│   ├── screens/              # Pantallas de la aplicación
│   │   ├── auth/            # Login y recuperación
│   │   ├── home/            # Pantalla principal
│   │   ├── Menu/            # Menús de navegación
│   │   ├── claim/           # Gestión de reclamos
│   │   ├── fine/            # Multas y comercio
│   │   ├── searcher/        # Buscadores
│   │   ├── modals/          # Pantallas modales
│   │   └── profile/         # Perfil de usuario
│   │
│   ├── router/              # Configuración de navegación
│   ├── styles/              # Estilos globales
│   ├── testForms/           # Componentes de prueba
│   └── [Redux Store]        # Estado global
│
├── App.tsx                  # Componente raíz
├── Main.tsx                 # Punto de entrada principal
└── package.json             # Dependencias del proyecto
```

## 📋 Requisitos Previos

### Hardware
- **Dispositivo Sunmi V2s** o emulador compatible
- Conexión a internet (para sincronización)
- GPS habilitado (para geolocalización)

### Software
- **Node.js 18+** y **npm** o **yarn**
- **React Native CLI** instalado globalmente
- **Android Studio** (para desarrollo Android)
- **Xcode** (para desarrollo iOS - solo macOS)
- **JDK 11+** (Java Development Kit)

### Verificar Instalaciones

```bash
node -v          # Debe mostrar v18.x o superior
npm -v           # Verificar npm
java -version    # Verificar JDK
```

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd sunmi-V2s
```

### 2. Instalar Dependencias

```bash
# Con npm
npm install

# O con yarn
yarn install
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
API_URL=https://api.rlink.com/v1
API_TIMEOUT=30000

# Database
DB_NAME=inspeccion_digital.db
DB_VERSION=1.0

# Features
ENABLE_OFFLINE_MODE=true
ENABLE_GEOLOCATION=true
ENABLE_CAMERA=true
ENABLE_PRINTER=true

# Debug
DEBUG_MODE=false
```

### 4. Configuración Específica de Android

```bash
# Navegar a la carpeta android
cd android

# Limpiar build (opcional)
./gradlew clean

# Volver a la raíz
cd ..
```

### 5. Configuración Específica de iOS (solo macOS)

```bash
# Instalar Ruby bundler (primera vez)
bundle install

# Instalar pods
cd ios
bundle exec pod install
cd ..
```

## ▶️ Ejecución del Proyecto

### Iniciar Metro Bundler

```bash
# Con npm
npm start

# O con yarn
yarn start

# Para limpiar caché
npm start -- --reset-cache
```

### Ejecutar en Android

```bash
# Con npm
npm run android

# O con yarn
yarn android

# Para un dispositivo específico
npx react-native run-android --deviceId=<DEVICE_ID>
```

### Ejecutar en iOS (solo macOS)

```bash
# Con npm
npm run ios

# O con yarn
yarn ios

# Para un simulador específico
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### Ejecutar en Dispositivo Sunmi V2s

1. **Habilitar Modo Desarrollador** en el dispositivo Sunmi
2. **Conectar vía USB** y habilitar depuración USB
3. **Verificar conexión:**
   ```bash
   adb devices
   ```
4. **Ejecutar la aplicación:**
   ```bash
   npm run android
   ```

## 🔧 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| **Iniciar Metro** | `npm start` | Inicia el bundler de JavaScript |
| **Android** | `npm run android` | Compila y ejecuta en Android |
| **iOS** | `npm run ios` | Compila y ejecuta en iOS |
| **Lint** | `npm run lint` | Ejecuta ESLint para verificar código |
| **Test** | `npm test` | Ejecuta tests con Jest |
| **Clean** | `npx react-native-clean-project` | Limpia caché y builds |

## 🗄️ Base de Datos Local (SQLite)

### Estructura de Tablas

#### Tabla: `formularios`
```sql
CREATE TABLE formularios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL,
  fecha_creacion TEXT NOT NULL,
  inspector_id INTEGER,
  datos_json TEXT,
  imagenes TEXT,
  latitud REAL,
  longitud REAL,
  sincronizado INTEGER DEFAULT 0,
  estado TEXT DEFAULT 'pendiente'
);
```

#### Tabla: `usuarios`
```sql
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rol TEXT,
  activo INTEGER DEFAULT 1
);
```

#### Tabla: `sincronizacion_cola`
```sql
CREATE TABLE sincronizacion_cola (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo_operacion TEXT NOT NULL,
  tabla TEXT NOT NULL,
  registro_id INTEGER,
  datos_json TEXT,
  fecha_creacion TEXT,
  intentos INTEGER DEFAULT 0
);
```

## 🔒 Seguridad

### Características Implementadas

1. **Almacenamiento Seguro:**
   - Credenciales en Keychain (iOS) / Keystore (Android)
   - Contraseñas hasheadas con BCrypt
   - Datos sensibles encriptados en SQLite

2. **Autenticación:**
   - Tokens de sesión con expiración
   - Renovación automática de tokens
   - Logout automático por inactividad

3. **Permisos de Dispositivo:**
   - Cámara (para captura de imágenes)
   - Ubicación (para geolocalización)
   - Almacenamiento (para guardar archivos)
   - Impresora (para Sunmi V2s)

### Recomendaciones para Producción

- [ ] Implementar certificado SSL pinning
- [ ] Habilitar ProGuard/R8 para ofuscación de código
- [ ] Configurar Code Push para actualizaciones OTA
- [ ] Implementar analytics y crash reporting
- [ ] Configurar CI/CD para builds automatizados
- [ ] Realizar auditoría de seguridad de dependencias

## 📱 Compatibilidad

### Dispositivos Soportados
- **Sunmi V2s** (principal)
- **Sunmi V2 Pro**
- Dispositivos Android 8.0+ (sin funciones de impresora)

### Versiones de Sistema Operativo
- **Android:** 8.0 (API 26) o superior
- **iOS:** 13.0 o superior (compatibilidad limitada)

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en modo watch
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Tests Disponibles
- Unit tests de componentes
- Tests de integración de Redux
- Tests de servicios de base de datos
- Tests de sincronización

## 🐛 Troubleshooting

### Problemas Comunes

#### Metro Bundler no inicia
```bash
# Limpiar caché
npm start -- --reset-cache
```

#### Error de compilación en Android
```bash
cd android
./gradlew clean
cd ..
npm run android
```

#### Problemas con dependencias nativas
```bash
# Limpiar proyecto completo
npx react-native-clean-project
npm install
```

#### Impresora Sunmi no funciona
- Verificar que el dispositivo es un Sunmi V2s original
- Comprobar permisos de la aplicación
- Reiniciar el servicio de impresora del dispositivo

## 📚 Recursos Adicionales

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Sunmi Developer Portal](https://developer.sunmi.com/)
- [Redux Toolkit Guide](https://redux-toolkit.js.org/)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)

## 📄 Licencia

Este proyecto es **código privado** propiedad de **RLINK**. La distribución, modificación o uso no autorizado del código está estrictamente prohibido.

**Todos los derechos reservados © 2026 RLINK**

---

**Desarrollado por el equipo de RLINK para dispositivos Sunmi V2s**
