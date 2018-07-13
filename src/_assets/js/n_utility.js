/**
 *                             $$\     $$\ $$\ $$\   $$\
 *                             $$ |    \__|$$ |\__|  $$ |
 * $$$$$$$\        $$\   $$\ $$$$$$\   $$\ $$ |$$\ $$$$$$\   $$\   $$\
 * $$  __$$\       $$ |  $$ |\_$$  _|  $$ |$$ |$$ |\_$$  _|  $$ |  $$ |
 * $$ |  $$ |      $$ |  $$ |  $$ |    $$ |$$ |$$ |  $$ |    $$ |  $$ |
 * $$ |  $$ |      $$ |  $$ |  $$ |$$\ $$ |$$ |$$ |  $$ |$$\ $$ |  $$ |
 * $$ |  $$ |      \$$$$$$  |  \$$$$  |$$ |$$ |$$ |  \$$$$  |\$$$$$$$ |
 * \__|  \__|$$$$$$\\______/    \____/ \__|\__|\__|   \____/  \____$$ |
 *           \______|                                        $$\   $$ |
 *                                                           \$$$$$$  |
 *                                                            \______/
 *  Version : 1.0.0
 *  Author  : n-igarashi
 *  Repo    : https://github.com/nadia-inc/nadia-lib_n_utility
 *  Issues  : https://github.com/nadia-inc/nadia-lib_n_utility/issues
 *
 *  <(°.°)>
 */


