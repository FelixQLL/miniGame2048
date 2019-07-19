const ROWS = 3;//行
const COLS = 3;//列
const NUMBERS = [2,4];//随机生成块的数组
const MIN_LENGTH = 50;//拖动最小长度
const MOVE_DURATION = 0.1;//移动的时长，间隔0.5s

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        score: 0,
        blockPrefab: cc.Prefab,
        containerPrefab: cc.Prefab,
        gap: 20,
        paddingGap: 19,
        bg: cc.Node,
        hitAudio:{
          default:null,
          type: cc.AudioClip
        },
        failedAudio:{
          default:null,
          type: cc.AudioClip
        },
        succeededAudio:{
          default:null,
          type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.drawBgBlocks();
        this.init();
        this.addEventHandler();
    },

    /**
     * 跳转到菜单场景：Menu Scene
     */
    onBtnBack: function(){
      cc.director.loadScene('Menu');
    },


    drawBgBlocks: function(){

      //绘制Container容器
        this.containerSize = cc.winSize.width - this.paddingGap * 2;
        let cx = this.paddingGap + this.containerSize / 2;
        let cy = this.paddingGap * 5 ;
        let container = cc.instantiate(this.containerPrefab);
        container.width = this.containerSize;
        container.height = this.containerSize;
        this.bg.addChild(container);
        container.setPosition(cc.v2(cx,cy));
      //绘制Container结束

      //绘制 3*3 Block块
      this.blockSize = (container.width - this.gap * (ROWS + 1)) / ROWS;
      let x = this.paddingGap + this.gap + this.blockSize / 2;
      let y = this.gap + this.blockSize;
      this.positions = [];
      for(let i = 0; i < ROWS; ++i)
      {
        this.positions.push([0,0,0]);
        for(let j = 0; j < COLS; ++j)
        {
          let block = cc.instantiate(this.blockPrefab); 
          block.width = this.blockSize;
          block.height = this.blockSize;
          this.bg.addChild(block);
          block.setPosition(cc.v2(x,y));
          this.positions[i][j] = cc.v2(x,y); 
          x += this.gap + this.blockSize;
          block.getComponent('Block').setNumber(0);
        }
        y += this.gap + this.blockSize;
        x = this.paddingGap + this.gap + this.blockSize / 2;
      }
    
    },

    /**
     * 初始化块和数字，并随机添加三个块
     */
    init(){
        this.updateScore(0);

        if(this.blocks){
          for(let i = 0; i < this.blocks.length; ++i){
              for(let j = 0; j < this.blocks[i].length; ++j)
              {
                  if(this.blocks[i][j] != null){
                    this.blocks[i][j].destroy();
                  }
                   
              }
            }
        }

        this.data = [];
        this.blocks = [];
        for(let i = 0; i < ROWS; ++i){
          this.blocks.push([null,null,null]);
          this.data.push([0,0,0]);
        }
        
        this.addBlock();
        this.addBlock();
        this.addBlock();
    },

    /**
     * 更新分数
     * @param {*} number 
     */
    updateScore(number){
      this.score = number;
      this.scoreLabel.string = 'Score:' + number;
    },

    /** 
    * 找出空闲块
    *@return 空闲块的位置表示
    */
   getEmptyLocations(){
    let locations = [];
    for(let i = 0; i < this.blocks.length; ++i){
      for(let j = 0; j < this.blocks[i].length; ++j){
          if(this.blocks[i][j] == null){
              locations.push({x: i, y: j});
          }
      }
    }

    return locations;
},

/**
 * 随机添加带数字的块
 */
addBlock(){
    let locations = this.getEmptyLocations();
    if(locations.length == 0) 
          return false;
    let location = locations[Math.floor(Math.random()  * locations.length)];
    let x = location.x;
    let y = location.y; 
    let position = this.positions[x][y];

    let block = cc.instantiate(this.blockPrefab); 
    block.width = this.blockSize;
    block.height = this.blockSize;
    this.bg.addChild(block);
    block.setPosition(position);

    let number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    block.getComponent('Block').setNumber(number);

    this.blocks[x][y] = block;
    this.data[x][y] = number;
    return true;
},

/**
 * 添加Touch监听事件
 */
addEventHandler(){
      this.bg.on('touchstart',(event)=>{
          this.startPoint = event.getLocation();
      });

      this.bg.on('touchend',(event)=>{
        this.touchEnd(event);
    });

     this.bg.on('touchcancel',(event)=>{
      this.touchEnd(event);
  });
},

touchEnd(event){
  this.endPoint = event.getLocation();
  let vec = this.endPoint.sub(this.startPoint);
    if(vec.mag() > MIN_LENGTH){
      if(Math.abs(vec.x) > Math.abs(vec.y)){
        //水平方向
        if(vec.x > 0){
          this.moveRight();
        }
        else{
          this.moveLeft();
        }
      }
      else{
        //竖直方向
        if(vec.y > 0){
          this.moveUp();
        }
        else{
          this.moveDown();
        }
      }
    }
},

