var PresenterNote = Catbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },
  render: function() {
    if (this.model.get('activeSlide') == this.el.getAttribute('id')) {
      this.$el.show();
    } else {
      this.$el.hide();
    }
  }
});

var notes = document.querySelectorAll('[data-note]');
var slideshow = window.opener.slideshow;

Array.prototype.forEach.call(notes, function(note, index) {
  note.setAttribute('id', index + 1);
  new PresenterNote({ model: slideshow, el: note });
});

