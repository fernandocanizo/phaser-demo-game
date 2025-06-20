// Globals
let player
let cursors
let level = 1 // Also defines the background scrolling speed
let score = 0
let lives = 3
let scoreText, livesText, cheeseGroup, catGroup, road
let wasCatSpawnedLastTick = false
let pauseButton
let isPaused = false
let isGameOver = false
let restartButton

const laneX = [100, 300]

class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu")
  }

  create() {
    this.add.text(200, 100, "Mouse Runner", {
      fontSize: "32px",
      fill: "#ffffff"
    })
      .setOrigin(0.5)

    this.createButton("Play", 200, 200, () => this.scene.start("GameScene"))
    this.createButton("Scores", 200, 260, () => this.scene.start("ScoreScene"))
    this.createButton("Help", 200, 320, () => this.scene.start("HelpScene"))
    this.createButton("About", 200, 380, () => this.scene.start("AboutScene"))
  }

  createButton(label, x, y, callback) {
    const btn = this.add.text(x, y, label, {
      fontSize: "20px",
      fill: "#ffffff",
      backgroundColor: "#444",
      padding: { x: 10, y: 5 }
    })
      .setOrigin(0.5)
      .setInteractive()

    btn.on("pointerdown", callback)
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene")
  }

  preload() {
    this.load.image("road", "img/road-scaled.down.600x600.png")
    this.load.image("mouse", "img/top.down.mouse.03.png")
    this.load.image("cheese", "img/cheese.piece.01-scaled.down.100x100.png")
    this.load.image("cat1", "img/cat.01-scaled.down.100x100.png")
    this.load.image("cat2", "img/cat.02-scaled.down.100x100.png")
    this.load.image("party-popper", "img/party.popper.png")
    this.load.image("starburst", "img/starburst.png")
  }

  create() {
    road = this.add.tileSprite(200, 300, 400, 600, "road")
    player = this.physics.add.sprite(laneX[Math.random() > 0.5 ? 0 : 1], 500, "mouse")
    player.setCollideWorldBounds(true)

    cursors = this.input.keyboard.createCursorKeys()
    cheeseGroup = this.physics.add.group()
    catGroup = this.physics.add.group()

    this.physics.add.overlap(player, cheeseGroup, collectCheese, null, this)
    this.physics.add.overlap(player, catGroup, hitCat, null, this)

    scoreText = this.add.text(10, 10, "Score: 0", {
      fontSize: "18px",
      fill: "#00ff00",
      stroke: "#000000",
      strokeThickness: 3,
    })
      .setDepth(1)
    livesText = this.add.text(10, 30, "Lives: 3", {
      fontSize: "18px",
      fill: "#00ff00",
      stroke: "#000000",
      strokeThickness: 3,
    })
      .setDepth(1)

    this.spawnEvent = this.time.addEvent({
      delay: 800,
      loop: true,
      callback: spawnItem,
      callbackScope: this,
    })

    pauseButton = this.add.text(360, 10, "⏸", {
      fontSize: "24px",
      fill: "#fff",
      backgroundColor: "#333",
      padding: { x: 6, y: 4 }
    })
      .setOrigin(1, 0)
      .setInteractive()

    pauseButton.on("pointerdown", () => togglePause.call(this))

    // Also pause via pressing "P" key
    this.input.keyboard.on("keydown-P", () => togglePause.call(this))
  }

  update() {
    if (isPaused || isGameOver) {
      return
    }

    road.tilePositionY -= level
    if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
      player.x = laneX[0]
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
      player.x = laneX[1]
    }

    cheeseGroup.getChildren().forEach(obj => {
      obj.y += 2
      if (obj.y > 650) {
        obj.destroy()
      }
    })

    catGroup.getChildren().forEach(obj => {
      obj.y += 2
      if (obj.y > 650) {
        obj.destroy()
      }
    })
  }


}

class ScoreScene extends Phaser.Scene {
  constructor() {
    super("ScoreScene")
  }

  create() {
    this.add.text(200, 100, "High Scores", {
      fontSize: "24px",
      fill: "#fff"
    })
      .setOrigin(0.5)

    this.add.text(200, 160, "(Feature coming soon)", {
      fontSize: "18px",
      fill: "#999"
    })
      .setOrigin(0.5)

    this.createBackButton()
  }

  createBackButton() {
    const btn = this.add.text(200, 500, "Back", {
      fontSize: "18px",
      fill: "#fff",
      backgroundColor: "#444",
      padding: { x: 10, y: 5 }
    })
      .setOrigin(0.5)
      .setInteractive()

    btn.on("pointerdown", () => this.scene.start("MainMenu"))
  }
}

class HelpScene extends Phaser.Scene {
  constructor() {
    super("HelpScene")
  }

  create() {
    this.add.text(200, 100, "Help", {
      fontSize: "24px",
      fill: "#fff"
    })
      .setOrigin(0.5)

    this.add.text(200, 180,
      "← / →  Move lanes\nP       Pause\nENTER Restart", {
      fontSize: "16px",
      fill: "#ccc",
      align: "left"
    })
      .setOrigin(0.5)

    this.createBackButton()
  }