//检查是否游戏结束，即没有可移动的格子
checkFail(){
    for(let i = 0; i < ROWS; ++i){
      for(let j = 0; j < ROWS; ++j){
          let n = this.data[i][j];
          if(n == 0)
            return false;
          if(j > 0 && this.data[i][j-1] == n)
            return false;
          if(j < ROWS-1 && this.data[i][j+1] == n)
            return false;
          if(i > 0 && this.data[i-1][j] == n)
            return false;
          if(i > ROWS-1 && this.data[i+1][j] == n)
            return false;
      }
    }
    return true;
},

//判断是否成功凑出2048
checkScceeded(){
  for(let i = 0; i < ROWS; ++i){
    for(let j = 0; j < ROWS; ++j){
      if(this.data[i][j] == 2048)
        return true;
    }
  }
  return false;
},

//游戏结束跳转gameOver界面
gameOver(){
  cc.director.loadScene('gameOver');
  cc.audioEngine.playEffect(this.failedAudio,false);
  cc.audioEngine.setEffectsVolume(0.5);
},

succeeded(){
  cc.director.loadScene('Succeeded');
  cc.audioEngine.playEffect(this.succeededAudio,false);
  cc.audioEngine.setEffectsVolume(0.5);
},

//移动格子之后，更新分数，并添加新的随机块。如果游戏结束，则执行gameOver函数
afterMove(hasMoved){
  if(hasMoved){
    this.addBlock();
  }
  if(this.checkFail()){
    this.gameOver();
  }
  if(this.checkScceeded()){
    this.succeeded();
  }
},

/**
 * 移动格子
 * @param {cc.Node} block 
 * @param {cc.v2} position 
 * @param {func} callback 
 */
doMove(block,position,callback){
     let action = cc.moveTo(MOVE_DURATION, position);
     let finish = cc.callFunc(()=>{
          callback && callback();
     });
     block.runAction(cc.sequence(action, finish));
},

//向左滑动
moveLeft(){
  let hasMoved = false;

  let move = (x, y, callback) => {
    if(y == 0 || this.data[x][y] == 0){
      //结束移动
      callback && callback();
      return;
    } else if(this.data[x][y-1] == 0){
      //移动
      let block = this.blocks[x][y];
      let position = this.positions[x][y-1];
      this.blocks[x][y-1] = block;
      this.data[x][y-1] = this.data[x][y];
      this.data[x][y] = 0;
      this.blocks[x][y] = null;
      this.doMove(block, position, () => {
          move(x, y-1, callback);
      });

      hasMoved = true;
    } else if(this.data[x][y-1] == this.data[x][y]){
      //合并
      this.updateScore(this.score + this.data[x][y]);//更新得分
      let block = this.blocks[x][y];
      let position = this.positions[x][y-1];
      this.data[x][y-1] *= 2;
      this.data[x][y] = 0;
      this.blocks[x][y] = null;
      this.blocks[x][y-1].getComponent('Block').setNumber(this.data[x][y-1]);
      this.doMove(block, position, () => {
          block.destroy();
          callback && callback();
      });
      cc.audioEngine.playEffect(this.hitAudio,false);
      cc.audioEngine.setEffectsVolume(0.1);
      hasMoved = true;
    } else{
      //结束移动
      callback && callback();
      return;
    }
  };

  let toMove = [];
  for(let i = 0; i < ROWS; ++i){
    for(let j = 0; j < ROWS; ++j){
        if(this.data[i][j] != 0){
            toMove.push({x: i, y: j});
        }
    }
  }

  let counter = 0;
  for(let i = 0; i < toMove.length; ++i){
      move(toMove[i].x, toMove[i].y, () => {
        counter++;
        if(counter == toMove.length){
            this.afterMove(hasMoved);
        }
      });
  }
},

