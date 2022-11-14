# Galaxy Doc Builder

**:warning: Note**

This repository has been archived, code moved to [ansible-hub-ui](https://github.com/ansible/ansible-hub-ui) in https://github.com/ansible/ansible-hub-ui/pull/2850.

---


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
-   `renderWarning(text)`: function that returns a warning banner when something breaks during rendering.
