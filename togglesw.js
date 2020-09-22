// inlet/outletの数を設定
this.inlets = 1;
this.outlets = 1;

// デフォルト設定でsketchを初期化
this.sketch.default2d();

// プロパティの初期化
this._state = 0; // スイッチの状態
this._POSITION = { // スイッチポジションを表現する定数
  CENTER: 0,
  TOP: 1,
  RIGHT: 2,
  BOTTOM: 3,
  LEFT: 4,
};
this._ledColor = [0.0, 0.0, 0.0, 0.0]; // LEDの色
this._ledBorderColor = [0.5, 0.5, 0.5, 1.0]; // LEDの色
this._MAX_STATE = 4; // スイッチの状態の最大数

this._inactiveColor = [0.5, 0.5, 0.5, 1.0]; // スイッチオフの場合の色（RGBA）
this._activeColor = [0.9, 0.1, 0.1, 1.0]; // スイッチオンの場合の色（RGBA）
this._bgColor = [1.0, 1.0, 1.0, 0.0]; // 背景の色（RGBA）

// 最初の描画
draw();

// コンポーネントを描画する関数
function draw() {
  const sk = this.sketch;

  // 背景色をRGBAで設定
  // sk.glclearcolor(...this._bgColor); は使えない
  // sk.glclearcolor(this._bgColor[0], this._bgColor[1],
  //                 this._bgColor[2], this._bgColor[3]);
  sk.glclearcolor.apply(sk, this._bgColor);

  // 背景を描画
  sk.glclear();

  // 円を描画
  if (this._state == this._POSITION.CENTER) {
    sk.glcolor.apply(sk, this._activeColor);
  } else {
    sk.glcolor.apply(sk, this._inactiveColor);
  }
  sk.moveto(0.0, 0.0, 0.0);
  sk.circle(0.2);
  
  // 右三角形を描画
  if (this._state == this._POSITION.RIGHT) {
    sk.glcolor.apply(sk, this._activeColor);
  } else {
    sk.glcolor.apply(sk, this._inactiveColor);
  }
  sk.tri(0.4, 0.3, 0.0,
         0.9,  0.0, 0.0,
         0.4, -0.3, 0.0); 

  // 左三角形を描画
  if (this._state == this._POSITION.LEFT) {
    sk.glcolor.apply(sk, this._activeColor);
  } else {
    sk.glcolor.apply(sk, this._inactiveColor);
  }
  sk.tri(-0.4, 0.3, 0.0,
         -0.9,  0.0, 0.0,
         -0.4, -0.3, 0.0); 

  // 上三角形を描画
  if (this._state == this._POSITION.TOP) {
    sk.glcolor.apply(sk, this._activeColor);
  } else {
    sk.glcolor.apply(sk, this._inactiveColor);
  }
  sk.tri(0.3, 0.4, 0.0,
         0.0, 0.9, 0.0,
         -0.3, 0.4, 0.0); 

  // 下三角形を描画
  if (this._state == this._POSITION.BOTTOM) {
    sk.glcolor.apply(sk, this._activeColor);
  } else {
    sk.glcolor.apply(sk, this._inactiveColor);
  }
  sk.tri(0.3, -0.4, 0.0,
         0.0, -0.9, 0.0,
         -0.3, -0.4, 0.0);

  // LEDを描画
  sk.moveto(0.7, 0.7, 0.0);
  sk.glcolor.apply(sk, this._ledColor);
  sk.circle(0.18);
  sk.glcolor.apply(sk, this._borderColor);
  sk.framecircle(0.18);
  
  // 描画を反映させる
  this.refresh();
}

// リサイズ時に実行される関数
function onresize() {
  draw();
}

// クリック時に実行される関数
function onclick(x, y) {
  const pos = this.sketch.screentoworld(x, y);
  if (pos[0] < -0.4) {
    if (-0.4 <= pos[1] && pos[1] <= 0.4) {
      this._state = this._POSITION.LEFT;
    }
  } else if (pos[0] <= 0.4) {
    if (pos[1] < -0.4) {
      this._state = this._POSITION.BOTTOM;
    } else if (pos[1] <= 0.4) {
      this._state = this._POSITION.CENTER;
    } else {
      this._state = this._POSITION.TOP;
    }
  } else {
    if (-0.4 <= pos[1] && pos[1] <= 0.4) {
      this._state = this._POSITION.RIGHT;
    }
  }
  draw();
}

// ドラッグ時に実行される関数
function ondrag(x, y, button) {
  onclick(x, y);
  if (!button) {
    bang();
  }
}

// bangを受け取った時に実行される関数
function bang() {
  this.outlet(0, this._state);
}

// intメッセージを受け取った時に実行される関数
function msg_int(val) {
  if (val > this._MAX_STATE) {
    return;
  }
  this._state = val;
  bang();
  draw();
}

// "set"メッセージを受け取った時に実行される関数
function set(val) {
  if (val > this._MAX_STATE) {
    return;
  }
  this._state = val;
  draw();
}

// "led"メッセージを受け取った時に実行される関数
function led(r, g, b, a) {
  r = r || 0.0;
  g = g || 0.0;
  b = b || 0.0;
  a = a || 0.0;
  this._ledColor = [r, g, b, a];
  draw();
}

// "reset"メッセージを受け取った時に実行される関数
function reset() {
  this._state = this._POSITION.CENTER;
  draw();
}

