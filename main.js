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
  scene: {
    preload,
    create,
    update,
  },
}

let player
let cursors
let level = 1 // Also defines the background scrolling speed
let score = 0
let lives = 3
let scoreText, livesText, cheeseGroup, catGroup, road
let wasCatSpawnedLastTick = false
let pauseButton
let isPaused = false

const laneX = [100, 300]

const game = new Phaser.Game(config)

function preload() {
  this.load.image("road", "img/road-scaled.down.600x600.png")
  this.load.image("mouse", "img/top.down.mouse.03.png")
  this.load.image("cheese", "img/cheese.piece.01-scaled.down.100x100.png")
  this.load.image("cat1", "img/cat.01-scaled.down.100x100.png")
  this.load.image("cat2", "img/cat.02-scaled.down.100x100.png")
  this.load.image("party-popper", "img/party.popper.png")
  this.load.image("starburst", "img/starburst.png")
}

function create() {
  road = this.add.tileSprite(200, 300, 400, 600, "road")
  player = this.physics.add.sprite(300, 500, "mouse")
  player.setCollideWorldBounds(true)

  cursors = this.input.keyboard.createCursorKeys()
  cheeseGroup = this.physics.add.group()
  catGroup = this.physics.add.group()

  this.physics.add.overlap(player, cheeseGroup, collectCheese, null, this)
  this.physics.add.overlap(player, catGroup, hitCat, null, this)

  scoreText = this.add.text(10, 10, "Score: 0", { fontSize: "18px", fill: "#00ff00" })
    .setDepth(1)
  livesText = this.add.text(10, 30, "Lives: 3", { fontSize: "18px", fill: "#00ff00" })
    .setDepth(1)

  this.time.addEvent({
    delay: 800,
    loop: true,
    callback: spawnItem,
    callbackScope: this
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

function update() {
  if (isPaused) {
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
  if (lives <= 0) {
    this.physics.pause()
    livesText.setText("Game Over")
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