  createBackButton() {
    const btn = this.add.text(200, 500, "Back", {
      fontSize: "18px",
      fill: "#fff",
      backgroundColor: "#444",
      padding: { x: 10, y: 5 }
    })
      .setOrigin(0.5)
      .setInteractive()

    btn.on("pointerdown", () => this.scene.start("MainMenu"))
  }
}

class AboutScene extends Phaser.Scene {
  constructor() {
    super("AboutScene")
  }

  create() {
    this.add.text(200, 100, "About", {
      fontSize: "24px",
      fill: "#fff"
    })
      .setOrigin(0.5)

    this.add.text(200, 180,
      "© 2025 Mouse Runner Team\nDeveloped by @fcanizo and @harpo\nAll rights reserved", {
      fontSize: "14px",
      fill: "#ccc",
      align: "center"
    }).setOrigin(0.5)

    this.createBackButton()
  }

  createBackButton() {
    const btn = this.add.text(200, 500, "Back", {
      fontSize: "18px",
      fill: "#fff",
      backgroundColor: "#444",
      padding: { x: 10, y: 5 }
    })
      .setOrigin(0.5)
      .setInteractive()

    btn.on("pointerdown", () => this.scene.start("MainMenu"))
  }
}

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: "#444",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [MainMenu, GameScene, ScoreScene, HelpScene, AboutScene],
}

// helpers
function triggerGameOver() {
  isGameOver = true
  this.physics.pause()
  this.time.paused = true
  this.spawnEvent.remove()

  const gameOverText = this.add.text(200, 300, "Game Over", {
    fontSize: "16px",
    fill: "#ff0000",
    fontStyle: "bold",
    stroke: "#000000",
    strokeThickness: 3,
  })
    .setOrigin(0.5)
    .setDepth(10)
    .setScale(0)

  this.tweens.add({
    targets: gameOverText,
    scale: 3,
    duration: 1000,
    ease: "Bounce.easeOut"
  })

  restartButton = this.add.text(200, 400, "Restart", {
    fontSize: "24px",
    fill: "#ffffff",
    backgroundColor: "#000000",
    padding: { x: 10, y: 5 },
  })
    .setOrigin(0.5)
    .setInteractive()
    .setDepth(10)

  restartButton.on("pointerdown", () => restartGame.call(this))
  this.input.keyboard.once("keydown-ENTER", () => restartGame.call(this))
}

function spawnItem() {
  const mainLane = Phaser.Math.Between(0, 1)
  const otherLane = mainLane === 0 ? 1 : 0
  const spawnCatChance = 0.4
  const gotCat = Math.random() < spawnCatChance

  if (!wasCatSpawnedLastTick && gotCat) {
    wasCatSpawnedLastTick = !wasCatSpawnedLastTick
    const cat = Math.random() > 0.5 ? "cat1" : "cat2"
    catGroup.create(laneX[mainLane], -50, cat)

    const gotCheese = Math.random() < 0.5
    if (gotCheese) {
      cheeseGroup.create(laneX[otherLane], -50, "cheese")
    }
  } else {
    wasCatSpawnedLastTick = !wasCatSpawnedLastTick
    const gotCheese = Math.random() < 0.5
    if (gotCheese) {
      cheeseGroup.create(laneX[mainLane], -50, "cheese")
    }
  }
}

function collectCheese(player, cheese) {
  showEffect(this, cheese.x, cheese.y, "party-popper")
  cheese.destroy()
  score += 1
  scoreText.setText("Score: " + score)
}

function hitCat(player, cat) {
  showEffect(this, cat.x, cat.y, "starburst")
  cat.destroy()
  lives -= 1
  livesText.setText("Lives: " + lives)

  if (lives <= 0 && !isGameOver) {
    triggerGameOver.call(this)
  }
}

function showEffect(scene, x, y, key) {
  const fx = scene.add.sprite(x, y, key)
  fx.setScale(0.5)
  scene.tweens.add({
    targets: fx,
    alpha: 0,
    scale: 1,
    duration: 400,
    onComplete: () => fx.destroy()
  })
}

function togglePause() {
  isPaused = !isPaused

  if (isPaused) {
    this.physics.world.pause()
    this.time.paused = true
    pauseButton.setText("▶")
  } else {
    this.physics.world.resume()
    this.time.paused = false
    pauseButton.setText("⏸")
  }
}

function restartGame() {
  // Reset state flags
  isGameOver = false
  isPaused = false

  // Clear all existing objects
  cheeseGroup.clear(true, true)
  catGroup.clear(true, true)

  // Reset player position
  player.setPosition(laneX[Math.random() > 0.5 ? 0 : 1], 500)

  // Reset score and lives
  score = 0
  lives = 3
  scoreText.setText("Score: 0")
  livesText.setText("Lives: 3")

  // Resume game logic
  this.physics.resume()
  this.time.paused = false

  // Restart spawn timer
  this.spawnEvent = this.time.addEvent({
    delay: 800,
    loop: true,
    callback: spawnItem,
    callbackScope: this
  })

  // Remove all UI elements from game over screen
  this.children.list.forEach(child => {
    if (child.text === "Game Over") {
      child.destroy()
    }
    if (child.text === "Restart") {
      child.destroy()
    }
  })

  if (restartButton) {
    restartButton.destroy()
    restartButton = null
  }
}

// main
const game = new Phaser.Game(config)
game.scene.start("MainMenu")
