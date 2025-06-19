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

const laneX = [100, 300]

const game = new Phaser.Game(config)

function preload() {
  this.load.image("road", "img/road-scaled.down.600x600.png")
  this.load.image("mouse", "img/top.down.mouse.03.png")
  this.load.image("cheese", "img/cheese.piece.01-scaled.down.100x100.png")
  this.load.image("cat1", "img/cat.01-scaled.down.100x100.png")
  this.load.image("cat2", "img/cat.02-scaled.down.100x100.png")
}

function create() {
  road = this.add.tileSprite(200, 300, 400, 600, "road")
  player = this.physics.add.sprite(200, 500, "mouse")
  player.setCollideWorldBounds(true)

  cursors = this.input.keyboard.createCursorKeys()
  cheeseGroup = this.physics.add.group()
  catGroup = this.physics.add.group()

  this.physics.add.overlap(player, cheeseGroup, collectCheese, null, this)
  this.physics.add.overlap(player, catGroup, hitCat, null, this)

  scoreText = this.add.text(10, 10, "Score: 0", { fontSize: "18px", fill: "#fff" })
  livesText = this.add.text(10, 30, "Lives: 3", { fontSize: "18px", fill: "#fff" })

  this.time.addEvent({
    delay: 800,
    loop: true,
    callback: spawnItem,
    callbackScope: this
  })
}

function update() {
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
  const lane = Phaser.Math.Between(0, 1)
  const otherLane = lane === 0 ? 1 : 0
  const spawnCat = Phaser.Math.Between(0, 1)

  if (spawnCat) {
    catGroup.create(laneX[lane], -50, "cat")
    if (Phaser.Math.Between(0, 1)) {
      cheeseGroup.create(laneX[otherLane], -50, "cheese")
    }
  } else {
    cheeseGroup.create(laneX[lane], -50, "cheese")
  }
}

function collectCheese(player, cheese) {
  cheese.destroy()
  score += 1
  scoreText.setText("Score: " + score)
}

function hitCat(player, cat) {
  cat.destroy()
  lives -= 1
  livesText.setText("Lives: " + lives)
  if (lives <= 0) {
    this.physics.pause()
    livesText.setText("Game Over")
  }
}
