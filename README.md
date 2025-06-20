# Phaser Demo Game

A very simple game made with Phaser to test its capabilities and general feel

## Run

Change into the directory holding this repo and run a server like `pnpx serve .` or `python3 -m http.server`.

## Game description

It will be a game of avoiding collisions and collecting prizes set up on a 2D world.

The player will be a mouse running on a street. The street will move alone at a level-defined pace. The player can only make two moves: a key for left, which moves it to the left lane, and a key right that moves it to the right lane of the street.

The demo will only have 3 levels. Each level will run at an increased speed.

The mouse will collect cubic pieces of cheese, that will be the prize. And must avoid running into a cat, that will be the enemy.

Both, cats and cheese pieces are repeated randomly at different points on each lane. The only condition to take into account is to give the mouse always a way to escape, so if the random function defines that a cat must be put on a lane at a certain position, the other lane cannot have a cat too, it will be either an empty space or a piece of cheese.

Level one ends when the player has collected 20 pieces of cheese.
Level two ends when the player has collected 30 pieces of cheese.
Level three ends when the player has collected 50 pieces of cheese.
