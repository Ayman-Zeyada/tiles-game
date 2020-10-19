import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

import {
  SelectedTile,
  Tile,
  TilesGrid,
} from './models/app-models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef;
  @ViewChild('inner', { static: true }) inner: ElementRef;

  tilesGrid: TilesGrid;

  private gameInterval: any;
  private innerBottom = 100;
  selectedTiles: Array<SelectedTile> = [];
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.tilesGrid = new TilesGrid(6);
    setTimeout(() => {
      this.setUpUI();
    }, 100);
  }

  setUpUI(): void {
    const wrapperEl = this.wrapper.nativeElement as HTMLElement;
    const innerEl = this.inner.nativeElement as HTMLElement;
    const columnWidth = wrapperEl.offsetWidth / 6;
    const rowsNumber = Math.ceil(wrapperEl.offsetHeight / columnWidth);
    const tilesTotal = rowsNumber * 6;

    this.setUpGame(tilesTotal);
    setTimeout(() => {
      this.innerBottom = -innerEl.offsetHeight;
      this.renderer.setStyle(
        this.inner.nativeElement,
        'bottom',
        `${this.innerBottom}px`
      );
    }, 500);
  }

  setUpGame(tilesNumber: number): void {
    this.tilesGrid = new TilesGrid(6);
    this.tilesGrid.newGame(tilesNumber);
  }

  start(): void {
    this.gameInterval = setInterval(() => {
      const wrapperTop = this.wrapper.nativeElement.getBoundingClientRect().top;
      const innerTop = this.inner.nativeElement.getBoundingClientRect().top;
      if (wrapperTop >= innerTop) {
        this.end();
      } else {
        this.innerBottom += 1;
        this.renderer.setStyle(
          this.inner.nativeElement,
          'bottom',
          `${this.innerBottom}px`
        );
      }
    }, 30);
  }

  end(): void {
    clearInterval(this.gameInterval);
    this.gameInterval = null;
  }

  onTileClick(tile: Tile, colIndex: number): void {
    tile.selected = true;
    if (this.selectedTiles.length) {
      if (this.selectedTiles.some((t) => t.tile.id === tile.id)) {
        return;
      }
      if (this.selectedTiles[0].tile.type === tile.type) {
        this.selectedTiles.push(new SelectedTile(tile, colIndex));
        if (this.selectedTiles.length === 3) {
          this.tilesGrid.deleteTiles(this.selectedTiles);
          this.selectedTiles = [];
        }
      } else {
        this.selectedTiles.forEach((t) => (t.tile.selected = false));
        this.selectedTiles = [];
        this.selectedTiles.push(new SelectedTile(tile, colIndex));
      }
    } else {
      this.selectedTiles.push(new SelectedTile(tile, colIndex));
    }
  }
}
