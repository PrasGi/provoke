## [INIT] Known Issues

### Issue 1: 3D shapes hidden behind UI
- `CategoryAtmosphere` group at `position=[0,0,-2]`, shapes orbit at radius 1.35
- Camera at z=5, fov=60 → at z=-2 the viewport is ~7 units wide
- Shapes at radius 1.35 appear tiny and central, hidden behind UI panels
- Fix: spread shapes to corners/edges of viewport, increase scale, use wider radius

### Issue 2: No mouse interaction on particles
- `Particles.tsx` uses random velocities only, no mouse input
- Need to read mouse position from DOM and apply repulsion/attraction in useFrame
- Must use `pointer-events-none` canvas — so mouse coords must come from window events

### Issue 3: Playing screen card covers 3D
- Card is in `relative z-10` div, 3D is `fixed -z-10`
- Shapes orbit at radius 1.35 which is smaller than the card width
- Fix: shapes should orbit at larger radius so they appear around the card edges

### Issue 4: Home screen too basic
- Brand: simple serif title + tagline
- Category grid: plain buttons
- Level/Timer: plain segmented controls with white/5 bg
- Start button: plain
- Needs: premium glassmorphism, better spacing, visual hierarchy, glow accents
