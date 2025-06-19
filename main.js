const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: '#87ceeb',
  physics: {
    default: 'arcade',
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
};

let player;
let cursors;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('mouse', 'https://examples.phaser.io/assets/sprites/mouse.png'); // Placeholder
  this.load.image('cheese', 'https://examples.phaser.io/assets/sprites/block.png'); // Placeholder
  this.load.image('cat', 'https://examples.phaser.io/assets/sprites/baddie.png'); // Placeholder
}

function create() {
  player = this.physics.add.sprite(200, 500, 'mouse');
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
    player.x = 100;
  } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
    player.x = 300;
  }
}

