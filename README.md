# Sistema de Rifa - 10,000 Tickets

Un sistema web completo y responsivo para gestionar rifas con 10,000 tickets, integración con Supabase, verificación de tickets por cédula y sección de premios.

## 📋 Características Principales

- **10,000 tickets disponibles** con asignación aleatoria
- **Integración completa con Supabase** para almacenamiento de datos
- **Verificación de tickets por cédula** en tiempo real
- **Sistema de pago con BNC Pago Móvil**
- **Página de premios** con 30 ganadores
- **Elementos flotantes de redes sociales**
- **Diseño completamente responsivo**
- **Colores modernos**: Gris claro (#282828) y turquesa (#40E0D0)

## 🗂️ Estructura del Proyecto

```
sistema-rifa/
├── index.html          # Página principal de compra de tickets
├── premios.html        # Página de premios y ganadores
├── styles.css          # Estilos CSS con variables y diseño responsivo
├── script.js           # Lógica JavaScript y integración Supabase
├── ganadores.md        # Lista de 25 números ganadores predefinidos
└── README.md           # Documentación del proyecto
```

## 🎨 Personalización

### Colores

Para modificar los colores del sistema, edite las variables CSS en `styles.css`:

```css
:root {
    --primary-bg: #282828;     /* Fondo principal (gris claro) */
    --accent: #40E0D0;         /* Color de acento (turquesa) */
    --buy-btn: #4CAF50;        /* Botón de compra (verde) */
    --text-color: #FFFFFF;     /* Color de texto principal */
    --text-dark: #333333;      /* Texto oscuro */
    --border-color: #444444;   /* Bordes */
    --card-bg: #333333;        /* Fondo de tarjetas */
}
```

### Enlaces de Redes Sociales

Para modificar los enlaces de redes sociales, edite las URLs en `index.html` y `premios.html`:

```html
<div class="social-float">
    <a href="https://facebook.com/tu-pagina" target="_blank" class="social-btn facebook">f</a>
    <a href="https://instagram.com/tu-cuenta" target="_blank" class="social-btn instagram">ig</a>
    <a href="https://tiktok.com/tu-perfil" target="_blank" class="social-btn tiktok">tt</a>
    <a href="https://wa.me/tu-numero" target="_blank" class="social-btn whatsapp">wa</a>
</div>
```

### Precio de Tickets

Para cambiar el precio por ticket, modifique la variable en `script.js`:

```javascript
const ticketPrice = 300; // BsS por ticket
```

## 🗄️ Integración con Supabase

### Claves Utilizadas

**Clave Anon (Legacy)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkeHN2bXVna3ViYXV1dHFsbmlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjQ3OTMsImV4cCI6MjA3MDM0MDc5M30.Xw4aqJq_u9uXg7ruyi8YvWqPdnEuXrmiQ7flvnw0usE`

**¿Por qué esta clave?**
- ✅ **Segura para el cliente**: La clave anon es segura para usar en el frontend
- ✅ **Permisos limitados**: Solo permite operaciones básicas de lectura/escritura
- ❌ **NO usar claves secretas**: Las claves service_role o secret nunca deben exponerse en el cliente

### Configuración Paso a Paso

#### 1. Acceder a Supabase

1. Ve a [https://rdxsvmugkubauutqlnig.supabase.co](https://rdxsvmugkubauutqlnig.supabase.co)
2. Inicia sesión en tu cuenta de Supabase
3. Selecciona tu proyecto

#### 2. Crear la Tabla de Compradores

En el **SQL Editor** de Supabase, ejecuta el siguiente comando:

```sql
CREATE TABLE compradores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  referencia VARCHAR(50) UNIQUE NOT NULL,
  telefono VARCHAR(15),
  correo VARCHAR(100),
  tickets_asignados TEXT[] NOT NULL,
  fecha_compra TIMESTAMP DEFAULT NOW()
);
```

#### 3. Configurar Políticas de Seguridad (RLS)

Habilita Row Level Security y crea políticas:

```sql
-- Habilitar RLS
ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción (compra de tickets)
CREATE POLICY "Permitir inserción de compradores" ON compradores
    FOR INSERT WITH CHECK (true);

-- Política para permitir lectura (búsqueda de tickets)
CREATE POLICY "Permitir lectura de compradores" ON compradores
    FOR SELECT USING (true);
