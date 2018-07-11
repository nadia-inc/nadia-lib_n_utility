nUtility.nScrollEvent.add(document.getElementsByClassName('list_10'),{
  eventOnce: false,
  eventPosition: 0.5,
  onEvent : function(obj){
    console.log('onEvent');
    /**
     * イベントをつけたオブジェクトを使う場合、
     * this or obj.target(functionの引数)に入っている
     */
    var target = obj;
    target.classList.add('active');
    console.log(target);
    console.log(obj,this);
  },
  onShow : function(obj){
    console.log('onShow');
  },
  onHide : function(obj){
    console.log('onHide');
    var target = obj;
    target.classList.remove('active');
  }
});


nUtility.nScrollEvent.add(document.getElementsByClassName('list_common'),{
  eventOnce: false,
  eventPosition: 0.2,
  onEvent : function(obj){
    obj.style.left = '50px';
  },
  onShow : function(obj){
    obj.style.transition = '0.2s';
    obj.style.position = 'relative';
    obj.style.left = '0px';
  },
  onHide : function(obj){
    obj.style.left = '0px';
  }
});

nUtility.nScrollEvent.add($('.testList li'),{
  eventOnce: false,
  eventPosition: 0.7,
  onEvent : function(obj){
    obj.style.backgroundColor = '#d5d5d5';
  },
  onShow : function(obj){
  },
  onHide : function(obj){
    obj.style.backgroundColor = '';
  }
});


console.log(window.nUtility.userAgent)
