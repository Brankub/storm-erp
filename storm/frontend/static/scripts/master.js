(function() {
  (function($) {
    var csrftoken;
    csrftoken = $('meta[name=csrf-token]').attr('content');
    return $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        console.log('send');
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
          return xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      }
    });
  })(jQuery);

  (function($) {
    return $.fn.tree = function() {
      var tree;
      tree = $(this);
      tree.on('click', '.toggle-children', function(e) {
        e.preventDefault();
        return $(this).closest('.tree-row').toggleClass('collapsed').toggleClass('expanded');
      });
      if (tree.hasClass('tree-sortable')) {
        return tree.nestedSortable({
          handle: '> .element > .handle',
          items: 'li.tree-row',
          toleranceElement: '> .element',
          startCollapsed: true,
          branchClass: 'branch',
          collapsedClass: 'collapsed',
          isTree: true,
          helper: 'clone',
          expandedClass: 'expanded',
          hoveringClass: 'sortable-hover',
          leafClass: 'leaf',
          placeholder: 'sortable-placeholder',
          tolerance: 'pointer',
          opacity: 0.7,
          tabSize: 22,
          start: (function(e, ui) {
            return ui.item.show().addClass('sortable-active');
          }),
          stop: (function(e, ui) {
            ui.item.show().removeClass('sortable-active');
            return ui.item.find('.tree-row').add(ui.item).each(function() {
              var level;
              level = $(this).parents('.tree-row').size();
              return $(this).removeClass(function(el, c) {
                return c.match(/level-\d+/)[0];
              }).addClass("level-" + (level + 1));
            });
          }),
          update: (function(e, ui) {
            var c, p, s, url;
            console.log('sorted');
            c = ui.item.data('id');
            p = ui.item.parent().closest('.tree-row').data('id');
            s = ui.item.prev('.tree-row').data('id');
            console.log(c, p, s);
            url = ui.item.closest('.tree').data('sorting-endpoint');
            return $.ajax({
              url: url,
              type: 'post',
              data: {
                instance: c,
                parent: p,
                previous_sibling: s
              },
              success: function(data) {
                var el, label;
                label = $('> .element > .tree-row-label > div', ui.item);
                el = label.find('.status');
                if (el.size()) {
                  el.finish();
                }
                el = $('<span class="status">Successfully moved</span>');
                label.append(el);
                return el.fadeOut({
                  duration: 3000,
                  complete: function() {
                    return el.remove();
                  }
                });
              }
            });
          })
        });
      }
    };
  })(jQuery);

  (function($) {
    return $(function() {
      return $('ol.tree').tree();
    });
  })(jQuery);

}).call(this);
