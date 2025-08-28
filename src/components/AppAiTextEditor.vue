<template>
    <Ckeditor
        v-if="editor"
        v-model="editorData"
        :editor="editor"
        :config="config"
        style="width: 100% !important;"
        ref="ed"
    />
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { Ckeditor, useCKEditorCloud } from '@ckeditor/ckeditor5-vue';
// import Spoiler from '../spoiler/spoiler';

export default {
    name: 'CkEditorComponent',
    components: { Ckeditor },
    props: {
        startText: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            charactersCount: 0
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

        let wordsCount;

        const config = computed(() => {
            if (!cloud.data.value) {
                return null;
            }

            const { Essentials, Paragraph, Bold, Italic, Strikethrough, AutoLink, Link, WordCount } = cloud.data.value.CKEditor;

            return {
                licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODU3MTUxOTksImp0aSI6IjhjMDBiODA4LTBkYTctNDYwZC04ZmNkLTVmM2FkODVhZGM0NiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkUyUCIsIkUyVyJdLCJ2YyI6IjdiMTNhMThhIn0.FGhvY1tti0n0LJ-u4oG8jXBaEMgbbYxC3-ThxuresQP4GxzGADxB0QS76gt-f33lhE0EtN2tinTezpRt8yy3KQ',
                plugins: [Essentials, Paragraph, Bold, Italic, Strikethrough, AutoLink, Link, WordCount],
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
                link: {
                    toolbar: [ 'linkPreview', '|', 'editLink', 'linkProperties', 'unlink' ]
                },
                toolbar: [
                    'undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'link'
                ],
                wordCount: {
                    onUpdate: stats => {
                        // Prints the current content statistics.
                        wordsCount = stats.characters; 
                        console.log( `Characters: ${ stats.characters }\nWords: ${ stats.words }` );
                    }
                }
            };
        });

        onMounted(() => {
            watch(editorData, (newValue) => {
                // Эмитим событие с обновлённым значением
                emit('update', editorData.value);
                emit("count", {
                    text: wordsCount,
                    textWithTags: newValue.length
                });
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

<style>
    .count__words {
        color: red;
        font-size: 20px;
    }
</style>