
# WIP - SilverBullet Outline Sidebar

My Intension is to make a side panel that will scope the headers on the page into an outline view.

## Build

To build this plug, make sure you have [SilverBullet installed with Deno](https://silverbullet.md/Install/Deno). Then, build the plug with:

```shell
deno task build
```

Or to watch for changes and rebuild automatically

```shell
deno task watch
```

Then, copy the resulting `.plug.js` file into your space's `_plug` folder. Or build and copy in one command:

```shell
deno task build && cp *.plug.js /my/space/_plug/
```

SilverBullet will automatically sync and load the new version of the plug, just watch the logs (browser and server) to see when this happens.

## Installation

If you would like to install this plug straight from Github, make sure you have the `.js` file committed to the repo and simply add

```
- github:minusInfinite/outline-sidebar/outline-sidebar.plug.js
```

to your `PLUGS` file, run `Plugs: Update` command and off you go!
