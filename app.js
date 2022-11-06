function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            showStart: true,
            currentRound: 0,
            winner: null,
            remainingSpecialAttacks: 2,
            remainingHeals: 3,
            playerHealth: 100,
            playerMaxHealth: 100,
            monsterHealth: 100,
            monsterMaxHealth: 100,
            player: {
                level: 1,
                exp: 0,
                characterNb: 0,
                name: '',
            },
            characters: [
                {
                    avatar: './assets/swordsman.png',
                    avatarAlt: 'swordsman avatar',
                    weapon: './assets/sword.png',
                },
                {
                    avatar: './assets/knight.png',
                    avatarAlt: 'knight avatar',
                    weapon: './assets/sword.png',
                },
                {
                    avatar: './assets/crossbow.png',
                    avatarAlt: 'crossbow avatar',
                    weapon: './assets/crossbow-1.png',
                },
                {
                    avatar: './assets/bow.png',
                    avatarAlt: 'bow avatar',
                    weapon: './assets/bow-and-arrow.png',
                },
                {
                    avatar: './assets/wizard.png',
                    avatarAlt: 'wizard avatar',
                    weapon: './assets/wizard-1.png',
                },
                {
                    avatar: './assets/magician.png',
                    avatarAlt: 'magician avatar',
                    weapon: './assets/wizard-1.png',
                },
            ],
            monster: {
                level: 1,
                avatar: './assets/cyclops.png',
                avatarAlt: 'cyclops avatar',
                name: 'Cyclops',
            },
            monsters: [
                {
                    avatar: './assets/cyclops.png',
                    avatarAlt: 'cyclops avatar',
                    name: 'Cyclops',
                },
                {
                    avatar: './assets/cthulhu.png',
                    avatarAlt: 'cthulhu avatar',
                    name: 'Cthulhu',
                },
                {
                    avatar: './assets/griffin.png',
                    avatarAlt: 'griffin avatar',
                    name: 'Griffin',
                },
                {
                    avatar: './assets/minotaur.png',
                    avatarAlt: 'minotaur avatar',
                    name: 'Minotaur',
                },
                {
                    avatar: './assets/dead.png',
                    avatarAlt: 'dead king avatar',
                    name: 'Dead king',
                },
            ]
        };
    },
    computed: {
        getMonster() {
            const randomMonster = getRandomValue(0, this.monsters.length);
            return this.monsters[randomMonster];
        },
        monsterHealthBarStyles() {
            return {width: this.monsterHealth + '%'}
        },
        playerHealthBarStyles() {
            return {width: this.playerHealth + '%'}
        },
        playerExpBarStyles() {
            return {width: this.player.exp + '%'}
        },
        mayUseSpecialAttack() {
            return this.remainingSpecialAttacks === 0;
        },
        mayUseHeal() {
            if (this.playerHealth === 100) {
                return true;
            }
            return this.remainingHeals === 0;
        },
        playerLevelUp() {
            return this.player.exp + 25 === 100;
        },
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'player';
            }
        },
    },
    methods: {
        startGame() {
            this.showStart = false;
        },
        playerEvolution() {
            this.remainingSpecialAttacks = 2;
            this.remainingHeals = 3;
            this.player.exp = this.player.exp + 25;
            if (this.player.exp === 100) {
                this.player.level++;
                this.monster.level++;
                this.playerMaxHealth = this.playerMaxHealth + 30;
                this.monsterMaxHealth = this.monsterMaxHealth + 30;
                this.player.exp = 0;
            }
            this.playerHealth = this.playerMaxHealth;
            this.monsterHealth = this.monsterMaxHealth;
            this.winner = null;
        },
        reset() {
            this.remainingSpecialAttacks = 2;
            this.remainingHeals = 3;
            this.playerHealth = 100;
            this.playerMaxHealth = 100;
            this.player.level = 1;
            this.player.exp = 0;
            this.monsterHealth = 100;
            this.monsterMaxHealth = 100;
            this.winner = null;
        },
        surrender() {
            this.winner = 'surrender';
        },
        attackMonster() {
            this.currentRound++;
            const min = 10 * (this.player.level * 0.5);
            const max = 20 * (this.player.level * 0.5);
            const attackValue = getRandomValue(min, max);
            if (this.monsterHealth < attackValue) {
                this.monsterHealth = 0;
            } else {
                this.monsterHealth -= attackValue;
            }
            setTimeout(this.attackPlayer, 200);
        },
        attackPlayer() {
            const min = 12 * (this.monster.level * 0.5);
            const max = 22 * (this.monster.level * 0.5);
            const attackValue = getRandomValue(min, max);
            if (this.playerHealth < attackValue) {
                this.playerHealth = 0;
            } else {
                this.playerHealth -= attackValue;
            }
        },
        specialAttackMonster() {
            this.remainingSpecialAttacks--;
            this.currentRound++;
            const min = 20 * (this.player.level * 0.5);
            const max = 30 * (this.player.level * 0.5);
            const attackValue = getRandomValue(min, max);
            if (this.monsterHealth < attackValue) {
                this.monsterHealth = 0;
            } else {
                this.monsterHealth -= attackValue;
            }
            setTimeout(this.attackPlayer, 200);
        },
        healPlayer() {
            const min = 20 * (this.player.level * 0.5);
            const max = 35 * (this.player.level * 0.5);
            const healValue = getRandomValue(min, max);
            if (this.playerHealth + healValue > this.playerMaxHealth) {
                this.playerHealth = this.playerMaxHealth;
            } else {
                this.playerHealth += healValue;
            }
            this.remainingHeals--;
            this.currentRound++;
            setTimeout(this.attackPlayer, 200);
        }
    }
});

app.mount('#game');
