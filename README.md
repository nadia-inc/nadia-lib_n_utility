# n_utility
FE用Javascriptまとめ。(徐々に追加中。)  
`window.nUtility` の中に格納。  
`/dist/_assets/js/n_utility.js` を読み込んで使用する。  
※webpackのsource-mapが入ってるので、使用するときは `npm run build`

## 動作要件
All devices

## nUtility.userAgent
デバイス判定が入っているobject
```
nUtility.userAgent = {}
  isPC: boolean,
  isSP: boolean,

  //mobile
  isiOS: boolean,
  isAndroid: boolean,
  android: Number,

  //tablet
  isiPad: boolean,
  isAndroidTablet: boolean,

  //browser
  isChrome: boolean,
  isSafari: boolean,
  isFirefox: boolean,
  isIE: boolean,
  isEdge: boolean
}
```
### USAGE
```
if( nUtility.userAgent.isIE || nUtility.userAgent.isEdge )
{ // ブラウザがIEもしくはEdgeの場合の処理
  windo.location.href = 'https://www.google.co.jp/chrome/index.html';
}
```

## nUtility.nScrollEvent
windowのスクロールによってイベントを発火する関数。
`nUtility.nScrollEvent.add(target)` で使用。  
（今のところaddだけ）  

### nUtility.nScrollEvent.add
#### 第一引数
イベントを付加するターゲットを入れる。
```
nUtility.nScrollEvent.add(target,{})
```
配列、jQueryのでもOK
```
nUtility.nScrollEvent.add(document.getElementsByClassName('className'),{})
nUtility.nScrollEvent.add($('.className'),{})
```

#### 第二引数（object）
- eventOnce: boolean (default:true)  
すべてのイベントを1度だけにするかどうか。

- eventPosition: Number (0〜1、default:0)  
`onEvent`を発火する画面位置の設定。0→画面に表示されてすぐ、0.5→真ん中、1→画面から消える時。  
スクロール方向もみてます。

- onEvent (argument:target、default:null)  
`eventPosition`で設定した位置で発火するイベント。  
引数は`nUtility.nScrollEvent.add`の第一引数が帰ってくる。  
※`this.target`も同じものになるけどthisの値が変わる時用（thisを束縛すれば解決するが念の為わかりやすく）

- onShow (argument:target、default:null)  
画面に表示された時に発火するイベント

- onHide (argument:target、default:null)  
画面から非表示なった時に発火するイベント


### USAGE
```
const target = document.getElementById('target');
nUtility.nScrollEvent.add(target,{
  eventOnce: false,
  eventPosition: 0.5,
  onEvent : function(obj){
    // user event
  },
  onShow : function(obj){
    // user event
  },
  onHide : function(obj){
    // user event
  }
});
```
