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