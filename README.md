# MCMS WP Plugin UI
A svelte based UI for the MCMS Wordpress plugin.

Uses custom elements to render the UI across different places on the Wordpress admin panel.

## The Elements

### Sync App
This is the main app which show the history of all builds as well as the `refresh-data-button` element
to trigger a new build.

### Refresh Data Button
This element shows 3 buttons actually. One to open the preview server,
one to refresh the data and one to trigger a manual build.

It has 2 modes, one where the buttons are stacked and one where they are inline.

### Notifications Bar
It's a notifications bar to show the progress of the build
