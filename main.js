const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: "#87ceeb",
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
  cursors = this.input.keyboard.createCursorKeys()
}

function update() {
  road.tilePositionY -= 2
  if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
    player.x = 100
  } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
    player.x = 300
  }
}

