# Encapsule/jsgraph v0.5 Release Notes

## Summary

v0.5 jsgraph is a breaking upgrade for version v0.4 previously published on npm and GitHub. You cannot simply drop v0.5 into client code written for v0.4 due to these changes:

- v0.5 contains breaking changes to jsgraph DirectedGraph container data object and JSON import/export format.
- v0.5 API has been reworked to use request/response synchronous functions. jsgraph no longer throws Error objects.
- v0.5 directed graph algorithm updates:
-- visitor callback functions must now return a Boolean flag: true to indicate search continuation, false to terminate the current search.
-- visitor callback function signatures are now request/response style (i.e. you'll need to update your code to access parameters from the request object in-parameter).
-- all breadth-first and depth-first algorithm variants now return the search context object instead of a meaningless result. This contains useful information and is essential in advanced scenarios involving multiple searches performed using a common search context.
-- all breadth-first and depth-first algorithm API's have been reworked to hide the the search context and starting vertex signal concepts used in advanced scenarios involving multiple searches performed using a common search context. Most BF* and DF* searches may now be performed by simply specifying the DirectedGraph container and visitor object: initialization of the search context is performed automatically and starting vertices are signaled by default.

