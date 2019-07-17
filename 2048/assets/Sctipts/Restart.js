cc.Class({
    extends: cc.Component,

    properties: {

    },


    start () {

    },

    onBtnRestart: function(){
      cc.director.loadScene('Menu');
    }
});
