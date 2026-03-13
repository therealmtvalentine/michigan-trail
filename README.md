# The Michigan Trail

A comedic parody of Oregon Trail featuring a modern family road trip from Texas to Michigan. Built with HTML5, CSS, and vanilla JavaScript.

## Features

- **Modern road trip gameplay** - Drive from Houston, Texas to Detroit, Michigan
- **Resource management** - Manage gas, snacks, money, car health, and family morale
- **Hilarious random events** - Deal with flat tires, bathroom emergencies, sibling fights, traffic jams, and more
- **Family morale system** - Keep everyone happy or face the consequences
- **Real locations** - Stop at Buc-ee's, gas stations, rest stops, and major cities along the route
- **Pixel art graphics** - Rendered using HTML5 Canvas with a modern car
- **Decision-making** - Make choices that affect your family's sanity

## How to Play

1. Open `index.html` in a web browser
2. Click "Start Road Trip" to begin
3. Use the action buttons to:
   - **Keep driving** - Travel forward and advance time
   - **Stop at motel** - Rest and recover morale (costs money)
   - **Fast food stop** - Buy snacks and boost morale
   - **Check supplies** - View your inventory and family status

## Game Mechanics

### Resources
- **Money** - Used to buy gas, snacks, and handle emergencies
- **Snacks** - Consumed daily, keeps the family fed
- **Gas** - Required to keep driving (game over if you run out!)
- **Car Health** - Decreases with poor decisions
- **Morale** - Family happiness level (affects gameplay)

### Random Events
- **Flat Tire** - Use spare parts or call roadside assistance
- **"Are We There Yet?"** - Deal with restless kids
- **Bathroom Emergency** - Find a rest stop fast!
- **Traffic Jam** - Wait it out or take a detour
- **Check Engine Light** - Ignore it or pay the mechanic
- **Sibling Fight** - Separate with snacks or threaten to turn around
- **Toll Road** - Pay up or take the long way
- **Car Karaoke** - Sing along or be a monster
- And many more!

### Route
Travel through 27 locations including:
- Houston, TX (start)
- Buc-ee's (Madisonville)
- Dallas, TX
- Oklahoma City, OK
- Kansas City, MO
- St. Louis, MO
- Chicago, IL
- Detroit, MI (destination)

## Project Structure

```
michigan-trail/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Game styling
├── js/
│   ├── main.js        # Game initialization and loop
│   ├── gameState.js   # Game state management (modern resources)
│   ├── renderer.js    # Canvas rendering (car graphics)
│   ├── eventSystem.js # Random road trip events
│   ├── locations.js   # Texas to Michigan route
│   └── ui.js          # UI controls
└── README.md
```

## Technologies Used

- HTML5 Canvas for graphics
- Vanilla JavaScript (ES6+)
- CSS3 for styling
- No external dependencies

## Deployment

To deploy to GitHub Pages:
1. Push this repository to GitHub
2. Go to repository Settings > Pages
3. Select main branch as source
4. Your game will be available at `https://yourusername.github.io/michigan-trail/`

## Credits

This is a parody game inspired by the classic Oregon Trail, reimagined as a modern family road trip comedy.

## License

Educational/entertainment project.
