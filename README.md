# InfoVis MiniProject

This is a "mini" visualization university project for the "InfoVis" subject using D3.js to draw stickman figures based on multivariate data and dynamically sort them based on user interactions.

## Features

- Draws 10 stickman figures, each representing a data case with four quantitative variables.
- Each variable controls a different aspect of the stickman figure:
  - Leg length
  - Arm length
  - Head size
  - Bust length
- Click on a part of a stickman figure to sort all stick figures based on the corresponding variable.
- Smooth animations for sorting transitions.

## Project Structure

- `data.json`: Contains the multivariate data for the stick figures.
- `index.html`: The main HTML file containing the structure of the webpage.
- `script.js`: The JavaScript file implementing the D3.js visualization and interactivity.

## Data Format

The `data.json` file should contain an array of objects, each representing a data case with four quantitative variables. For example:

```json
[
    {
        "legLength": 50,
        "armLength": 40,
        "headRadius": 20,
        "bustLength": 60
    }
]
```

## Usage

- Clone the repository

```
git clone https://github.com/TheBlind11/infovis-miniproject.git
cd infovis-miniproject
```

- Start the server

```
bash start_server.sh
```

- Open your browser and go to http://localhost:8888/

## User Interaction

Click on the head, arms, bust, or legs of any stick figure to sort all stick figures based on the corresponding variable.
