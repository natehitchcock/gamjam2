## Lighting Goals
    - Add a sense of mirk

    - Add fog of war
    - Create interest points

### Lighting techniques to hit
    - Fog of war mask
    - Ambient light contribution from individual light sources
    - Hard shadows
    - Colored lights

### Shading/Lighting Techniques 
    1. Per-object overlays that are each handed lighting params

    2. Full screen quad with low-fi texture
        - Each texel is a weighted interpolation of the surrounding gridels (to achieve smoothing)
    
    3. Per texel line trace to each light
        - Optimized by defaulting to weighted vert lighting if all verts are shaded/lit

### A thought on coloring
    Each texel only needs to be an intensity value for shadowing, but we could 
also store a multaplicative color value in each cell as well, to multiply the underlying 
pixels by

### Deliverables
    1. Pure tile based illumination
    2. Gradient illumination
    3. Hue manipulation
    4. Fog of war
    5. Normal calculations
    6. Hard shadows
    7. Contact shadows/Bump mapping
