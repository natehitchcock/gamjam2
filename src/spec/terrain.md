## Terrain Tech Spec

### Overview
    Terrain maps are collections of environmental enemies
that can be either loaded from a png file or generated.

### Requirements
    - Load a png from disk as a level
    - Generate a random level given a set of parameters

### Interface
>Terranin
>   LoadTerrain(file: string);
>   GenerateTerrain(generationParams?);

### Collision idea
    To check for collision against a terrain map
    1. Get the objects velocity
    2. Use that velocity to look up the bounding rectangle of their velocity in the terrain map
    3. Add additional area to the bounding rectangles sides based on object bounds
    4. Iterate over the bounded areas terrain units
    5. Box->Sphere collision