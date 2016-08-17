(function() {
  
  var slider = function() {};

  slider.params = {
    width: 'auto',
    height: 'auto',
    animateDuration: 400,
    delay: 3000,
    autoStart: true,
    pauseOnHover: true,
    pagiEvent: 'mouseenter'
  }

  slider.prototype.init = function(node, params) {
    var self = this;

    // 合并参数
    this.params = $.extend({}, slider.params, params);

    // 保存对dom的引用
    this.node = node.css('overflow', 'hidden');
    if( this.node.css('position') == 'static' ) {
      this.node.css('position', 'relative');
    }
    this.tabs = node.children().css({
      'position': 'absolute',
      'top': 0
    });
    this.length = this.tabs.length;

    // 为了不影响父元素样式，在父元素和子元素之间加一层div
    this.stage = $('<div class="slider-stage">').append(this.tabs).appendTo(this.node);

    this.width = this.params.width == 'auto' ? this.node.width() : this.params.width;
    this.height = this.params.height == 'auto' ? this.node.height() : this.params.height;

    this.stage.css({
      'position': 'absolute',
      'width'   : this.width,
      'height'  : this.height
    });

    // 子元素初始位置
    for( var i = 0; i < this.length; i++ ) {
      this.tabs.eq(i).css('left', i*this.width);
    }

    // 控制元素
    this.pagi = $('<div class="slider-pagi">')
    for( var i = 0; i < this.length; i++ ) {
      $('<span class="slider-control">').attr('index', i).appendTo(this.pagi);
    }
    this.controls = this.pagi.children();
    this.controls.on(this.params.pagiEvent, function() {
      var i = +$(this).attr('index');
      self.moveTo(i);
    });
    this.controls.eq(0).active();
    this.pagi.appendTo(this.node);

    // 是否自动slider
    this.current = 0;
    if( this.params.autoStart ) {
      this.play();
    }

    // 是否pauseOnHover
    if( this.params.pauseOnHover ) {
      this.node.hover(function() {
        self.stop();
      }, function() {
        self.play();
      });
    }

    return this;
  }

  // 滚动到指定位置
  slider.prototype.moveTo = function(target) {
    if( target < 0 ) target += this.length;
    target %= this.length;
    this.stage.animate({'left': '-' + this.width * target + 'px'}, this.params.animateDuration);
    this.controls.deactive().eq(target).active();
    this.current = target;
  }

  slider.prototype.prev = function() {
    this.moveTo(--this.current);
  }

  slider.prototype.next = function() {
    this.moveTo(++this.current);
  }

  slider.prototype.play = function() {
    var self = this;
    clearInterval(this.interval);
    this.interval = setInterval(function() {
      self.moveTo(++self.current);
    }, this.params.delay);
  }

  slider.prototype.stop = function() {
    clearInterval(this.interval);
  }

  $.fn.slider = function(params) {
    return new slider().init(this, params);
  }

})();