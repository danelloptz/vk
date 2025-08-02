<template>
    <ckeditor
        v-if="editor"
        v-model="data"
        :editor="editor"
        :config="config"
    />
</template>

<script setup>
import { ref, computed } from 'vue';
import { Ckeditor, useCKEditorCloud } from '@ckeditor/ckeditor5-vue';

const cloud = useCKEditorCloud( {
    version: '46.0.0',
    premium: true
} );

const data = ref( '<p>Hello world!</p>' );

const editor = computed( () => {
    if ( !cloud.data.value ) {
        return null;
    }

    return cloud.data.value.CKEditor.ClassicEditor;
} );

const config = computed( () => {
        if ( !cloud.data.value ) {
        return null;
    }

    const { Essentials, Paragraph, Bold, Italic, Strikethrough, Subscript, Superscript, Underline, Font, Alignment, List, Table, TableToolbar } = cloud.data.value.CKEditor;

    return {
        licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTUzODg3OTksImp0aSI6ImNlNDdlMzZlLWMzMDQtNGJjOC04NjZlLTU4YzQ2ZDljYzJhOSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjMyZmM2YWQ1In0.0LwIRS0rsa--6yw5HCRtTk7ec-64WNmiQ9Gj7akDrKuFh4iycWaBEjOJeajZNdttt7F5YWK_1zzV09Na4ZxAaQ',
        plugins: [ Essentials, Paragraph, Bold, Italic, Strikethrough, Subscript, Superscript, Underline, Font, Alignment, List, Table, TableToolbar ],
        fontFamily: {
            options: [
                'default',
				'Ubuntu, Arial, sans-serif',
				'Ubuntu Mono, Courier New, Courier, monospace'
            ]
        },
        table: {
			contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
		},
        toolbar: [ 'undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', 'alignment', 'bulletedList', 'numberedList', 'insertTable',  ]
    };
} );
</script>
