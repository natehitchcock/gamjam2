## Level Tech Spec

### Overview
    Levels are collections of entities (environmental, player controlled, enemy controlled, etc...)
that can be either loaded from file or generated.

### Requirements
    - Load a png from disk as a level
    - Generate a random level given a set of parameters

### Interface
>Level
>   LoadLevel(file: string);
>   GenerateLevel(generationParams?);