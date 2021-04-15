import './index.css';
import { Game } from './components/game';

const canvas = new Game('canvas');

canvas.draw();

/* eslint @typescript-eslint/no-unsafe-member-access: "off",
          @typescript-eslint/no-unsafe-call: "off",
          @typescript-eslint/no-unsafe-assignment: "off",
          @typescript-eslint/no-var-requires: "off"
*/
// Hot Module Replacement
declare let module: { hot: any };

if (module.hot) {
  module.hot.accept('./components/game', () => {
    const newCanvas = new Game('canvas');

    newCanvas.draw();
  });
}
