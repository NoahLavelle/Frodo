"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectFour = void 0;
const index_1 = require("../index");
var SlotType;
(function (SlotType) {
    SlotType[SlotType["Empty"] = 0] = "Empty";
    SlotType[SlotType["PlayerOne"] = 1] = "PlayerOne";
    SlotType[SlotType["PlayerTwo"] = 2] = "PlayerTwo";
})(SlotType || (SlotType = {}));
const GridDimensions = {
    x: 7,
    y: 7,
};
const SlotText = {
    0: '⬜',
    1: '🔵',
    2: '🔴',
};
const NumberReactions = {
    '1️⃣': 1,
    '2️⃣': 2,
    '3️⃣': 3,
    '4️⃣': 4,
    '5️⃣': 5,
    '6️⃣': 6,
    '7️⃣': 7,
};
class ConnectFour {
    constructor(interaction) {
        this.interaction = interaction;
        this.players = [interaction.user, index_1.client.users.cache.find((user) => user.id == interaction.options[0].value)];
        this.currentPlayer = this.players[0];
        this.isPlayerOne = true;
        this.grid = [];
        this.header = `<@${this.players[0].id}> has challenged <@${this.players[1].id}> to a game of connect four.\nCurrent Go: ${SlotText[1]} <@${this.currentPlayer.id}>\n\n`;
        this.runGame();
    }
    runGame() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.players[1] == null || this.players[1].bot) {
                yield this.interaction.reply('The player could not be found or was a bot');
                return;
            }
            yield this.interaction.fetchReply().then((msg) => this.message = msg);
            this.generateGrid();
            this.updateMessage();
            for (const value of Object.keys(NumberReactions)) {
                yield this.message.react(value);
            }
            const filter = (reaction, user) => {
                return Object.keys(NumberReactions).includes(reaction.emoji.name) && this.currentPlayer == user;
            };
            while (true) {
                this.header = `<@${this.players[0].id}> has challenged <@${this.players[1].id}> to a game of connect four.
						\nCurrent Go: ${SlotText[this.isPlayerOne ? 2 : 1]} ${this.isPlayerOne ? this.players[1] : this.players[0]}\n\n`;
                yield this.message.awaitReactions(filter, { max: 1 })
                    .then((collected) => __awaiter(this, void 0, void 0, function* () {
                    const reaction = collected.first();
                    const columnNumber = NumberReactions[reaction.emoji.name] - 1;
                    let rowNumber = GridDimensions.y - 1;
                    const userReactions = this.message.reactions.cache.filter((reaction) => reaction.users.cache.has(this.currentPlayer.id));
                    for (const reaction of userReactions.values()) {
                        yield reaction.users.remove(this.currentPlayer.id);
                    }
                    for (let i = GridDimensions.y - 1; i >= 0; i--) {
                        if (this.grid[i][columnNumber] == SlotType.Empty) {
                            this.grid[i][columnNumber] = this.isPlayerOne ? SlotType.PlayerOne : SlotType.PlayerTwo;
                            this.updateMessage();
                            break;
                        }
                        rowNumber--;
                    }
                    let isWin = false;
                    try {
                        isWin = this.checkHorizontalWin(rowNumber);
                        if (!isWin) {
                            isWin = this.checkVerticalWin(columnNumber);
                            if (!isWin) {
                                isWin = this.checkDiagonalWin(columnNumber, rowNumber, true);
                                if (!isWin)
                                    isWin = this.checkDiagonalWin(columnNumber, rowNumber, false);
                            }
                        }
                    }
                    catch (IndexOutOfRangeException) {
                        return;
                    }
                    if (isWin) {
                        this.win();
                    }
                    this.isPlayerOne = !this.isPlayerOne;
                    this.currentPlayer = this.isPlayerOne ? this.players[0] : this.players[1];
                }));
            }
        });
    }
    generateGrid() {
        for (let i = 0; i < GridDimensions.y; i++) {
            for (let j = 0; j < GridDimensions.x; j++) {
                if (!this.grid[i])
                    this.grid.push([]);
                this.grid[i].push(SlotType.Empty);
            }
        }
    }
    updateMessage() {
        let message = this.header;
        this.grid.forEach((i) => {
            i.forEach((j) => {
                message += SlotText[j];
            });
            message += '\n';
        });
        message += ':one::two::three::four::five::six::seven:';
        this.interaction.editReply(message);
    }
    checkHorizontalWin(row) {
        let streak = 0;
        for (let i = 0; i < GridDimensions.x; i++) {
            if (this.grid[row][i] == SlotType.PlayerOne && this.isPlayerOne ||
                this.grid[row][i] == SlotType.PlayerTwo && !this.isPlayerOne) {
                streak++;
                if (streak == 4)
                    return true;
            }
            else {
                streak = 0;
            }
        }
        return false;
    }
    checkVerticalWin(column) {
        let streak = 0;
        for (let i = 0; i < GridDimensions.y; i++) {
            if (this.grid[i][column] == SlotType.PlayerOne && this.isPlayerOne ||
                this.grid[i][column] == SlotType.PlayerTwo && !this.isPlayerOne) {
                streak++;
                if (streak == 4)
                    return true;
            }
            else {
                streak = 0;
            }
        }
        return false;
    }
    checkDiagonalWin(column, row, isRight) {
        const diagonal = [];
        try {
            while (true) {
                const gridSlot = this.grid[row][column];
                column = isRight ? column - 1 : column + 1;
                row++;
            }
        }
        catch (_a) {
            column = isRight ? column + 1 : column - 1;
            row--;
        }
        try {
            let streak = 0;
            while (true) {
                if (this.grid[row][column] == SlotType.PlayerOne && this.isPlayerOne ||
                    this.grid[row][column] == SlotType.PlayerTwo && !this.isPlayerOne) {
                    streak++;
                    if (streak == 4)
                        return true;
                }
                else {
                    streak = 0;
                }
                row--;
                column = isRight ? column + 1 : column - 1;
            }
        }
        catch (_b) { }
        return false;
    }
    win() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.interaction.fetchReply().then((msg) => this.message = msg);
            yield this.message.reactions.removeAll();
            yield this.interaction.editReply(this.message.content += `\n\n<@${this.currentPlayer.id}> wins!`);
        });
    }
}
exports.ConnectFour = ConnectFour;
//# sourceMappingURL=connectFour.js.map