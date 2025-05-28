<template>
    <div class="wrapper">
        <div class="editor">
            <img src="@/assets/images/close.png" class="close" @click="close">
            <h1>Редактор</h1>
            <div class="header">
                <div class="header_tools">
                    <img src="@/assets/images/hand.png">
                    <img src="@/assets/images/crop.png" @click="changeCrop">
                    <img src="@/assets/images/return_back.png">
                    <img src="@/assets/images/return_towards.png">
                    <img src="@/assets/images/delete_ai.png">
                </div>
                <AppBadButton :text="text1" class="save" @click="save"/>
                <AppGoodButton :text="text2" class="download" @click="downloadImage"/>
            </div>
        <!-- Контейнер для vue-advanced-cropper -->
        <div v-if="imageSrc" class="cropper-container" ref="container">
            <div
                v-for="block in textBlocks"
                :key="block.id"
                class="text-block"
                :style="{
                top: `${block.top}px`,
                left: `${block.left}px`,
                fontSize: `${block.fontSize}px`,
                color: block.color,
                fontWeight: block.fontWeight,
                fontStyle: block.fontStyle,
                fontFamily: block.fontFamily,
                textAlign: block.textAlign, // Выравнивание текста
                cursor: 'move',
                zIndex: block.id === selectedBlockId ? 950 : 900,
                border: block.id === selectedBlockId ? '2px solid blue' : 'none',
                }"
                @mousedown="selectBlock(block.id, $event)"
                @click="enableEditing(block.id)"
            >
                <!-- Редактируемый текст -->
                <div
                :contenteditable="block.id === editingBlockId"
                @blur="disableEditing(block.id)"
                :style="{
                    whiteSpace: 'pre-wrap', // Сохраняем переносы строк
                    wordWrap: 'break-word', // Переносим длинные слова
                }"
                >
                {{ block.text }}
                </div>
            </div>
            <div
                v-for="image in images"
                :key="image.id"
                class="overlay-image"
                :style="{
                top: `${image.top}px`,
                left: `${image.left}px`,
                width: `${image.width}px`,
                height: `${image.height}px`,
                zIndex: image.id === selectedImageId ? 10 : 1,
                border: image.id === selectedImageId ? '2px solid blue' : 'none',
                }"
                @mousedown="selectImage(image.id, $event)"
            >
                <div
                v-for="handle in rectangleHandles"
                :key="handle.position"
                :class="['handle', handle.position]"
                @mousedown="startResizeImage($event, handle.position, image.id)"
                ></div>
                <img
                :src="image.src"
                :style="{
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                }"
                />
            </div>
            <div
                v-for="rectangle in rectangles"
                :key="rectangle.id"
                class="rectangle"
                :style="{
                top: `${rectangle.top}px`,
                left: `${rectangle.left}px`,
                width: `${rectangle.width}px`,
                height: `${rectangle.height}px`,
                backgroundColor: rectangle.color,
                opacity: rectangle.opacity,
                zIndex: rectangle.id === selectedRectangleId ? 850 : 800,
                border: rectangle.id === selectedRectangleId ? '2px solid blue' : 'none',
                }"
                @mousedown="selectRectangle(rectangle.id, $event)"
            >
            <!-- eslint-disable vue/no-use-v-if-with-v-for  -->
                <div
                v-if="rectangle.id === selectedRectangleId"
                v-for="handle in rectangleHandles"
                :key="handle.position"
                :class="['handle', handle.position]"
                @mousedown="startResizeRectangle($event, handle.position, rectangle.id)"
                ></div>
            </div>
            <div :style="{backgroundImage: 'url(' + imageSrc + ')'}" class="image-background"></div>
            <cropper
                ref="cropper"
                :src="currentImage"
                :resize-image="{
                    wheel: false
                }"
                :stencil-props="{
                    handlers: isCroped ? 
                    {
                        eastNorth: true,
                        north: false,
                        westNorth: true,
                        west: false,
                        westSouth: true,
                        south: false,
                        eastSouth: true,
                        east: false,
                    } : {},
                }"
                background-class="cropper-background"
                @change="onCropChange"
                :style="{
                maxWidth: '80vw',
                maxHeight: '100vh',
                background: 'none'
                }"
                :default-size="defaultSize"
            />
        </div>
        <div class="crop_msg" v-if="isCroped">
            <span>Обрезать?</span>
            <AppGoodButton :text="text7" @click="resize" class="crop" /> 
        </div>
        <div class="tools">
            <div class="layers">
                <h2>Слои:</h2>
                <div class="line"></div>
                <div v-for="block in textBlocks" :key="block.id" class="layer-item">
                    <span>{{ block.text || 'Без имени' }}</span>
                    <img class="delete_lay" src="@/assets/images/close.png" @click="deleteBlock(block.id)">
                </div>
                <div v-for="(rectangle, index) in rectangles" :key="rectangle.id" class="layer-item">
                    <span>Прямоугольник {{ index + 1 }}</span>
                    <img class="delete_lay" src="@/assets/images/close.png" @click="deleteRectangle(rectangle.id)">
                </div>
                <div v-for="(image, index) in images" :key="image.id" class="layer-item">
                    <img :src="image.src" class="preview" />
                    <span>Изображение {{ index + 1 }}</span>
                    <img class="delete_lay" src="@/assets/images/close.png" @click="deleteImage(image.id)">
                </div>
                <AppGoodButton @click="addTextBlock" :text="text4" />
                <AppGoodButton @click="addRectangle" :text="text5" />
                <AppGoodButton @click="addImage" :text="text6" />

            </div>
            <div class="text_tools">
                <div class="text_tools_row">
                    <div class="color_rectangle">
                        <input type="color" class="color_rect" v-model="selectedRectangle.color" />
                        <h2>Цвет</h2>
                    </div>
                    <div class="vertical_line"></div>
                    <div class="text_text" @click="changeTextStyle('normal')">
                        <span>T</span>
                        <h2>Text</h2>
                    </div>
                    <div class="text_text" @click="changeTextStyle('bold')">
                        <span class="bold">B</span>
                        <h2>Bold</h2>
                    </div>
                    <div class="text_text">
                        <span class="italic" @click="changeTextStyle('italic')">I</span>
                        <h2>Italic</h2>
                    </div>
                    <div class="vertical_line"></div>
                    <div class="color_text">
                        <div 
                            class="color_circle" 
                            @click="openColorPicker" 
                            :style="{ backgroundColor: selectedBlock.color }"
                        ></div>
                        <input 
                            type="color" 
                            style="visibility: hidden; height: 0px;" 
                            ref="colorInput" 
                            v-model="selectedBlock.color" 
                        />
                        <h2>Цвет</h2>
                    </div>
                </div>
                <div class="text_tools_row">
                    <div class="rect_opacity">
                        <div
                            class="rect_op"
                            :style="{
                                backgroundColor: `rgba(${hexToRgb(selectedRectangle.color).r}, ${hexToRgb(selectedRectangle.color).g}, ${hexToRgb(selectedRectangle.color).b}, ${selectedRectangle.opacity})`
                            }"
                        ></div>
                        <h3>Заливка: </h3>
                        <input type="range" v-model="selectedRectangle.opacity" min="0" max="1" step="0.01" />
                    </div>
                    <div class="text_align">
                        <div class="text_align_item" @click="changeTextAling('left')">
                            <div class="text_align_left">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <h2>Left</h2>
                        </div>
                        <div class="text_align_item" @click="changeTextAling('center')">
                            <div class="text_align_center">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <h2>Center</h2>
                        </div>
                        <div class="text_align_item" @click="changeTextAling('right')">
                            <div class="text_align_right">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <h2>Right</h2>
                        </div>
                    </div>
                </div>
                <AppGoodButton :text="text3" class="upload_logo" @click="addImage" />
                <div class="text_tools_row">
                    <h2>Размер текста: </h2>
                    <input type="range" v-model.number="selectedBlock.fontSize" min="5" max="256" step="1" />
                    <input class="font_size" type="number" v-model="selectedBlock.fontSize" min="5" max="256" :key="selectedBlock.fontSize" />
                </div>
                <div class="text_tools_row">
                    <h2>Шрифт: </h2>
                    <select class="font_dropdown" v-model="selectedBlock.fontFamily">
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Verdana">Verdana</option>
                    </select>
                </div>
            </div>
            
        </div>
        </div>
    </div>
