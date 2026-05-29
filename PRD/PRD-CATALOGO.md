# PRD — Catálogo Web de Tecnología

# 1. Descripción General

Desarrollo de un catálogo web de tecnología con apariencia de ecommerce moderno, enfocado en mostrar productos de manera visualmente atractiva y profesional.

El proyecto tendrá un enfoque frontend-first, priorizando:
- diseño visual,
- experiencia de usuario,
- responsive design,
- navegación fluida,
- arquitectura limpia,
- y organización moderna de frontend.

El catálogo NO incluirá funcionalidades complejas como:
- pagos online,
- autenticación,
- carrito de compras real,
- inventario,
- backend,
- ni panel administrativo.

---

# 2. Objetivo del Proyecto

Construir una aplicación web moderna que:
- sirva como proyecto de portafolio,
- pueda presentarse a potenciales clientes,
- transmita profesionalismo visual,
- y funcione como demostración de una tienda digital sencilla.

---

# 3. Objetivos Técnicos

El proyecto busca reforzar conocimientos en:
- React
- TypeScript
- TailwindCSS
- React Router DOM
- Componentización
- Arquitectura frontend
- Renderizado dinámico
- Responsive Design
- Dark Mode
- UI/UX frontend
- Organización escalable de componentes
- Clean Code
- SOLID aplicado a frontend
- Feature-Based Architecture

---

# 4. Alcance del MVP

## Incluye

- Página principal (Home)
- Catálogo de productos
- Vista de detalle de producto
- Navegación multipágina
- Filtros básicos
- Búsqueda simple
- Integración con WhatsApp
- Dark mode
- Responsive design
- Renderizado dinámico desde JSON local

---

## No Incluye

- Backend
- Base de datos
- Autenticación
- Carrito de compras
- Pasarela de pagos
- Dashboard administrativo
- Gestión de inventario
- APIs externas
- Persistencia de datos
- Roles de usuario

---

# 5. Público Objetivo

Usuarios interesados en productos tecnológicos.

El proyecto también estará orientado a:
- clientes potenciales,
- pequeños negocios,
- emprendimientos,
- y uso como portafolio profesional.

---

# 6. Tecnologías

## Frontend
- React
- TypeScript
- TailwindCSS
- React Router DOM

---

## Manejo de Datos
- JSON local

---

## Estado
- useState
- props

---

# 7. Arquitectura del Proyecto

## Arquitectura Principal
- Feature-Based Architecture

## Enfoque UI
- Component-Driven Development

---

## Patrones de Diseño Aplicados

### Component Pattern
Construcción de la interfaz mediante componentes reutilizables.

---

### Container / Presentational Pattern
Separación entre:
- lógica,
- estado,
- y presentación visual.

---

### Custom Hooks Pattern
Encapsulación de lógica reutilizable.

Ejemplos:
- useDarkMode
- useSearch

---

### Layout Pattern
Layouts reutilizables para mantener consistencia estructural.

---

### Design System Básico
Definición consistente de:
- botones,
- cards,
- containers,
- spacing,
- tipografía,
- y estilos reutilizables.

---

# 8. Principios de Código

## Clean Code
El proyecto seguirá principios de:
- legibilidad,
- simplicidad,
- mantenibilidad,
- y reutilización.

---

## Principios Aplicados

### KISS
Mantener soluciones simples y fáciles de mantener.

---

### DRY
Evitar duplicación de código y estilos.

---

### Separation of Concerns
Separar:
- UI,
- lógica,
- y datos.

---

### SOLID Adaptado a Frontend

#### Single Responsibility Principle
Cada componente tendrá una única responsabilidad clara.

---

#### Open/Closed Principle
Los componentes podrán extenderse mediante props sin modificar su estructura principal.

---

# 9. Concepto Visual

## Estilo General
Catálogo ecommerce moderno, limpio y minimalista.

Inspiraciones:
- MercadoLibre
- Ktronix
- Alkosto
- Shopify Stores simples

---

## Características Visuales
- Diseño claro y moderno
- Espaciado amplio
- Cards limpias
- Interfaz minimalista
- Animaciones suaves
- Responsive Design
- Dark Mode opcional

---

# 10. Paleta Visual

## Light Mode
- Fondo claro
- Cards blancas
- Texto oscuro
- Acentos azules

---

## Dark Mode
- Fondo oscuro
- Cards oscuras
- Texto claro
- Acentos sobrios

---

# 11. Tipografía

Tipografías recomendadas:
- Poppins
- Inter

---

# 12. Estructura de Páginas

# Home

## Secciones
- Navbar
- Hero Section
- Categorías
- Productos destacados
- Footer

---

# Catálogo

## Secciones
- Buscador
- Filtros simples
- Grid de productos

---

# Detalle de Producto

## Secciones
- Imagen principal
- Información del producto
- Descripción
- Precio
- Botón WhatsApp
- Productos relacionados

---

# Contacto

## Secciones
- Información de contacto
- WhatsApp
- Redes sociales

---

# 13. Funcionalidades

# Navegación
- Navegación multipágina usando React Router

---

# Catálogo
- Renderizado dinámico desde JSON local
- Filtro por categoría
- Búsqueda básica

---

# Producto
- Vista detallada
- Información visual
- Botón de contacto por WhatsApp

---

# WhatsApp
Cada producto tendrá acceso directo a WhatsApp mediante un enlace dinámico.

Ejemplo:

https://wa.me/573001112233?text=Hola,%20me%20interesa%20el%20producto

---

# Dark Mode
- Cambio entre tema claro y oscuro

---

# Responsive Design
Compatibilidad con:
- móviles
- tablets
- desktop

---

# 14. Productos del Catálogo

El catálogo incluirá productos tecnológicos ficticios o mock data.

## Categorías sugeridas
- Gaming
- Audio
- Computadores
- Accesorios

---

## Productos sugeridos
- Mouse gamer
- Teclados mecánicos
- Audífonos
- Monitores
- Laptops
- Accesorios tecnológicos

---

## Marcas sugeridas
- Logitech
- HyperX
- Asus
- Razer
- Redragon

---

# 15. Arquitectura de Carpetas

src/
│
├── features/
│   ├── home/
│   │   ├── components/
│   │   ├── sections/
│   │   └── Home.tsx
│   │
│   ├── catalog/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── data/
│   │   └── Catalog.tsx
│   │
│   ├── product/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── interfaces/
│   │   └── ProductDetail.tsx
│   │
│   └── contact/
│       └── Contact.tsx
│
├── shared/
│   ├── components/
│   ├── layouts/
│   ├── hooks/
│   ├── interfaces/
│   ├── utils/
│   └── styles/
│
├── routes/
│
├── App.tsx
└── main.tsx

---

# 16. Interfaces TypeScript

## Product Interface

```ts
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}
17. Prioridades del Desarrollo
Alta Prioridad
Diseño visual
Responsive Design
Organización del código
Consistencia visual
Experiencia de usuario
Reutilización de componentes
Clean Code
Baja Prioridad
Lógica compleja
Persistencia
Escalabilidad backend
Automatizaciones
Infraestructura avanzada
18. Resultado Esperado

Un catálogo web moderno y visualmente atractivo que:

parezca una tienda online real,
sea fácil de navegar,
funcione correctamente en móviles,
tenga una interfaz profesional,
implemente buenas prácticas frontend,
y pueda utilizarse como proyecto de portafolio o demo comercial.