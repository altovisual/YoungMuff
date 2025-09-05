# Animación de "Me Gusta" con Partículas de Logo

## 🎉 Nueva Funcionalidad

Se ha implementado una animación espectacular de partículas que se activa cuando los usuarios dan "me gusta" a una canción. Las partículas utilizan el logo oficial de Maiki para crear un efecto visual impresionante.

## ✨ Características

### Animación de Partículas
- **Partículas del Logo**: Usa `maiki-logo.png` (o `logo-md.png` como fallback)
- **Distribución Circular**: Las partículas se distribuyen en un patrón circular alrededor del botón
- **Animación Fluida**: Movimiento suave con rotación y escalado
- **Efectos de Brillo**: Cada partícula tiene un efecto de brillo adicional
- **Duración Configurable**: 1.8 segundos por defecto

### Funcionalidad de "Me Gusta"
- **Estado Persistente**: Los "me gusta" se guardan en localStorage
- **Indicador Visual**: Los corazones se llenan de rojo cuando están activos
- **Visibilidad Inteligente**: Los botones de "me gusta" activos siempre son visibles
- **Animación de Pulso**: Efecto de pulso cuando se activa el "me gusta"

## 🔧 Componentes Creados

### 1. `ParticleAnimation.tsx`
Componente principal para la animación de partículas:

```tsx
<ParticleAnimation
  isActive={showAnimation}
  onComplete={handleAnimationComplete}
  particleCount={12}
  duration={1.8}
  logoSrc="/images/logo-md.png"
/>
```

**Props:**
- `isActive`: Activa/desactiva la animación
- `onComplete`: Callback cuando termina la animación
- `particleCount`: Número de partículas (default: 15)
- `duration`: Duración en segundos (default: 2)
- `logoSrc`: Ruta del logo a usar como partícula

### 2. `LikeButton.tsx`
Botón de "me gusta" con animación integrada:

```tsx
<LikeButton 
  trackId={track.id}
  size="sm"
  showParticles={true}
/>
```

**Props:**
- `trackId`: ID único de la canción
- `size`: Tamaño del botón ('sm', 'md', 'lg')
- `showParticles`: Mostrar animación de partículas
- `className`: Clases CSS adicionales

### 3. `LikedTracksSection.tsx`
Sección para mostrar canciones favoritas:

```tsx
<LikedTracksSection />
```

### 4. `LikeAnimationDemo.tsx`
Componente de demostración para probar la animación.

## 🎵 Integración con Player Store

Se actualizó el store del reproductor para incluir:

```typescript
interface PlayerState {
  likedTracks: string[]; // IDs de tracks favoritos
  toggleLike: (trackId: string) => void;
  isTrackLiked: (trackId: string) => boolean;
}
```

## 📁 Archivos Modificados

1. **`lib/stores/player-store.ts`**
   - Agregado estado de `likedTracks`
   - Funciones `toggleLike` e `isTrackLiked`
   - Persistencia en localStorage

2. **`components/Player/TrackList.tsx`**
   - Integración del `LikeButton`
   - Visibilidad condicional de botones
   - Importación de componentes necesarios

3. **`tracks.json`**
   - Agregados IDs únicos para cada track
   - Campo `artist` para mejor información

## 🎨 Efectos Visuales

### Animación de Partículas
- **Aparición**: Las partículas aparecen desde el centro del botón
- **Movimiento**: Se dispersan en patrón circular con variaciones aleatorias
- **Rotación**: Cada partícula rota 360° durante la animación
- **Escalado**: Efecto de crecimiento y reducción suave
- **Opacidad**: Transición suave de transparente a visible y viceversa
- **Brillo**: Efecto de resplandor adicional con gradiente

### Botón de "Me Gusta"
- **Hover**: Escalado sutil al pasar el mouse
- **Click**: Efecto de presión
- **Activación**: Pulso circular cuando se activa
- **Color**: Transición a rojo cuando está activo

## 🚀 Uso

### En TrackList
```tsx
// El botón se integra automáticamente en cada track
<LikeButton 
  trackId={track.id}
  size="sm"
  showParticles={true}
/>
```

### Como Componente Independiente
```tsx
// Para usar en otros lugares
<LikeButton 
  trackId="any-track-id"
  size="lg"
  showParticles={true}
  className="custom-styles"
/>
```

### Demostración
```tsx
// Para mostrar la funcionalidad
<LikeAnimationDemo />
```

## 🎯 Configuración

### Personalizar Animación
```tsx
const customParticleAnimation = {
  particleCount: 20,     // Más partículas
  duration: 2.5,         // Animación más larga
  logoSrc: "/custom-logo.png" // Logo personalizado
};
```

### Personalizar Botón
```tsx
const customLikeButton = {
  size: "lg",           // Botón más grande
  showParticles: true,  // Activar partículas
  className: "custom-class" // Estilos personalizados
};
```

## 📱 Responsive Design

- **Mobile**: Partículas optimizadas para pantallas pequeñas
- **Touch**: Botones con área de toque adecuada
- **Performance**: Animaciones optimizadas para dispositivos móviles

## 🔮 Futuras Mejoras

1. **Sonidos**: Agregar efectos de sonido al dar "me gusta"
2. **Variaciones**: Diferentes tipos de partículas según el género musical
3. **Compartir**: Integración con redes sociales
4. **Estadísticas**: Tracking de canciones más populares
5. **Sincronización**: Sync con backend para likes globales

## 🎉 ¡Disfruta la Nueva Experiencia!

La animación de partículas con el logo de Maiki crea una experiencia única y memorable para los usuarios cuando interactúan con sus canciones favoritas. ¡Cada "me gusta" ahora es una pequeña celebración visual!