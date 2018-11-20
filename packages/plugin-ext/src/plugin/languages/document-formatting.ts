/********************************************************************************
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import * as theia from '@theia/plugin';
import { DocumentsExtImpl } from '../documents';
import * as Converter from '../type-converters';
import URI from 'vscode-uri/lib/umd';
import { FormattingOptions, SingleEditOperation } from '../../api/model';
import { createToken } from '../token-provider';

export class DocumentFormattingAdapter {

    constructor(
        private readonly provider: theia.DocumentFormattingEditProvider,
        private readonly documents: DocumentsExtImpl
    ) { }

    provideDocumentFormattingEdits(resource: URI, options: FormattingOptions): Promise<SingleEditOperation[] | undefined> {
        const document = this.documents.getDocumentData(resource);
        if (!document) {
            return Promise.reject(new Error(`There are no document for ${resource}`));
        }

        const doc = document.document;

        // tslint:disable-next-line:no-any
        return Promise.resolve(this.provider.provideDocumentFormattingEdits(doc, <any>options, createToken())).then(value => {
            if (Array.isArray(value)) {
                return value.map(Converter.fromTextEdit);
            }
            return undefined;
        });
    }

}
