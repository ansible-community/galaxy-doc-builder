# Ansible Doc Renderer

This package provides a series of react components that can be used render ansible
plugin documentation. These components rely on the output from the [galaxy importer](https://github.com/ansible/ansible-hub-ui)

## Components

### RenderPluginDoc

Renders the documentation strings from a plugin.

Props

-   `plugin`: documentation blob for plugin being rendered. This is produced by the
    galaxy-importer.
-   `renderModuleLink(moduleName)`: function that should return a link pointing to a module
-   `renderDocLink(name, href)`: function that should return a link pointing to docs
-   `renderTableOfContentsLink(title, section)`: function that returns a table of contents
    link for scrolling the page down to the various headers.

### DocsNav

Provides a navigation menu for all of the content inside a collection.

Props

-   `docs_blob`: docs blob object output from galaxy-importer
-   `namespace`: collection namespace
-   `name`: collection name
-   `renderLink`: renders the link in the navigation menu. Can be used to insert a react-router `<Link>` or an html `<a>`
-   `selectedName`: name of currently selected content
-   `selectedType`: type of currently selected content
-   `className`: CSS class for navigation wrapper
