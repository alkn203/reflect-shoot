// 型定義ファイルを参照
/// <reference path="node_modules/phina.js.d.ts/globalized/index.d.ts" />

phina.globalize();
// メインシーン
phina.define('MainScene', {
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit();
    // 背景色
    //this.backgroundColor = '#444';
    
    var circle = CircleShape({
      fill: null,
      x: 320,
      y: 320,
    }).addChildTo(this);
    circle.physical.force(0, 5);
    // 参照用
    this.circle = circle;
    //
    this.bar = Bar().addChildTo(this).setPosition(320, 700);
    this.bar.initPoints();
  },
  //
  onpointmove: function(e) {
    var rot = e.pointer.dx * 0.1;
    // バー回転
    this.bar.rotation += rot;
    this.bar.rotatePoints(rot);
  },
  //
  update: function() {
    //
    var points = this.bar.points;
    // 線の両端
    var p1 = points[0];
    var p2 = points[1];
    // 当たcleartorクラスの円を作成
    var circle = Circle(this.circle.x, this.circle.y, this.circle.radius);
    // 円とclear
    if (Collision.testCircleLine(circle, p1, p2)) {
      // 線分の法線ベクトル（正規化）
      var n = Vector2.normal(p1, p2).normalize();
      // 線分上の一番近い点 
      //var point = this.nearest(p1, p2, Vector2(circle.x, circle.y));
      // めり込まないように補正
      //this.circle.x = point.x + n.x * circle.radius;
      //this.circle.y = point.y + n.y * circle.radius;
      // 反射ベクトル
      var r = Vector2.reflect(this.circle.physical.velocity, n);
      this.circle.physical.velocity = r;
    }
  },
});
/*
 * バークラス
 */
phina.define('Bar', {
  superClass: 'RectangleShape',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit({
      width: 640,
      height: 64,
    });
    
    this.points = [];
  },
  //
  initPoints: function() {
    var points = this.points;
    // 矩形の上部２頂点
    points.push(Vector2(this.left, this.top));
    points.push(Vector2(this.right, this.top));
    // 回転の中心座標
    this.c = Vector2(this.centerX, this.centerY);
    
  },
  // 回転処理
  rotatePoints: function(rot) {
    // 2頂点の回転後の座標を求める
    this.points.each(function(p) {
      p.rotate(Math.degToRad(rot), this.c);  
    }, this);
  },
});
// メイン
phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
  });
  app.run();
});