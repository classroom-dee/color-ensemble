### Overview
The classic "I can't control the urge to expand my PoC project" type of project

### Overview
We'll generate a set of base ensembles for users to start their design with.
- The app will output complementary, analogous, triadic, split-comlementary colors per user input.
 - It will also output hex of the input color and output colors. 
users can either directly input hex/rgb/hsl/hsv or select color from the color palette(the one with gradient)
- The ui will have four quadrants. The top one is for 1. a nav bar that has app icon which also acts like a home button, 2. my favorites menu, 3. sign-in/sign-out menu depending on the login state. The middle left quadrant is for a palette wheel(need an appropriate third party library?) and the middle right quadrant is for the ensembles output area. The lower quadrant contains color inputs and 'add to favorite' button depending on login state.
- Color inputs change followed by any other input changes. For example if you change rgb, other inputs change to match that color along with the output and vice versa.
- Their are user entities and users can have colors favorite-d. Using SQLite for demo currently. Mind that non-logged-on user can still play around with the base color searching functionality, just not the favorite buttons.
- Using jwt for user auth.
- Repo setup: server/ as backend right under root, client/ as frontend right under root.
- Tests separated by server/client
### Instructions
**This is a temp thread so write your output inline style out here, not as a file.**
**As you can see in the attached project, i have so far more or less finished the backend and started working on the client. Don't change the backend as I have thoroughly tested it.**
**Start from the ColorInputs.tsx as it is unfinished and does not yet match our use case.**
**You decide what to do next but do not suggest to add unplanned functionalities**