(function( ){

  let globals = window.nUtility || {};
  window.nUtility = globals;

  let userAgent = globals.userAgent || {};

  userAgent = (function (obj) {
    let ua = navigator.userAgent,
        uaLowerCase = window.navigator.userAgent.toLowerCase();

    let devices = {
        isPC: false,
        isSP: false,

        //mobile
        isiOS: false,
        isAndroid: false,
        android: 'version',

        //tablet
        isiPad: false,
        isAndroidTablet: false,

        //browser
        isChrome: false,
        isSafari: false,
        isFirefox: false,
        isIE: false,
        isEdge: false,
    };



    devices.isSP = ((ua.indexOf('iPhone') > 0 && ua.indexOf('iPad') == -1) || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0);

    //iOS
    devices.isiOS = (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0);

    //Android
    devices.isAndroid = (ua.indexOf('Android') > 0);

    //Android ver
    if(ua.indexOf('Android') > 0){
        devices.androidVersion = parseFloat(navigator.userAgent.slice(navigator.userAgent.indexOf('Android')+8));
    }

    //iPad
    devices.isiPad = (ua.indexOf('iPad') > 0);

    //AndroidTablet
    devices.isAndroidTablet = (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') == -1);

    //PC
    devices.isPC = (!devices.isSP && !devices.isAndroidTablet && !devices.isiPad);

    //Chrome
    devices.isChrome = ((uaLowerCase.indexOf('chrome') > -1) && (uaLowerCase.indexOf('edge') == -1));

    //Safari
    devices.isSafari = ((uaLowerCase.indexOf('safari') > -1) && (uaLowerCase.indexOf('chrome') == -1) && (uaLowerCase.indexOf('edge') == -1));

    //Firefox
    devices.isFirefox = (uaLowerCase.indexOf('firefox') != -1);

    //IE
    if(uaLowerCase.match(/(msie|MSIE)/) || uaLowerCase.match(/(T|t)rident/)) {
        var ieVersion = uaLowerCase.match(/((msie|MSIE)\s|rv:)([\d\.]+)/)[3];
        ieVersion = parseInt(ieVersion);

        devices.isIE = (ieVersion === 11 || ieVersion === 10);
    }
    devices.isEdge = (uaLowerCase.indexOf('edge') != -1);

    return devices;

  })();
  globals.userAgent = userAgent;

})();


(function( ){

  let globals = window.nUtility || {};
  window.nUtility = globals;

  let nScrollEvent = globals.nScrollEvent || {};
  globals.nScrollEvent = nScrollEvent;

  nScrollEvent.add = function( target, setting ){

    if(target && target.length){
      for(let i = 0 ; i < target.length ; i++){
        let copySetting;
        copySetting = Object.assign( {}, setting );
        nScrollEvent.add(target[i], copySetting);

      }

      return;
    }

    // setting初期化
    setting = setting || {};
    setting.target = target;
    setting.isShow = false;
    setting.evented = false;
    setting.eventOnce = (setting.eventOnce == undefined)? true : setting.eventOnce;
    setting.eventPosition = setting.eventPosition || 0;
    setting.onEvent = setting.onEvent || null;
    setting.onShow = setting.onShow || null;
    setting.onHide = setting.onHide || null;
    setting.onShowDirection = null;


    const _scrollEvent = () => {

      const scroll = window.pageYOffset ;
      const eventTarget = target;
      const eventTargetH = eventTarget.offsetHeight;

      const windowH  = window.innerHeight;
      const eventOffset = {
        top: windowH * setting.eventPosition,
        bottom: windowH - windowH * setting.eventPosition
      }


      let eventTargetY = eventTarget.offsetTop;
      let parent = eventTarget.offsetParent;

      while( parent && parent != document.body ){

        eventTargetY += parent.offsetTop ;
        parent = parent.offsetParent ;

      }

      // position
      const targetShowPos = eventTargetY - windowH;
      const targetHideTopPos = eventTargetY + eventTargetH;
      //onEvent
      const targetEventPos ={
        top: eventTargetY - windowH + eventOffset.top,
        bottom: eventTargetY - windowH + eventOffset.bottom
      };
      // targetが上下中心のposition
      const halfPosition = eventTargetY - windowH/2;

      const toString = Object.prototype.toString;
      function typeOf(obj) {
        return toString.call(obj).slice(8, -1).toLowerCase();
      }

      // if(!setting.isShow) {
        if(targetShowPos < scroll && scroll < targetHideTopPos)
        { // 画面内に表示されている

          if(setting.onShow && typeOf(setting.onShow) == 'function')
          { // onShowが設定＆関数の場合
            if(!setting.isShow){
              setting.onShow(setting.target);

              //上下どちらから出てきたか
              setting.onShowDirection = (scroll > halfPosition)? 'top' : 'bottom';

            }
          }

          if(setting.onShowDirection == 'bottom'){
            // 要素が下から出てきた場合
            if(targetEventPos[setting.onShowDirection] < scroll && !setting.evented)
            { // イベント発火
              setting.evented = true;
              if(setting.onEvent && typeOf(setting.onEvent) == 'function')
              { // onEventが設定＆関数の場合
                setting.onEvent(setting.target);
              }
            }
          }
          else{
            // 要素が上から出てきた場合
            if(targetEventPos[setting.onShowDirection] > scroll - eventTargetH && !setting.evented)
            { // イベント発火
              setting.evented = true;
              if(setting.onEvent && typeOf(setting.onEvent) == 'function')
              { // onEventが設定＆関数の場合
                setting.onEvent(setting.target);
              }
            }
          }
          setting.isShow = true;
        }
      // }

      if(!(targetShowPos < scroll && scroll < targetHideTopPos))
      { //画面に表示されてない
        if(setting.isShow)
        { // 一度画面に表示された場合

          if(setting.eventOnce)
          { // 一度だけの場合、eventlistner削除
            window.removeEventListener( 'scroll' , _scrollEvent ) ;
            window.removeEventListener( 'resize' , _scrollEvent ) ;
          }

          if(setting.onHide && typeOf(setting.onHide) == 'function')
          { // onHideが設定＆関数の場合
            setting.onHide(setting.target);
          }
          if(!setting.eventOnce)
          { // 一度だけの設定ではない場合
            setting.isShow = false;
            setting.evented = false;
          }
        }
      }
    };
    window.addEventListener( 'scroll' , _scrollEvent ) ;
    window.addEventListener( 'resize' , _scrollEvent ) ;

  };
} )( ) ;
