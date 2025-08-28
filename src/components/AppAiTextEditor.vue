<template>
  <Ckeditor
    v-if="editor"
    v-model="editorData"
    :editor="editor"
    :config="config"
    style="width: 100% !important;"
    ref="ed"
    @ready="onReady"
  />
</template>

<script>
import { ref, computed, watch } from 'vue';
import { Ckeditor, useCKEditorCloud } from '@ckeditor/ckeditor5-vue';

export default {
  name: 'CkEditorComponent',
  components: { Ckeditor },
  props: {
    startText: { type: String, default: '' }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const cloud = useCKEditorCloud({
      version: '46.0.0',
      premium: true
    });

    const editorData = ref(props.startText);

    // Следим за пропсом и обновляем editorData
    watch(() => props.startText, newValue => {
      editorData.value = newValue;
    });

    // Эмитим изменения текста в родительский компонент
    watch(editorData, newValue => {
      emit('update', newValue);
    });

    const editor = computed(() => {
      if (!cloud.data.value) return null;
      return cloud.data.value.CKEditor.ClassicEditor;
    });

    const config = computed(() => {
      if (!cloud.data.value) return null;

      const { Essentials, Paragraph, Bold, Italic, Strikethrough, AutoLink, Link, WordCount } =
        cloud.data.value.CKEditor;

      return {
        licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODU3MTUxOTksImp0aSI6IjhjMDBiODA4LTBkYTctNDYwZC04ZmNkLTVmM2FkODVhZGM0NiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkUyUCIsIkUyVyJdLCJ2YyI6IjdiMTNhMThhIn0.FGhvY1tti0n0LJ-u4oG8jXBaEMgbbYxC3-ThxuresQP4GxzGADxB0QS76gt-f33lhE0EtN2tinTezpRt8yy3KQ',
        plugins: [Essentials, Paragraph, Bold, Italic, Strikethrough, AutoLink, Link, WordCount],
        toolbar: [
          'undo', 'redo', '|',
          'bold', 'italic', 'underline', 'strikethrough', 'link'
        ],
        wordCount: {
          onUpdate: stats => {
            console.log(`Characters: ${stats.characters} Words: ${stats.words}`);
          }
        }
      };
    });

    const onReady = editorInstance => {
      console.log('Editor ready:', editorInstance);

      editorInstance.model.schema.register('tg-spoiler', {
        isInline: true,
        allowWhere: '$text',
        allowContentOf: '$text'
      });

      editorInstance.conversion.elementToElement({
        model: 'tg-spoiler',
        view: 'tg-spoiler'
      });

      const ButtonView = editorInstance.ui.componentFactory.create('bold').constructor;
      editorInstance.ui.componentFactory.add('spoiler', locale => {
        const button = new ButtonView(locale);
        button.set({
          label: 'Spoiler',
          withText: true,
          tooltip: true
        });

        button.on('execute', () => {
          const sel = editorInstance.model.document.selection;
          if (sel.isCollapsed) return;

          editorInstance.model.change(writer => {
            const range = sel.getFirstRange();
            const pos = sel.getFirstPosition();

            const spoilerAncestor = pos.getAncestors().find(a => a.is && a.is('element', 'tg-spoiler'));

            if (spoilerAncestor) {
              writer.unwrap(spoilerAncestor);
            } else {
              writer.wrap(range, writer.createElement('tg-spoiler'));
            }
          });
        });

        return button;
      });

      const toolbarView = editorInstance.ui.view.toolbar;
      const spoilerButtonView = editorInstance.ui.componentFactory.create('spoiler');
      toolbarView.items.add(spoilerButtonView);
    };

    return { editorData, editor, config, onReady };
  }
};
</script>

<style>
.tg-spoiler {
  background-color: #f0f0f0;
  border: 1px dashed #999;
  padding: 0 2px;
}
</style>