</template>

<script>
    import { Cropper } from 'vue-advanced-cropper';
    import 'vue-advanced-cropper/dist/style.css';
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppBadButton from "@/components/AppBadButton.vue";

    export default {
        components: { AppGoodButton, AppBadButton, Cropper },
        props: {
            imageSrc: String,
        },
        watch: {
            imageSrc(val) {
                console.log(val)
            }
        },
        data() {
            return {
                text1: "СОХРАНИТЬ",
                text2: "СКАЧАТЬ",
                text3: "ЗАГРУЗИТЬ ЛОГО",
                text4: "ДОБАВИТЬ ТЕКСТ",
                text5: "ДОБАВИТЬ ПРЯМОУГОЛЬНИК",
                text6: "ДОБАВИТЬ ИЗОБРАЖЕНИЕ",
                text7: "ДА",
                croppedImage: null, // Обрезанное изображение
                currentImage: null,
                fileExtension: '', // Расширение загруженного файла
                textBlocks: [], // Массив текстовых блоков
                selectedBlockId: null, // ID выбранного текстового блока
                isDraggingText: false, // Флаг для перетаскивания текста
                dragStartX: 0, // Начальная позиция мыши по X
                dragStartY: 0, // Начальная позиция мыши по Y
                cords: null,
                imageWidth: 0,
                imageHeight: 0,
                shiftX: 0,
                shiftY: 0,
                startSizeW: 0,
                startSizeH: 0,
                rectangles: [], // Массив прямоугольников
                selectedRectangle: {
                    color: '#000000',
                    opacity: 1,
                    width: 100,
                    height: 50,
                },
                selectedRectangleId: null, // ID выбранного прямоугольника
                rectangleHandles: [
                    { position: 'top-left' },
                    { position: 'top-right' },
                    { position: 'bottom-left' },
                    { position: 'bottom-right' },
                ],
                editingBlockId: null,
                images: [], // Массив добавленных изображений
                selectedImageId: null, // ID выбранного изображения
                isShiftPressed: false,
                textColor: "#000000",
                isCroped: false,
            }
        },
        mounted() {
            document.addEventListener('keydown', this.handleKeyDown);
            document.addEventListener('keyup', this.handleKeyUp);
        },
        computed: {
            selectedBlock() {
                let block = this.textBlocks.find((block) => block.id === this.selectedBlockId);
                if (block) console.log(block.top, block.fontSize);
                return block || {
                    id: Date.now(),
                    text: 'Новый текст',
                    top: 200,
                    left: 400,
                    fontSize: 20,
                    color: "#000000",
                    fontWeight: 'normal', // По умолчанию обычный текст
                    fontStyle: 'normal',  // По умолчанию без курсива
                    fontFamily: 'Arial',  // По умолчанию Arial
                    width: 200,           // Ширина текстового блока
                    textAlign: 'left',
                };
            },
        },
        async created() {
            this.currentImage = this.imageSrc;
            setTimeout(() => {
                this.getShift();
                const widthImagePage = document.querySelector('.vue-preview__wrapper').offsetWidth; 
                const heightImagePage = document.querySelector('.vue-preview__wrapper').offsetHeight;
                const background = document.querySelector('.vue-advanced-cropper__foreground');
                const background2 = document.querySelector('.vue-advanced-cropper__background');
                background.style.background = 'none';
                background2.style.background = 'none';
                this.startSizeW = widthImagePage;
                this.startSizeH = heightImagePage;
            }, 300);
        },
        methods: {
            close() {
                this.$emit('update:visibility1', false);
            },
            save() {
                this.crop();
                if (!this.croppedImage) return;

                this.$emit('update:save', this.croppedImage);
                setTimeout(() => this.close(), 300);
            },
            changeCrop() {
                this.isCroped = !this.isCroped;
            },
            hexToRgb(hex) {
                // Удаляем символ #, если он есть
                hex = hex.replace(/^#/, '');
                // Разбиваем шестнадцатеричное значение на компоненты RGB
                const bigint = parseInt(hex, 16);
                const r = (bigint >> 16) & 255;
                const g = (bigint >> 8) & 255;
                const b = bigint & 255;
                return { r, g, b };
            },
            changeTextAling(align) {
                this.selectedBlock.textAlign = align;
            },
            changeTextStyle(style) {
                switch (style) {
                    case 'normal':
                        this.selectedBlock.fontWeight = style;
                        break;
                    case 'bold':
                        this.selectedBlock.fontWeight = this.selectedBlock.fontWeight == 'bold' ? 'normal' : style;
                        break;
                    case 'italic':
                        this.selectedBlock.fontStyle = this.selectedBlock.fontStyle == 'italic' ? 'normal' : style;
                        break;
                }
            },
            openColorPicker() {
                // Имитация клика по скрытому input[type="color"]
                this.$refs.colorInput.click();
            },
            handleKeyDown(event) {
            if (event.key === 'Shift') {
                this.isShiftPressed = true;
            }
            },
            handleKeyUp(event) {
            if (event.key === 'Shift') {
                this.isShiftPressed = false;
            }
            },
            selectImage(id, event) {
            if (!this.isResizingImage) {
                this.selectedImageId = id;
                this.startDragImage(event, id);
            }
            },
            startDragImage(event, id) {
            const image = this.images.find((img) => img.id === id);
            if (!image) return;
            this.isDraggingImage = true;
            this.dragStartX = event.clientX - image.left;
            this.dragStartY = event.clientY - image.top;
            document.addEventListener('mousemove', this.dragImage);
            document.addEventListener('mouseup', this.stopDragImage);
            },
            dragImage(event) {
            if (!this.isDraggingImage || !this.selectedImageId) return;
            const image = this.images.find((img) => img.id === this.selectedImageId);
            if (!image) return;
            image.left = event.clientX - this.dragStartX;
            image.top = event.clientY - this.dragStartY;
            if (image.left < 0) image.left = 0;
            if (image.top < 0) image.top = 0;
            },
            stopDragImage() {
            this.isDraggingImage = false;
            document.removeEventListener('mousemove', this.dragImage);
            document.removeEventListener('mouseup', this.stopDragImage);
            },
            startResizeImage(event, position, id) {
            this.isResizingImage = true;
            this.resizePosition = position;

            const image = this.images.find((img) => img.id === id);
            if (!image) return;

            // Сохраняем начальные значения
            this.initialImageLeft = image.left;
            this.initialImageTop = image.top;
            this.initialImageWidth = image.width;
            this.initialImageHeight = image.height;

            // Сохраняем начальные координаты мыши
            this.startX = event.clientX;
            this.startY = event.clientY;

            document.addEventListener('mousemove', this.resizeImage);
            document.addEventListener('mouseup', this.stopResizeImage);
            },
            resizeImage(event) {
            if (!this.isResizingImage || !this.selectedImageId) return;

            const image = this.images.find((img) => img.id === this.selectedImageId);
            if (!image) return;

            const deltaX = event.clientX - this.startX;
            const deltaY = event.clientY - this.startY;

            // Сохраняем исходное соотношение сторон
            const aspectRatio = this.initialImageWidth / this.initialImageHeight;

            switch (this.resizePosition) {
                case 'top-left':
                image.width = this.initialImageWidth - deltaX;
                image.height = image.width / aspectRatio; // Пропорциональная высота
                image.left = this.initialImageLeft + deltaX;
                image.top = this.initialImageTop + (this.initialImageHeight - image.height);
                break;

                case 'top-right':
                image.width = this.initialImageWidth + deltaX;
                image.height = image.width / aspectRatio; // Пропорциональная высота
                image.top = this.initialImageTop + (this.initialImageHeight - image.height);
                break;

                case 'bottom-left':
                image.height = this.initialImageHeight + deltaY;
                image.width = image.height * aspectRatio; // Пропорциональная ширина
                image.left = this.initialImageLeft - (image.width - this.initialImageWidth);
                break;

                case 'bottom-right':
                image.width = this.initialImageWidth + deltaX;
                image.height = image.width / aspectRatio; // Пропорциональная высота
                break;
            }

            // Ограничение минимальных размеров
            if (image.width < 10) {
                image.width = 10;
                image.height = image.width / aspectRatio; // Пропорциональная высота
                if (this.resizePosition.includes('left')) {
                image.left -= 10 - image.width; // Корректируем позицию
                }
            }

            if (image.height < 10) {
                image.height = 10;
                image.width = image.height * aspectRatio; // Пропорциональная ширина
                if (this.resizePosition.includes('top')) {
                image.top -= 10 - image.height; // Корректируем позицию
                }
            }

            // Ограничение перемещения за пределы контейнера
            if (image.left < 0) image.left = 0;
            if (image.top < 0) image.top = 0;
            },
            stopResizeImage() {
            this.isResizingImage = false;
            document.removeEventListener('mousemove', this.resizeImage);
            document.removeEventListener('mouseup', this.stopResizeImage);
            },
            addImage() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                const newImage = {
                    id: Date.now(),
                    top: 50,
                    left: 50,
                    width: 100,
                    height: 100,
                    src: e.target.result,
                };
                this.images.push(newImage);
                this.selectedImageId = newImage.id;
                };
                reader.readAsDataURL(file);
            };
            input.click();
            },
            deleteImage(id) {
            this.images = this.images.filter((img) => img.id !== id);
            if (this.selectedImageId === id) {
                this.selectedImageId = null;
            }
            },
            enableEditing(id) {
            this.editingBlockId = id;
            },
            disableEditing() {
            this.editingBlockId = null;
            },
            updateText(id, event) {
            const block = this.textBlocks.find((b) => b.id === id);
            if (block) {
                block.text = event.target.innerText; // Обновляем текст из содержимого элемента
            }
            },
            deselectBlock() {
            this.selectedBlockId = null; // Снимаем выделение при потере фокуса
            },
            selectBlock(id, event) {
            this.selectedBlockId = id; // Выбираем блок
            this.startDragText(event, id); // Начинаем перетаскивание
            },
            addRectangle() {
            const newRectangle = {
                id: Date.now(),
                top: 50,
                left: 50,
                width: 100,
                height: 50,
                color: '#000000',
                opacity: 0.5,
            };
            this.rectangles.push(newRectangle);
            this.selectedRectangleId = newRectangle.id;
            },
            deleteRectangle(id) {
            this.rectangles = this.rectangles.filter((r) => r.id !== id);
            if (this.selectedRectangleId === id) {
                this.selectedRectangleId = null;
            }
            },
            selectRectangle(id, event) {
            // Проверяем, что событие не связано с изменением размера
            if (!this.isResizing) {
                this.selectedRectangleId = id;
                this.selectedRectangle = this.rectangles.filter(rect => rect.id == id)[0];
                this.startDragRectangle(event, id);
            }
            },
            startDragRectangle(event, id) {
            const rectangle = this.rectangles.find((r) => r.id === id);
            if (!rectangle) return;
            this.isDraggingRectangle = true;
            this.dragStartX = event.clientX - rectangle.left;
            this.dragStartY = event.clientY - rectangle.top;
            document.addEventListener('mousemove', this.dragRectangle);
            document.addEventListener('mouseup', this.stopDragRectangle);
            },
            dragRectangle(event) {
                if (!this.isDraggingRectangle || !this.selectedRectangleId) return;
                const rectangle = this.rectangles.find((r) => r.id === this.selectedRectangleId);
                if (!rectangle) return;

                // Получаем текущие координаты контейнера
                const container = this.$refs.container;
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;

                // Вычисляем новые координаты прямоугольника
                let newLeft = event.clientX - this.dragStartX;
                let newTop = event.clientY - this.dragStartY;

                // Ограничиваем перемещение по горизонтали (left)
                if (newLeft < 0) {
                    newLeft = 0; // Не выходит за левый край
                } else if (newLeft + rectangle.width > containerWidth) {
                    newLeft = containerWidth - rectangle.width; // Не выходит за правый край
                }

                // Ограничиваем перемещение по вертикали (top)
                if (newTop < 0) {
                    newTop = 0; // Не выходит за верхний край
                } else if (newTop + rectangle.height > containerHeight) {
                    newTop = containerHeight - rectangle.height; // Не выходит за нижний край
                }

                // Применяем новые координаты
                rectangle.left = newLeft;
                rectangle.top = newTop;
            },
            stopDragRectangle() {
            this.isDraggingRectangle = false;
            document.removeEventListener('mousemove', this.dragRectangle);
            document.removeEventListener('mouseup', this.stopDragRectangle);
            },
            startResizeRectangle(event, position, id) {
            this.isResizing = true;
            this.resizePosition = position;

            const rectangle = this.rectangles.find((r) => r.id === id);
            if (!rectangle) return;

            // Сохраняем начальные значения
            this.initialCropLeft = rectangle.left;
            this.initialCropTop = rectangle.top;
            this.initialCropWidth = rectangle.width;
            this.initialCropHeight = rectangle.height;

            // Сохраняем начальные координаты мыши
            this.startX = event.clientX;
            this.startY = event.clientY;

            document.addEventListener('mousemove', this.resizeRectangle);
            document.addEventListener('mouseup', this.stopResizeRectangle);
            },
            resizeRectangle(event) {
            if (!this.isResizing || !this.selectedRectangleId) return;

            const rectangle = this.rectangles.find((r) => r.id === this.selectedRectangleId);
            if (!rectangle) return;

            const deltaX = event.clientX - this.startX;
            const deltaY = event.clientY - this.startY;

            switch (this.resizePosition) {
                case 'top-left':
                rectangle.left = this.initialCropLeft + deltaX;
                rectangle.top = this.initialCropTop + deltaY;
                rectangle.width = this.initialCropWidth - deltaX;
                rectangle.height = this.initialCropHeight - deltaY;
                break;

                case 'top-right':
                rectangle.top = this.initialCropTop + deltaY;
                rectangle.width = this.initialCropWidth + deltaX;
                rectangle.height = this.initialCropHeight - deltaY;
                break;

                case 'bottom-left':
                rectangle.left = this.initialCropLeft + deltaX;
                rectangle.width = this.initialCropWidth - deltaX;
                rectangle.height = this.initialCropHeight + deltaY;
                break;

                case 'bottom-right':
                rectangle.width = this.initialCropWidth + deltaX;
                rectangle.height = this.initialCropHeight + deltaY;
                break;
            }

            // Ограничение минимальных размеров
            if (rectangle.width < 10) {
                if (this.resizePosition.includes('left')) {
                rectangle.left -= 10 - rectangle.width; // Корректируем позицию
                }
                rectangle.width = 10;
            }

            if (rectangle.height < 10) {
                if (this.resizePosition.includes('top')) {
                rectangle.top -= 10 - rectangle.height; // Корректируем позицию
                }
                rectangle.height = 10;
            }

            // Ограничение перемещения за пределы контейнера
            if (rectangle.left < 0) rectangle.left = 0;
            if (rectangle.top < 0) rectangle.top = 0;
            },
            stopResizeRectangle() {
            this.isResizing = false;
            document.removeEventListener('mousemove', this.resizeRectangle);
            document.removeEventListener('mouseup', this.stopResizeRectangle);
            },
            splitTextIntoLines(text) {
            return text.split('\n');
            },
            wrapText(ctx, text, x, y, maxWidth) {
            const words = text.split(' ');
            let line = '';
            let lines = [];

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > maxWidth && n > 0) {
                lines.push(line.trim());
                line = words[n] + ' ';
                } else {
                line = testLine;
                }
            }

            lines.push(line.trim());
            return lines;
            },
            getShift() {
                const wrapper = document.querySelector('.vue-rectangle-stencil');
                const computedStyle = window.getComputedStyle(wrapper);
                const leftValue = computedStyle.transform;

                const match = leftValue.match(/matrix\(\s*[-\d.]+,\s*[-\d.]+,\s*[-\d.]+,\s*[-\d.]+,\s*([-\d.]+),\s*([-\d.]+)\s*\)/);

                if (match) {
                    this.shiftX = parseFloat(match[1]);
                    this.shiftY = parseFloat(match[2]);

                    console.log("Смещение по X:", this.shiftX);
                    console.log("Смещение по Y:", this.shiftY);
                } else {
                    console.error("Неверный формат matrix");
                }
            },
            defaultSize({ imageSize, visibleArea }) {
                    return {
                        width: (visibleArea || imageSize).width,
                        height: (visibleArea || imageSize).height,
                    };
                },
            // Загрузка изображения
            // loadImage(event) {
            // const file = event.target.files[0];
            // if (file) {
            //     // Получаем расширение файла
            //     const fileName = file.name;
            //     this.fileExtension = fileName.split('.').pop().toLowerCase();

            //     const reader = new FileReader();
            //     reader.onload = (e) => {
            //     this.imageSrc = e.target.result;
            //     };
            //     reader.readAsDataURL(file);
            //     setTimeout(() => {
            //     this.getShift();
            //     const widthImagePage = document.querySelector('.vue-preview__wrapper').offsetWidth; 
            //     const heightImagePage = document.querySelector('.vue-preview__wrapper').offsetHeight;
            //     this.startSizeW = widthImagePage;
            //     this.startSizeH = heightImagePage;
            //     }, 2000);
                
            // }
            // },

            // Обработка изменений в области обрезки
            onCropChange({ coordinates }) {
            this.cord = coordinates;
            },

            // Обрезка изображения

            resize() {
                const result = this.$refs.cropper.getResult().canvas.toDataURL();
                const cords = this.$refs.cropper.getResult().coordinates;
                console.log(cords);
                this.currentImage = result;
                this.isCroped = false;

                const widthImagePage = document.querySelector('.vue-preview__wrapper').offsetWidth; 
                const heightImagePage = document.querySelector('.vue-preview__wrapper').offsetHeight;
                this.startSizeW = widthImagePage;
                this.startSizeH = heightImagePage;

                const img = new Image();
                img.src = this.currentImage;

                this.textBlocks = this.textBlocks.filter(item => item.left >= cords.left && item.top >= cords.top && item.top + item.fontSize <= cords.top + cords.height);
                this.rectangles = this.rectangles.filter(item => item.left >= cords.left && item.top >= cords.top && item.top <= cords.top + cords.height);
                this.images = this.images.filter(item => item.left >= cords.left && item.top >= cords.top && item.top <= cords.top + cords.height);
            },

            crop() {
                // eslint-disable-next-line no-unused-vars
                const { coordinates, canvas } = this.$refs.cropper.getResult();
                if (!canvas) {
                    console.error('Canvas is not available');
                    return;
                }

                // Создаем новый canvas для добавления текстовых блоков
                const finalCanvas = document.createElement('canvas');
                const ctx = finalCanvas.getContext('2d');

                // Устанавливаем размеры нового canvas
                finalCanvas.width = canvas.width;
                finalCanvas.height = canvas.height;

                // Рисуем обрезанное изображение на новом canvas
                ctx.drawImage(canvas, 0, 0);

                // Получаем исходные размеры изображения
                const img = new Image();
                img.src = this.currentImage;
                this.getShift();

                img.onload = () => {
                    // Вычисляем масштаб изображения
                    console.log(document.querySelector('.vue-preview__wrapper'));
                    const widthImagePage = document.querySelector('.vue-preview__wrapper').offsetWidth;
                    const heightImagePage = document.querySelector('.vue-preview__wrapper').offsetHeight;
                    const scaleFactorX = img.width / widthImagePage;
                    const scaleFactorY = img.height / heightImagePage;

                    // Отрисовка прямоугольников
                    this.rectangles.forEach((rectangle) => {
                        ctx.fillStyle = rectangle.color;
                        ctx.globalAlpha = rectangle.opacity; // Прозрачность прямоугольника

                        const scaledLeft = (rectangle.left - this.shiftX) * scaleFactorX * (widthImagePage / this.startSizeW);
                        const scaledTop = (rectangle.top - this.shiftY) * scaleFactorY * (heightImagePage / this.startSizeH);
                        const scaledWidth = rectangle.width * scaleFactorX * (widthImagePage / this.startSizeW);
                        const scaledHeight = rectangle.height * scaleFactorY * (heightImagePage / this.startSizeH);

                        ctx.fillRect(scaledLeft, scaledTop, scaledWidth, scaledHeight);
                    });

                    // Возвращаем прозрачность к стандартному значению
                    ctx.globalAlpha = 1;

                    const imagePromises = this.images.map((image) => {
                    return new Promise((resolve) => {
                        const overlayImg = new Image();
                        overlayImg.src = image.src;

                        overlayImg.onload = () => {
                        const scaledLeft = (image.left - this.shiftX) * scaleFactorX * (widthImagePage / this.startSizeW);
                        const scaledTop = (image.top - this.shiftY) * scaleFactorY * (heightImagePage / this.startSizeH);
                        const scaledWidth = image.width * scaleFactorX * (widthImagePage / this.startSizeW);
                        const scaledHeight = image.height * scaleFactorY * (heightImagePage / this.startSizeH);

                        ctx.drawImage(overlayImg, scaledLeft, scaledTop, scaledWidth, scaledHeight);
                        resolve(); // Разрешаем Promise после отрисовки изображения
                        };

                        overlayImg.onerror = () => {
                        console.error('Ошибка загрузки изображения:', image.src);
                        resolve(); // Разрешаем Promise даже при ошибке
                        };
                    });
                    });

                    // Добавляем текстовые блоки
                    this.textBlocks.forEach((block) => {
                        ctx.font = `${block.fontStyle} ${block.fontWeight} ${block.fontSize * scaleFactorY * (heightImagePage / this.startSizeH)}px ${block.fontFamily}`;
                        ctx.fillStyle = block.color;

                        // Пересчитываем позицию текста с учётом масштаба
                        let scaledLeft = (block.left - this.shiftX) * scaleFactorX * (widthImagePage / this.startSizeW);
                        const scaledTop = (block.top - this.shiftY) * scaleFactorY * (heightImagePage / this.startSizeH) + block.fontSize * scaleFactorY * (heightImagePage / this.startSizeH)  * 1.2;

                        // Разбиваем текст на строки
                        const lines = this.splitTextIntoLines(block.text);
                        const lineHeight = block.fontSize * scaleFactorY * (heightImagePage / this.startSizeH); // Высота строки
                        
                        const textMetrics = ctx.measureText(lines[0]);
                        const textWidth = textMetrics.width;

                        if (block.textAlign === 'center') {
                            scaledLeft += textWidth / 2; // Центрируем по ширине текста
                            ctx.textAlign = 'center';
                        } else if (block.textAlign === 'right') {
                            scaledLeft += textWidth; // Выравниваем по правому краю
                            ctx.textAlign = 'right';
                        } else {
                            ctx.textAlign = 'left'; // По умолчанию выравнивание по левому краю
                        }
                        // Рисуем каждую строку
                        lines.forEach((line, index) => {
                            ctx.fillText(line, scaledLeft, scaledTop + index * lineHeight);
                        });
                    });

                    // Ждём завершения загрузки всех изображений
                    Promise.all(imagePromises).then(() => {
                    // Сохраняем результат в Base64
                    this.croppedImage = finalCanvas.toDataURL(`image/${this.fileExtension}`);
                    console.log(this.croppedImage);
                    });
                };
            },

            // Скачивание обрезанного изображения
            downloadImage() {
                this.crop();

                if (!this.croppedImage) return;

                const link = document.createElement('a');
                link.href = this.croppedImage;
                link.download = `cropped-image.${this.fileExtension}`;
                link.click();
            },

            // Добавление текстового блока
            addTextBlock() {
                const newBlock = {
                    id: Date.now(),
                    text: 'Новый текст',
                    top: 200,
                    left: 400,
                    fontSize: 20,
                    color: '#000000',
                    fontWeight: 'normal', // По умолчанию обычный текст
                    fontStyle: 'normal',  // По умолчанию без курсива
                    fontFamily: 'Arial',  // По умолчанию Arial
                    width: 200,           // Ширина текстового блока
                    textAlign: 'left',
                };
                this.textBlocks.push(newBlock);
                this.selectedBlockId = newBlock.id; // Выбираем новый блок
            },
            // Удаление текстового блока
            deleteBlock(id) {
                this.textBlocks = this.textBlocks.filter((block) => block.id !== id);
                if (this.selectedBlockId === id) {
                    this.selectedBlockId = null; // Снимаем выделение
                }
            },


            // Начало перетаскивания текстового блока
            startDragText(event, id) {
                const block = this.textBlocks.find((b) => b.id === id);
                if (!block) return;

                this.isDraggingText = true;
                this.dragStartX = event.clientX - block.left;
                this.dragStartY = event.clientY - block.top;

                document.addEventListener('mousemove', this.dragText);
                document.addEventListener('mouseup', this.stopDragText);
            },

            // Перетаскивание текстового блока
            // dragText(event) {
            //     if (!this.isDraggingText || !this.selectedBlockId) return;

            //     const block = this.textBlocks.find((b) => b.id === this.selectedBlockId);
            //     if (!block) return;

            //     block.left = event.clientX - this.dragStartX;
            //     block.top = event.clientY - this.dragStartY;

            //     // Ограничение перемещения внутри контейнера
            //     if (block.left < 0) block.left = 0;
            //     if (block.top < 0) block.top = 0;
            // },
            dragText(event) {
                console.log("dragEvent");
                if (!this.isDraggingText || !this.selectedBlockId) return;
  
                const block = this.textBlocks.find((b) => b.id === this.selectedBlockId);
                if (!block) return;

                // Вычисляем новые координаты
                let newLeft = event.clientX - this.dragStartX;
                let newTop = event.clientY - this.dragStartY;

                // Ограничение перемещения внутри контейнера
                const container = this.$refs.container; // Получаем контейнер
                
                if (container) {
                    const containerRect = container.getBoundingClientRect();
                    
                    // Ограничение по левому краю
                    if (newLeft < 0) newLeft = 0;
                    
                    // Ограничение по верхнему краю
                    if (newTop < 0) newTop = 0;
                    
                    // Ограничение по правому краю
                    if (newLeft + block.width > containerRect.width) {
                        newLeft = containerRect.width - block.width;
                    }
                    
                    console.log(newTop, block.fontSize, containerRect.height);
                    // Ограничение по нижнему краю
                    if (newTop + block.fontSize > containerRect.height) {
                        console.log('опа');
                        newTop = containerRect.height - block.fontSize;
                    }
                }

                // Применяем новые координаты
                block.left = newLeft;
                block.top = newTop;
            },

            // Остановка перетаскивания текстового блока
            stopDragText() {
                this.isDraggingText = false;
                document.removeEventListener('mousemove', this.dragText);
                document.removeEventListener('mouseup', this.stopDragText);
            },
        },
    };
