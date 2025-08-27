/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { ButtonView, Plugin } from 'ckeditor5';

export default class SpoilerUI extends Plugin {
	init() {
		const editor = this.editor;

		// Register the button in the editor's UI component factory.
		editor.ui.componentFactory.add( 'spoiler', () => {
			const button = new ButtonView();

			button.label = 'Spoiler';
			button.tooltip = true;
			button.withText = true;

			this.listenTo( button, 'execute', () => {
				const title = 'What You See Is What You Get';
				const abbr = 'Скрытый текст';

				// Change the model to insert the abbreviation.
				editor.model.change( writer => {
					editor.model.insertContent(
						// Create a text node with the abbreviation attribute.
						writer.createText( abbr, { spoiler: title } )
					);
				} );
			} );

			return button;
		} );
	}
}