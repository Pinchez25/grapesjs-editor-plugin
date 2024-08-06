import grapesjs from 'grapesjs';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const stopPropagation = e => e.stopPropagation();

export default grapesjs.plugins.add('gjs-plugin-ckeditor5', (editor, opts = {}) => {
  let c = opts;

  let defaults = {
    // CKEditor options
    options: {},

    // On which side of the element to position the toolbar
    // Available options: 'left|center|right'
    position: 'left',
  };

  // Load defaults
  for (let name in defaults) {
    if (!(name in c))
      c[name] = defaults[name];
  }

  editor.setCustomRte({
    enable(el, rte) {
      // If already exists I'll just focus on it
      if (rte && rte.sourceElement) {
        this.focus(el, rte);
        return rte;
      }

      el.contentEditable = true;

      // Hide other toolbars
      let rteToolbar = editor.RichTextEditor.getToolbarEl();
      [].forEach.call(rteToolbar.children, (child) => {
        child.style.display = 'none';
      });

      // Initialize CKEditor 5
      ClassicEditor.create(el, c.options)
        .then(newEditor => {
          rte = newEditor;

          // Implement the `rte.getContent` method
          rte.getContent = () => rte.getData();

          // Make click event propagate
          rte.editing.view.document.on('click', () => {
            el.click();
          });

          // The toolbar is not immediately loaded so will be wrong positioned.
          rte.ui.view.toolbar.element.addEventListener('mousedown', stopPropagation);

          this.focus(el, rte);
        })
        .catch(error => {
          console.error('There was a problem initializing the CKEditor 5 instance.', error);
        });

      return rte;
    },

    disable(el, rte) {
      el.contentEditable = false;
      if (rte) {
        rte.destroy();
        rte = null;
      }
    },

    focus(el, rte) {
      if (rte) {
        rte.editing.view.focus();
      }
    },
  });

  // Update RTE toolbar position
  editor.on('rteToolbarPosUpdate', (pos) => {
    // Update by position
    switch (c.position) {
      case 'center':
        let diff = (pos.elementWidth / 2) - (pos.targetWidth / 2);
        pos.left = pos.elementLeft + diff;
        break;
      case 'right':
        let width = pos.targetWidth;
        pos.left = pos.elementLeft + pos.elementWidth - width;
        break;
    }

    if (pos.top <= pos.canvasTop) {
      pos.top = pos.elementTop + pos.elementHeight;
    }

    if (pos.left < pos.canvasLeft) {
      pos.left = pos.canvasLeft;
    }
  });
});
