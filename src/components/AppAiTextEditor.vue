<template>
    <Ckeditor
        v-if="editor"
        v-model="editorData"
        :editor="editor"
        :config="config"
    />
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { Ckeditor, useCKEditorCloud } from '@ckeditor/ckeditor5-vue';

export default {
    name: 'CkEditorComponent',
    components: { Ckeditor },
    props: {
        startText: {
            type: String,
            default: ''
        }
    },
    emits: ['update'],
    setup(props, { emit }) {
        const cloud = useCKEditorCloud({
            version: '46.0.0',
            premium: true
        });

        const editorData = ref(props.startText);

        // Наблюдаем за изменением пропса и обновляем данные редактора
        watch(() => props.startText, (newValue) => {
            editorData.value = newValue;
        });

        const editor = computed(() => {
            if (!cloud.data.value) {
                return null;
            }

            return cloud.data.value.CKEditor.ClassicEditor;
        });

        const config = computed(() => {
            if (!cloud.data.value) {
                return null;
            }

            const { Essentials, Paragraph, Bold, Italic, Strikethrough, Subscript, Superscript, Underline, Font, Alignment, List, Table, TableToolbar } = cloud.data.value.CKEditor;

            return {
                licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODU3MTUxOTksImp0aSI6IjhjMDBiODA4LTBkYTctNDYwZC04ZmNkLTVmM2FkODVhZGM0NiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkUyUCIsIkUyVyJdLCJ2YyI6IjdiMTNhMThhIn0.FGhvY1tti0n0LJ-u4oG8jXBaEMgbbYxC3-ThxuresQP4GxzGADxB0QS76gt-f33lhE0EtN2tinTezpRt8yy3KQ',
                plugins: [Essentials, Paragraph, Bold, Italic, Strikethrough, Subscript, Superscript, Underline, Font, Alignment, List, Table, TableToolbar],
                fontFamily: {
                    options: [
                        'default',
                        'Ubuntu, Arial, sans-serif',
                        'Ubuntu Mono, Courier New, Courier, monospace'
                    ]
                },
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                },
                toolbar: [
                    'undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript',
                    'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', 'alignment', 'bulletedList',
                    'numberedList', 'insertTable'
                ]
            };
        });

        // Наблюдаем за изменениями в редакторе и эмитим событие
        onMounted(() => {
            watch(editorData, (newValue) => {
                emit('update', newValue);
            });
        });

        return {
            editorData,
            editor,
            config
        };
    }
};
</script>