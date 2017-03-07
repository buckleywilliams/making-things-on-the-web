var Slideshow = Catbone.Model.extend({
  initialize: function() {
    this.set({ slideCount: 0 });
  },
  advance: function() {
    if (this.get('activeSlide') === this.get('slideCount')) {
      this.showFirstSlide();
    } else {
      this.set({ activeSlide: this.get('activeSlide') + 1 });
    }
  },
  retreat: function() {
    if (this.get('activeSlide') === 1) {
      this.showLastSlide();
    } else {
      this.set({ activeSlide: this.get('activeSlide') - 1 });
    }
  },
  begin: function() {
    this.showFirstSlide();
  },
  showFirstSlide: function() {
    this.showSlide(1);
  },
  showLastSlide: function() {
    this.showSlide(this.get('slideCount'));
  },
  showSlide: function(slideNumber) {
    this.set({ activeSlide: slideNumber });
  },
  registerSlide: function() {
    this.set({ slideCount: this.get('slideCount') + 1 });
  }
});

var Slide = Catbone.View.extend({
  initialize: function() {
    this.model.registerSlide();
    this.listenTo(this.model, 'change', this.render);
    this.setBackground();
    this.render();
  },
  render: function() {
    if (this.model.get('activeSlide') == this.el.getAttribute('id')) {
      this.$el.show();
      window.location.hash = this.el.getAttribute('id');
    } else {
      this.$el.hide();
    }
  },
  setBackground: function() {
    if (this.el.dataset.slideBg) {
      this.$el.css({
        'background-image': 'url(' + this.el.dataset.slideBg + ')',
        'background-size': 'cover',
        'background-position': 'center'
      });
    }
  }
});

var PresenterNotes = Catbone.View.extend({
  initialize: function() {
    var notesWindow = window.open('presenter_notes.html', 'PresenterNotes', "resizable,scrollbars,width=700,height=300");
    this.model.set({ presenterNotes: notesWindow });
  }
});

var SlideshowView = Catbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'processKeydown');
    $(document).bind('keydown', this.processKeydown);
  },
  processKeydown: function(event) {
    if (event.keyCode === 39) {
      this.model.advance();
    } else if (event.keyCode === 37) {
      this.model.retreat();
    }
  }
});

var slideshow = new Slideshow();
var slides = document.querySelectorAll('[data-slide]');
new PresenterNotes({ model: slideshow, slideshow: slideshow });
Array.prototype.forEach.call(slides, function(slide, index) {
  slide.setAttribute('id', index + 1);
  new Slide({ model: slideshow, el: slide });
});
new SlideshowView({ model: slideshow });

slideshow.begin();
