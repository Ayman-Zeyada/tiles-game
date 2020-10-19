export class TilesGrid {
  columns: Array<Column> = [];
  private tiles: Array<Tile> = [];

  constructor(columnsNumber: number) {
    for (let i = 1; i <= columnsNumber; i++) {
      this.columns.push(new Column(100 / columnsNumber));
    }
  }

  newGame(tilesNumber: number): void {
    for (let levelRound = 1; levelRound < 4; levelRound++) {
      const tileTypesNumber = Object.keys(TileType).length / 2;
      let numberOfEachTile = Math.round(tilesNumber / tileTypesNumber);
      while (numberOfEachTile % 3 !== 0) {
        numberOfEachTile++;
      }

      let tiles: Array<Tile> = [];
      for (let i = 0; i < tileTypesNumber; i++) {
        for (let x = 0; x < numberOfEachTile; x++) {
          tiles.push(GameTile.create(i));
        }
      }

      tiles = GameTile.shuffle(tiles);
      this.tiles.push(...tiles);
    }

    let currentColIndex = 0;
    const lastColIndex = this.columns.length - 1;
    for (const tile of this.tiles) {
      if (currentColIndex > lastColIndex) {
        currentColIndex = 0;
      }

      this.columns[currentColIndex].tiles.push(tile);
      currentColIndex++;
    }
  }

  deleteTiles(tiles: Array<SelectedTile>): void {
    tiles.forEach(tile => {
      const tilesArr = this.columns[tile.colIndex].tiles;
      const index = tilesArr.findIndex(t => t.id === tile.tile.id);
      tilesArr.splice(index, 1);
    });

    tiles = [];
  }
}

export class Column {
  width: number;
  tiles: Array<Tile> = [];

  constructor(width: number) {
    this.width = width;
  }
}

export class Tile {
  type: TileType;
  img: string;
  id: string;
  selected: boolean;

  constructor(imgUrl: string) {
    this.img = imgUrl;
    this.id = this.createUUID();
  }

  private createUUID(): string {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      (c) => {
        // tslint:disable-next-line: no-bitwise
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        // tslint:disable-next-line: no-bitwise
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }
}

export class LionTile extends Tile {
  constructor() {
    super('../assets/images/lion.png');
    this.type = TileType.LION;
  }
}

export class TigerTile extends Tile {
  constructor() {
    super('../assets/images/tiger.png');
    this.type = TileType.TIGER;
  }
}

export class BananaTile extends Tile {
  constructor() {
    super('../assets/images/banana.png');
    this.type = TileType.BANANA;
  }
}

export class BlueFlowerTile extends Tile {
  constructor() {
    super('../assets/images/blue-flower.png');
    this.type = TileType.BLUE_FLOWER;
  }
}

export class LotusFlowerTile extends Tile {
  constructor() {
    super('../assets/images/lotus-flower.png');
    this.type = TileType.LOTUS_FLOWER;
  }
}

export enum TileType {
  LION = 0,
  TIGER = 1,
  BANANA = 2,
  BLUE_FLOWER = 3,
  LOTUS_FLOWER = 4,
}

export class GameTile {
  static create(type: TileType): Tile {
    switch (type) {
      case TileType.LION:
        return new LionTile();
      case TileType.TIGER:
        return new TigerTile();
      case TileType.BANANA:
        return new BananaTile();
      case TileType.BLUE_FLOWER:
        return new BlueFlowerTile();
      case TileType.LOTUS_FLOWER:
        return new LotusFlowerTile();
      default:
        throw Error('Unknown Tile Type');
    }
  }

  static shuffle(tiles: Array<Tile>): Array<Tile> {
    let currentIndex = tiles.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = tiles[currentIndex];
      tiles[currentIndex] = tiles[randomIndex];
      tiles[randomIndex] = temporaryValue;
    }

    return tiles;
  }
}

export class SelectedTile {
  tile: Tile;
  colIndex: number;
  constructor(tile: Tile, colIndex: number) {
    this.tile = tile;
    this.colIndex = colIndex;
  }
}
