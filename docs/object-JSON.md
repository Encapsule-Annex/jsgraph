# Encapsule/jsgraph object reference

## JSON I/O


# JSON Format

jsgraph supports a very simple JSON format for representing the contents of a DirectedGraph container. An empty DirectedGraph container's JSON looks like this:

        '{"vertices":[],"edges":[]}'

The `vertices` array contains vertex descriptor objects that look like this:

        '{"id":"test","props":"whatever we want"}'

... and the `edges` array contains edge descriptor object that look like this:

        '{"u":"apple","v":"orange","props":"not the same"}'

