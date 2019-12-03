import * as React from 'react';

import { capitalize } from 'lodash';
import { Nav, NavExpandable, NavItem, NavList } from '@patternfly/react-core';
import { DocsBlobType } from '../../../src';

class DocsEntry {
    display: string;
    name: string;
    type: string;
}

class Table {
    documentation: DocsEntry[];
    modules: DocsEntry[];
    roles: DocsEntry[];
    plugins: DocsEntry[];
    playbooks: DocsEntry[];
}

interface IState {
    collapsedCategories: string[];
}

interface IProps {
    docs_blob: DocsBlobType;
    namespace: string;
    collection: string;
    renderLink: (linkData: DocsEntry) => React.ReactElement;

    selectedName?: string;
    selectedType?: string;
    className?: string;
}

export class DocsNav extends React.Component<IProps, IState> {
    docsBlobCache: DocsBlobType;
    tableCache: Table;

    constructor(props) {
        super(props);

        this.state = { collapsedCategories: [] };
    }

    render() {
        const { className, docs_blob } = this.props;

        // There's a lot of heavy processing that goes into formatting the table
        // variable. To prevent running everything each time the component renders,
        // cache the value as an object property.
        // This is a lazy anti pattern. I should be using memoization or something
        // like that, but the react docs recommend using a third party memoization
        // library and I am not going to add extra dependencies just for this
        // component https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization

        if (!this.tableCache || this.docsBlobCache !== docs_blob) {
            this.tableCache = this.parseLinks(docs_blob);
            this.docsBlobCache = docs_blob;
        }

        const table = this.tableCache;

        return (
            <div className={className}>
                <Nav>
                    <NavList>
                        {Object.keys(table).map(
                            key =>
                                table[key].length === 0
                                    ? null
                                    : this.renderLinks(table[key], key),
                        )}
                    </NavList>
                </Nav>
            </div>
        );
    }

    private parseLinks(docs_blob: DocsBlobType): Table {
        const { namespace, collection } = this.props;

        const baseUrlParams = {
            namespace: namespace,
            collection: collection,
        };

        const table = {
            documentation: [] as DocsEntry[],
            modules: [] as DocsEntry[],
            roles: [] as DocsEntry[],
            plugins: [] as DocsEntry[],
            playbooks: [] as DocsEntry[],
        };

        table.documentation.push({
            display: 'Readme',
            type: 'docs',
            name: 'readme',
        });

        if (docs_blob.documentation_files) {
            for (const file of docs_blob.documentation_files) {
                table.documentation.push({
                    display: this.capitalize(
                        file.name
                            .split('.')[0]
                            .split('_')
                            .join(' '),
                    ),
                    // selected: selectedType === 'docs' && selectedName === url,
                    type: 'docs',
                    name: file.name,
                });
            }
        }

        if (docs_blob.contents) {
            for (const content of docs_blob.contents) {
                switch (content.content_type) {
                    case 'role':
                        table.roles.push(
                            this.getContentEntry(content, baseUrlParams),
                        );
                        break;
                    case 'module':
                        table.modules.push(
                            this.getContentEntry(content, baseUrlParams),
                        );
                        break;
                    case 'playbook':
                        table.playbooks.push(
                            this.getContentEntry(content, baseUrlParams),
                        );
                        break;
                    default:
                        table.plugins.push(
                            this.getContentEntry(content, baseUrlParams),
                        );
                        break;
                }
            }
        }

        // Sort docs
        for (const k of Object.keys(table)) {
            table[k].sort((a, b) => {
                // Make sure that anything starting with _ goes to the bottom
                // of the list
                if (a.display.startsWith('_') && !b.display.startsWith('_')) {
                    return 1;
                }
                if (!a.display.startsWith('_') && b.display.startsWith('_')) {
                    return -1;
                }
                return a.display > b.display ? 1 : -1;
            });
        }

        return table;
    }

    private renderLinks(links, title) {
        const isExpanded = !this.state.collapsedCategories.includes(title);

        return (
            <NavExpandable
                key={title}
                title={capitalize(`${title} (${links.length})`)}
                isExpanded={isExpanded}
                isActive={this.getSelectedCategory() === title}
            >
                {links.map((link: DocsEntry, index) => (
                    <li
                        style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            display: 'block',
                        }}
                        key={index}
                    >
                        <span>
                            {React.cloneElement(this.props.renderLink(link), {
                                className:
                                    'pf-c-nav__link ' +
                                    (this.isSelected(link)
                                        ? 'pf-m-current'
                                        : ''),
                            })}
                        </span>
                    </li>
                ))}
            </NavExpandable>
        );
    }

    private isSelected(entry: DocsEntry): boolean {
        // the readme's url is always docs/, so load it when the name is null
        if (!this.props.selectedName && entry.name === 'readme') {
            return true;
        }

        return (
            // selected name and type are the values found for type and name
            // in the page url
            this.props.selectedName === entry.name &&
            this.props.selectedType === entry.type
        );
    }

    private getSelectedCategory(): string {
        const { selectedType } = this.props;
        if (!selectedType || selectedType === 'docs') {
            return 'documentation';
        }

        if (selectedType === 'role') {
            return 'roles';
        }

        if (selectedType === 'module') {
            return 'modules';
        }

        return 'plugins';
    }

    private capitalize(s: string) {
        return s.slice(0, 1).toUpperCase() + s.slice(1);
    }

    private getContentEntry(content, base): DocsEntry {
        return {
            display: content.content_name,
            name: content.content_name,
            type: content.content_type,
        };
    }
}
