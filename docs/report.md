# Library structure
Classes were made to mimic the real-world components of the game as closely as possible, with abstract classes representing concepts with various components.

## Game pieces
### Tiles
There is an abstract base class for tiles and it's children specialize it to provide relevant structural data and functionality.

#### Borders
Tiles have 4 borders of the enum type `Tile.Border`. Additionally due to the behavior of farms,

#### Tile internals
The internal structures of the tiles were represented via virtual methods such that it was tied to the class and not the instances. These methods make sense on all tile types and thus have implementations in the abstract class.

#### Farm Borders
Although I initially attempted to determine farm-border's algorithmically, I decided it would be safer to have them hard-coded for both performance and future additions. So I replaced that system with what's present in the `FarmBorders.ts` file which represents the two ways that farms can interact with surrounding farms and borders. Notice the extensive use of rotation angles and modular arithmetic

## Game infrastructure
The infrastructure surrounding the game is a bit more abstract but does a good job of organizing related concepts
### ScoreBoard
The scoreboard uses an abstract class `ScoreEvent` to keep track of things in the game which contrubte to a players final score in a way that can be later verified and reviewed in a log.

### TileStack
Represents a shuffled deck of tiles that the user can pull cards from. Balanced shuffling algorithm used, and the tile distributions and starting tile match the base game exactly.

### Table
Represents the table upon which the map is being created. Wrapper for `SparseMatrix<Tile>` with additional methods associated with providing valid tile and follower placements.

### Game
Class which combines all the components and gives the user a restricted interface with which to play the game

### GameAction
The classes here represent game turns and enable the game's public API. As mentioned in the comments, this could likely be improved (ie - through the use of interfaces to hide some parts), but should work as is.

### Player
This is more relevant to the frontend so this class is intentionally lacking features.

# Major objectives
## 1. Low-level Overhead and Classes
### Tuple Types
Instead of creating vector/coordinate types, tuples or even unpacked values were used to reduce complexity and overhead without hindering readability.

### Enums
Enums were used instead of classes or strings

### Static Data
Where possible, data was tied to the classes instead of being stored in instances. For example, the child classes of `Tile` implement abstract methods which are used to provide relevant information instead of having a single Tile class which stored that relevant information as instance variables. Thus converting a linear memory cost into a constant memory cost.

## 2-3. High-level hides internal functionality

### Private members
Wherever it made sense, members were either made private/protected or converted to local variables in their relevant methods. There are definitely still more that could be made private but it would be best to finish scoring before they're changed.

### Interfaces & Abstract classes
As one who uses C++ I generally prefer abstract classes to interfaces and thus used those in order to reduce the complexity in many cases. Eventually interfaces should be added in order to reduce the scope available through the high-level, public API's however as those are currently not fully developed I chose not to do that.

## 4. Advanced Concepts
### Type Features
All mentioned type features were used including
- constructor types
- polymorphism
- generic types
- tuple types
- type operators
- indexed types

### Idiomatic language features
All mentioned features were used including
- functional array methods (`map`, `filter`, `reduce`, etc.)
- Range-based for loops (ie `for (* in *) ...` in `ds/SparseMatrix.ts`
- Iterators, a custom iterator was implemented for `SparseMatrix, but not used (would be useful for scoring tho)
- Object destructuring was used although avoided for function parameters as it's messy to add to TSDoc

### Object oriented Patterns
Project is OO although it does not excessively organize things into classes which perform very few operations. I believe I labeled the `TileStack` as an abstract factory but it's more like an abstract repository. No singletons were used. Every object is locally scoped. The `Game` class is a facade consisting of several private components.

## 5. Generic Data Structures
The only reusable, custom structure used was the `SparseMatrix` class which as specified maintains a decentralized grid of values of a given type parameter. Thankfully JavaScript provides the most useful structures out of the box and changes some algorithms depending on use cases.

## Additional Performance Considerations
Throughout the project, consideration was taken to the performance and time complexity of the different components of the project and some algorithms were noted as potential targets for optimizations along with a rough path to do so. Additionally the GameAction api was designed such that the additional cost of discovering valid followers for a tile placement option was only performed if requested and the response of this operation was cached so that it's not repeated

# TODO
I would recommend looking through all comments marked as `// TODO` as any attention points would be there.
## Scoring
Likely can implement similar to how it's done in the `Table` class to verify followers. Will have to traverse the regions and get a set of tiles... Also roads have additional logic involved with intersections and city connections which shouldn't require a `FarmBorders` like solution but will add some pain.

## Verify algorithms
Demo.ts appears to verify behavior for a single turn but definitely could do more thorough testing. Additionally unit-tests would be good to have but likely not worth the time.

## Frontend
Unspecified.

## Code Style
- If code style is super important I'd recommend using a linter as I've worked with 4 different ts style guidelines this year alone and wasn't sure what you'd prefer
- Some minor improvements could be achieved via what's outlined in the Major objectives section above
- The code for the game and game actions could likely be improved