//向右滑动
moveRight(){
  let hasMoved = false;

  let move = (x, y, callback) => {
    if(y == ROWS-1 || this.data[x][y] == 0){
      //结束移动
      callback && callback();
      return;
    } else if(this.data[x][y+1] == 0){
      //移动
      let block = this.blocks[x][y];
      let position = this.positions[x][y+1];
      this.blocks[x][y+1] = block;
      this.data[x][y+1] = this.data[x][y];
      this.data[x][y] = 0;
      this.blocks[x][y] = null;
      this.doMove(block, position, () => {
          move(x, y+1, callback);
      });

      hasMoved = true;
    } else if(this.data[x][y+1] == this.data[x][y]){
      //合并
      this.updateScore(this.score + this.data[x][y]);//更新得分
      let block = this.blocks[x][y];
      let position = this.positions[x][y+1];
      this.data[x][y+1] *= 2;
      this.data[x][y] = 0;
      this.blocks[x][y] = null;
      this.blocks[x][y+1].getComponent('Block').setNumber(this.data[x][y+1]);
      this.doMove(block, position, () => {
          block.destroy();
          callback && callback();
      });
      cc.audioEngine.playEffect(this.hitAudio,false);
      cc.audioEngine.setEffectsVolume(0.1);
      hasMoved = true;
    } else{
      //结束移动
      callback && callback();
      return;
    }
  };

  let toMove = [];
  for(let i = 0; i < ROWS; ++i){
    for(let j = ROWS-1; j >= 0; --j){
        if(this.data[i][j] != 0){
            toMove.push({x: i, y: j});
        }
    }
  }

  let counter = 0;
  for(let i = 0; i < toMove.length; ++i){
      move(toMove[i].x, toMove[i].y, () => {
        counter++;
        if(counter == toMove.length){
            this.afterMove(hasMoved);
        }
      });
  }
},

//向上滑动
moveUp(){
  let hasMoved = false;

  let move = (x, y, callback) => {
    if(x == ROWS-1 || this.data[x][y] == 0){
      //结束移动
      callback && callback();
      return;
    } else if(this.data[x+1][y] == 0){
      //移动
      let block = this.blocks[x][y];
      let position = this.positions[x+1][y];
      this.blocks[x+1][y] = block;
      this.data[x+1][y] = this.data[x][y];
      this.data[x][y] = 0;
      this.blocks[x][y] = null;
      this.doMove(block, position, () => {
          move(x+1, y, callback);
      });

      hasMoved = true;
    } else if(this.data[x+1][y] == this.data[x][y]){
      //合并
      this.updateScore(this.score + this.data[x][y]);//更新得分
      let block = this.blocks[x][y];
      let position = this.positions[x+1][y];
      this.data[x+1][y] *= 2;
      this.data[x][y] = 0;
      this.blocks[x][y] = null;
      this.blocks[x+1][y].getComponent('Block').setNumber(this.data[x+1][y]);
      this.doMove(block, position, () => {
          block.destroy();
          callback && callback();
      });
      cc.audioEngine.playEffect(this.hitAudio,false);
      cc.audioEngine.setEffectsVolume(0.1);
      hasMoved = true;
    } else{
      //结束移动
      callback && callback();
      return;
    }
  };

  let toMove = [];
  for(let i = ROWS-1; i >= 0; --i){
    for(let j = 0; j < ROWS; ++j){
        if(this.data[i][j] != 0){
            toMove.push({x: i, y: j});
        }
    }
  }

  let counter = 0;
  for(let i = 0; i < toMove.length; ++i){
      move(toMove[i].x, toMove[i].y, () => {
        counter++;
        if(counter == toMove.length){
            this.afterMove(hasMoved);
        }
      });
  }
},

//向下滑动
moveDown(){
  let hasMoved = false;

  let move = (x, y, callback) => {
    if(x == 0 || this.data[x][y] == 0){
      //结束移动
      callback && callback();
      return;
    } else if(this.data[x-1][y] == 0){
      //移动
      let block = this.blocks[x][y];
      let position = this.positions[x-1][y];
      this.blocks[x-1][y] = block;
      this.data[x-1][y] = this.data[x][y];
      this.data[x][y] = 0;
      this.blocks[x][y] = null;
      this.doMove(block, position, () => {
          move(x-1, y, callback);
      });

      hasMoved = true;
    } else if(this.data[x-1][y] == this.data[x][y]){
      //合并
      this.updateScore(this.score + this.data[x][y]);//更新得分
      let block = this.blocks[x][y];
      let position = this.positions[x-1][y];
      this.data[x-1][y] *= 2;
      this.data[x][y] = 0;
      this.blocks[x][y] = null;
      this.blocks[x-1][y].getComponent('Block').setNumber(this.data[x-1][y]);
      this.doMove(block, position, () => {
          block.destroy();
          callback && callback();
      });
      cc.audioEngine.playEffect(this.hitAudio,false);
      cc.audioEngine.setEffectsVolume(0.1);
      hasMoved = true;
    } else{
      //结束移动
      callback && callback();
      return;
    }
  };

  let toMove = [];
  for(let i = 0; i < ROWS; ++i){
    for(let j = 0; j < ROWS; ++j){
        if(this.data[i][j] != 0){
            toMove.push({x: i, y: j});
        }
    }
  }

  let counter = 0;
  for(let i = 0; i < toMove.length; ++i){
      move(toMove[i].x, toMove[i].y, () => {
        counter++;
        if(counter == toMove.length){
            this.afterMove(hasMoved);
        }
      });
  }
},

});