```

#### 4. Verificar la Configuración

Ejecuta una consulta de prueba:

```sql
SELECT COUNT(*) FROM compradores;
```

Si devuelve `0`, la tabla está configurada correctamente.

#### 5. Configurar las Claves en el Código

En `script.js`, verifica que las credenciales sean correctas:

```javascript
const supabaseUrl = 'https://rdxsvmugkubauutqlnig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Clave anon
```

## 🚀 Instalación y Uso

### Requisitos

- Navegador web moderno
- Conexión a internet (para Supabase y Google Fonts)
- Servidor web local (opcional, para desarrollo)

### Instalación

1. **Descarga los archivos**:
   ```bash
   # Si tienes git instalado
   git clone [url-del-repositorio]
   
   # O descarga directamente los archivos
   ```

2. **Configura Supabase** siguiendo los pasos anteriores

3. **Abre el proyecto**:
   - Opción 1: Abre `index.html` directamente en tu navegador
   - Opción 2: Usa un servidor local:
     ```bash
     # Con Python
     python -m http.server 8000
     
     # Con Node.js (http-server)
     npx http-server
     
     # Con PHP
     php -S localhost:8000
     ```

### Uso del Sistema

#### Para Compradores

1. **Seleccionar tickets**: Usa los botones predefinidos (1, 2, 4, 6, 10, 20) o ingresa una cantidad personalizada
2. **Ver total**: El sistema calcula automáticamente el total en BsS
3. **Comprar**: Haz clic en "Comprar Tickets" para abrir el modal de pago
4. **Completar pago**: Llena el formulario con tus datos y referencia de pago
5. **Recibir tickets**: El sistema asigna tickets aleatorios y muestra los números

#### Para Verificar Tickets

1. Ve a la sección "Buscar Tickets por Cédula"
2. Ingresa tu número de cédula
3. Haz clic en "Buscar Ticket"
4. El sistema mostrará tus tickets asignados

#### Ver Premios

1. Haz clic en el botón "Premios" en la parte superior
2. Navega por la lista de 30 ganadores
3. Cada ganador tiene su premio e información correspondiente

## 🔧 Funcionalidades Técnicas

### Generación de Tickets

```javascript
function generateRandomTickets(quantity) {
    const tickets = [];
    const usedNumbers = new Set();
    
    while (tickets.length < quantity) {
        const ticketNumber = Math.floor(Math.random() * 10000) + 1;
        const formattedNumber = ticketNumber.toString().padStart(4, '0');
        
        if (!usedNumbers.has(formattedNumber)) {
            usedNumbers.add(formattedNumber);
            tickets.push(formattedNumber);
        }
    }
    
    return tickets.sort();
}
```

### Validación de Datos

- **Campos obligatorios**: Nombre, apellido, cédula, referencia
- **Cédula única**: No se permiten duplicados
- **Referencia única**: Cada pago debe tener referencia única
- **Límites de cantidad**: Máximo 100 tickets por compra

### Manejo de Errores

- **Errores de red**: Reintentos automáticos
- **Errores de validación**: Mensajes claros al usuario
- **Errores de Supabase**: Manejo específico por tipo de error

## 📱 Diseño Responsivo

### Breakpoints

- **Desktop**: > 768px
- **Tablet**: 481px - 768px  
- **Mobile**: ≤ 480px

### Adaptaciones Móviles

- Botones sociales más pequeños
- Modal adaptado a pantalla
- Formularios optimizados
- Imágenes responsivas

## 🎯 Características de Seguridad

### Frontend

- Validación de entrada de datos
- Sanitización de formularios
- Límites de cantidad de tickets
- Manejo seguro de errores

### Backend (Supabase)

- Row Level Security (RLS) habilitado
- Políticas de acceso configuradas
- Claves anon para operaciones seguras
- Validación de unicidad en base de datos

## 🐛 Solución de Problemas

### Error: "No se puede conectar a Supabase"

1. Verifica que la URL del proyecto sea correcta
2. Confirma que la clave anon esté bien copiada
3. Revisa la consola del navegador para errores específicos

### Error: "Tabla no encontrada"

1. Asegúrate de haber creado la tabla `compradores`
2. Verifica que las políticas RLS estén configuradas
3. Confirma los permisos de la clave anon

### Error: "Cédula ya existe"

- Este es el comportamiento esperado
- Cada cédula solo puede comprar tickets una vez
- Para pruebas, usa diferentes números de cédula

### Tickets no se muestran en búsqueda

1. Verifica que la compra se haya completado exitosamente
2. Confirma que estás usando la misma cédula
3. Revisa la tabla en Supabase para confirmar los datos

## 📊 Monitoreo y Analytics

### Métricas Importantes

- **Tickets vendidos**: Contador en tiempo real
- **Porcentaje de venta**: Barra de progreso
- **Compradores únicos**: Por cédula
- **Referencias de pago**: Para conciliación

### Consultas Útiles

```sql
-- Total de tickets vendidos
SELECT SUM(array_length(tickets_asignados, 1)) as total_vendidos FROM compradores;

-- Compradores por fecha
SELECT DATE(fecha_compra) as fecha, COUNT(*) as compradores 
FROM compradores 
GROUP BY DATE(fecha_compra) 
ORDER BY fecha DESC;

-- Tickets por comprador
SELECT nombre, apellido, array_length(tickets_asignados, 1) as cantidad_tickets 
FROM compradores 
ORDER BY cantidad_tickets DESC;
```

## 🔄 Actualizaciones y Mantenimiento

### Backup de Datos

1. Exporta regularmente la tabla `compradores`
2. Guarda copias de los archivos del proyecto
3. Documenta cualquier cambio en la configuración

### Actualizaciones de Código

1. Siempre prueba en un entorno de desarrollo
2. Mantén copias de respaldo antes de actualizar
3. Verifica la compatibilidad con Supabase

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación:

1. Revisa esta documentación
2. Consulta los logs de la consola del navegador
3. Verifica la configuración de Supabase
4. Contacta al desarrollador si persisten los problemas

---

## 📄 Licencia

Este proyecto está desarrollado para uso específico del sistema de rifa. Todos los derechos reservados.

---

**Desarrollado con ❤️ para el Sistema de Rifa 10,000 Tickets**

*Última actualización: Enero 2025*
