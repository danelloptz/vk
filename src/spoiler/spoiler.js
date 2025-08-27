/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from 'ckeditor5';
import SpoilerEditing from './spoilerediting';
import SpoilerUI from './spoilerui';

export default class Spoiler extends Plugin {
	static get requires() {
		return [ SpoilerEditing, SpoilerUI ];
	}
}