</script>

<style scoped>
    .wrapper {
        width: 100vw;
        height: 100%;
        display: flex;
        justify-content: center;
        /* align-items: center; */
        background: rgba(0, 0, 0, 0.3);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
    }
    .editor {
        width: 1054px;
        display: flex;
        flex-direction: column;
        row-gap: 30px;
        padding: 50px 150px;
        background: #1B1E3D;
        border-radius: 10px;
        overflow-y: auto;
        position: relative;
    }
    h1 {
        font-size: 40px;
        font-family: 'OpenSans';
        color: white;
        font-weight: bold;
        width: fit-content;
        align-self: center;
    }
    .header {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-between;
    }
    .header_tools {
        display: flex;
        align-items: center;
        column-gap: 40px;
        padding: 0px 20px;
        background: #2F3251;
        border-radius: 10px;
    }
    .header_tools img {
        width: 39px;
        height: 39px;
        cursor: pointer;
    }
    .save, .download {
        width: 160px;
        font-size: 16px;
    }
    .tools {
        display: flex;
        justify-content: space-between;
        margin-top: 50px;
    }
    .layers {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
        padding: 15px 10px;
        background: #2F3251;
        border-radius: 10px;
    }
    .layers h2 {
        font-size: 16.4px;
        color: white;
        font-family: 'OpenSans';
        font-weight: normal;
    }
    .line {
        width: 100%;
        height: 1px;
        background: white;
    }
    .layer-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        color: white;
        font-size: 16.4px;
        font-family: 'OpenSans';
    }
    .delete_lay {
        width: 17px;
        height: 17px;
    }
    .preview {
        max-width: 40px;
        max-height: 25px;
        width: auto;
        object-fit: cover;
    }
    .text_tools {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .text_tools_row {
        width: 100%;
        padding-left: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: 30px;
    }
    .color_rectangle {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        align-items: center;
    }
    h2 {
        font-size: 16.4px;
        color: white;
        font-family: 'OpenSans';
    }
    .color_rect {
        width: 54px;
        height: 54px;
        background: #282826; /* ЗАМЕНИТЬ НА ДИНАМИКУ В КОДЕ */
        cursor: pointer;
    }
    .rect_opacity {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 10px;
    }
    .vertical_line {
        height: 72px;
        width: 1px;
        background: white;
    }
    .text_text {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        color: white;
    }
    .text_text span {
        font-size: 58.33px;
    }
    .bold {
        font-weight: bold;
    }
    .italic {
        font-style: italic;
    }
    .color_text {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        position: relative;
    }
    .color_circle {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: none;
        transition: 0.1s ease;
    }
    .rect_op {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid white;
    }
    h3 {
        font-size: 11px;
        color: white;
        font-family: 'OpenSans';
    }
    .text_align {
        display: flex;
        column-gap: 23px;        
    }
    .text_align_item {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .text_align_left, .text_align_center, .text_align_right {
        display: flex;
        flex-direction: column;
        row-gap: 9px;
        cursor: pointer;
    }
    .text_align_center { align-items: center; }
    .text_align_right { align-items: end; }
    .text_align_left div:nth-child(1), .text_align_center div:nth-child(1), .text_align_right div:nth-child(1) {
        width: 45.57px;
        background: white;
        height: 1px;
    }
    .text_align_left div:nth-child(2), .text_align_center div:nth-child(2), .text_align_right div:nth-child(2) {
        width: 27.34px;
        height: 1px;
        background: white;
    }
    .text_align_left div:nth-child(3), .text_align_center div:nth-child(3), .text_align_right div:nth-child(3) {
        width: 45.57px;
        height: 1px;
        background: white;
    }
    .text_align_left div:nth-child(4), .text_align_center div:nth-child(4), .text_align_right div:nth-child(4){
        width: 27.34px;
        height: 1px;
        background: white;
    }
    .upload_logo {
        width: 180px;
        font-size: 16px;
    }
    .font_size {
        border: none;
        width: 55px;
        padding: 5px 10px;
        font-size: 20px;
        color: white;
        background: #2F3251;
        appearance: none; /* Убирает стандартные стили браузера */
        -moz-appearance: textfield; /* Для Firefox */
        text-align: center;
    }
    .font_size::-webkit-inner-spin-button,
    .font_size::-webkit-outer-spin-button {
    -webkit-appearance: none; /* Убирает стрелки для Webkit-браузеров (Chrome, Safari и т.д.) */
    margin: 0; /* Убирает отступы, если они есть */
    }
    .font_dropdown {
        width: 240px;
        height: 40px;
        background: #2F3251;
        font-size: 15px;
        color: white;
        border: none;
        padding: 5px 13px;
        appearance: none; /* Убираем стандартную стрелку */
        -webkit-appearance: none; /* Для Safari */
        -moz-appearance: none; /* Для Firefox */
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 6"><path fill="white" d="M0 0l5 6 5-6z"/></svg>'); /* Добавляем собственную стрелку */
        background-repeat: no-repeat;
        background-position: right 10px center; /* Позиционируем стрелку */
        background-size: 10px 6px; /* Размер стрелки */
    }
    .cropper-background {
        background: none;
    }
    .image-background {
        position: absolute;
        width: calc(100% + 20px);
        height: calc(100% + 20px);
        left: -10px;
        top: -10px;
        background-size: cover;
        background-position: 50%;
        filter: blur(5px);
    }
    .crop_msg {
        display: flex;
        align-items: center;
        column-gap: 20px;
        align-self: center;
    }
    .crop {
        width: 100px;
        height: 40px;
    }
    .crop_msg span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
    }

    .close {
        position: absolute;
        right: 30px;
        top: 30px;
        width: 21px;
        height: 21px;
        cursor: pointer;
        @media (max-width: 450px) {
            right: 20px;
            top: 20px;
        }
    }
    .vue-advanced-cropper__background, .vue-advanced-cropper__foreground {
        background: none !important;
    }


    /* ============================================== */
    /* СТИЛИ С СТАРОГО ФАЙЛА !!!!!!!!!!!!!!!!!!!!!!!!!! */
    /* ============================================== */
    .cropper-container {
        position: relative;
        max-width: 80vw;
        max-height: 100vh;
        /* overflow: hidden; */
        position: relative;
        /* margin: 20px auto; */
    }

    .text-blocks {
        position: relative;
    }

    .text-block {
        position: absolute;
        font-family: Arial, sans-serif;
        white-space: pre-wrap; /* Сохраняет переносы строк */
        word-wrap: break-word; /* Переносит длинные слова */
        pointer-events: auto;
        line-height: normal;
        display: inline-block;
    }

    .text-block:hover {
        border: 1px dashed blue;
    }

    .layers-panel {
        margin-top: 20px;
    }


    .controls {
        margin-top: 10px;
    }

    .controls {
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .controls input[type="checkbox"] {
        margin-right: 5px;
    }

    .controls select {
        padding: 5px;
        font-size: 14px;
    }
    .rectangle {
        position: absolute;
        pointer-events: auto;
    }
    .overlay-image {
        position: absolute;
        pointer-events: auto;
        user-select: none;
    }

    .handle {
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: white;
        border: 1px solid black;
        box-sizing: border-box;
        cursor: pointer;
    }

    .handle.top-left {
        top: -5px;
        left: -5px;
        cursor: nw-resize;
    }   

    .handle.top-right {
        top: -5px;
        right: -5px;
        cursor: ne-resize;
    }

    .handle.bottom-left {
        bottom: -5px;
        left: -5px;
        cursor: sw-resize;
    }

    .handle.bottom-right {
        bottom: -5px;
        right: -5px;
        cursor: se-resize;
    }
    .text-block {
        position: absolute;
        pointer-events: auto;
    }
</style>