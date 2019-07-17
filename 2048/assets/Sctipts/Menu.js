
cc.Class({
    extends: cc.Component,

    properties: {
 
    },

    start () {

    },

    onBtnBack: function(){
      cc.director.loadScene('Index');
    },

    onBtnStartGame3: function(){
      cc.director.loadScene('Game3');
    },

    onBtnStartGame4: function(){
      cc.director.loadScene('Game4');
    },

    onBtnStartGame8: function(){
      cc.director.loadScene('Game8');
    },
});
