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

      watch(() => props.startText, newValue => {
        editorData.value = newValue;
      });

      watch(editorData, newValue => {
        emit('update', newValue);
        emit('count', newValue.length);
      });

      const editor = computed(() => {
        if (!cloud.data.value) return null;
        return cloud.data.value.CKEditor.ClassicEditor;
      });

      const config = computed(() => {
        if (!cloud.data.value) return null;

        const { Essentials, Paragraph, Bold, Italic, Strikethrough, AutoLink, Link, WordCount, Underline } =
          cloud.data.value.CKEditor;

        return {
          licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODU3MTUxOTksImp0aSI6IjhjMDBiODA4LTBkYTctNDYwZC04ZmNkLTVmM2FkODVhZGM0NiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkUyUCIsIkUyVyJdLCJ2YyI6IjdiMTNhMThhIn0.FGhvY1tti0n0LJ-u4oG8jXBaEMgbbYxC3-ThxuresQP4GxzGADxB0QS76gt-f33lhE0EtN2tinTezpRt8yy3KQ',
          plugins: [Essentials, Paragraph, Bold, Italic, Strikethrough, AutoLink, Link, WordCount, Underline],
          toolbar: [
            'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'strikethrough', 'link', '|',
          ],
        };
      });

      const onReady = editorInstance => {
        console.log('Editor ready:', editorInstance);

        // --- tg-spoiler ---
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

        // Кнопка Spoiler
        editorInstance.ui.componentFactory.add('spoiler', locale => {
          const button = new ButtonView(locale);
          button.set({ label: 'Скрытый', withText: true, tooltip: true });
          button.on('execute', () => {
            const sel = editorInstance.model.document.selection;
            if (sel.isCollapsed) return;
            editorInstance.model.change(writer => {
              const range = sel.getFirstRange();
              const pos = sel.getFirstPosition();
              const spoilerAncestor = pos.getAncestors().find(a => a.is && a.is('element', 'tg-spoiler'));
              if (spoilerAncestor) writer.unwrap(spoilerAncestor);
              else writer.wrap(range, writer.createElement('tg-spoiler'));
            });
          });
          return button;
        });

        const spoilerButtonView = editorInstance.ui.componentFactory.create('spoiler');
        editorInstance.ui.view.toolbar.items.add(spoilerButtonView);

        // --- Кнопка вставки паттерна {{ full_name }} ---
        editorInstance.ui.componentFactory.add('insertFullName', locale => {
          const button = new ButtonView(locale);
          button.set({ label: 'Имя', withText: true, tooltip: 'Переменная для вставки вашего имени' });
          button.on('execute', () => {
            editorInstance.model.change(writer => {
              const insertPosition = editorInstance.model.document.selection.getFirstPosition();
              writer.insertText('{{ full_name }}', insertPosition);
            });
          });
          return button;
        });

        const insertFullNameButtonView = editorInstance.ui.componentFactory.create('insertFullName');
        editorInstance.ui.view.toolbar.items.add(insertFullNameButtonView);

        // --- Кнопка вставки паттерна {{ full_name }} ---
        editorInstance.ui.componentFactory.add('insertFioName', locale => {
          const button = new ButtonView(locale);
          button.set({ label: 'ФИО', withText: true, tooltip: 'Переменная для вставки вашего ФИО' });
          button.on('execute', () => {
            editorInstance.model.change(writer => {
              const insertPosition = editorInstance.model.document.selection.getFirstPosition();
              writer.insertText('{{ fio }}', insertPosition);
            });
          });
          return button;
        });

        const insertFioButtonView = editorInstance.ui.componentFactory.create('insertFioName');
        editorInstance.ui.view.toolbar.items.add(insertFioButtonView);

        // --- Кнопка вставки паттерна {{ full_name }} ---
        editorInstance.ui.componentFactory.add('insertUserName', locale => {
          const button = new ButtonView(locale);
          button.set({ label: 'Юзернейм', withText: true, tooltip: 'Переменная для вставки вашего ФИО' });
          button.on('execute', () => {
            editorInstance.model.change(writer => {
              const insertPosition = editorInstance.model.document.selection.getFirstPosition();
              writer.insertText('{{ username }}', insertPosition);
            });
          });
          return button;
        });

        const insertUserNameButtonView = editorInstance.ui.componentFactory.create('insertUserName');
        editorInstance.ui.view.toolbar.items.add(insertUserNameButtonView);
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