# TrelloWIPLimits

A simple browser extension that adds work-in-progress limits to [Trello](http://trello.com) lists supporting a Kanban workflow. To set a WIP limit on a list, include the limit in braces in the list title (e.g., "My List [4]). When the number of cards in the list exceeds the limit, the list background will turn red.
You may also set a minimum WIP limit by using a range (e.g "Title [2-3]"). 

## Note
This extension is no longer under active development. There are now multiple Trello Power-Ups that provide similar capabilties. See: [List Limits](https://trello.com/power-ups/5c2462c384ab8949b1724a20) and [Kanban WIP](https://trello.com/power-ups/5e621e477907d7774380f551/kanban-wip-by-corrello)

## Installation
* Google Chrome: [Kanban WIP for Trello](https://chrome.google.com/webstore/detail/kanban-wip-for-trello/oekefjibcnongmmmmkdiofgeppfkmdii).
* Mozilla Firefox: [Kanban WIP for Trello](https://addons.mozilla.org/en-US/firefox/addon/trello-work-in-progress-limit/).

## How to Build

### Prerequisites

Requires [NodeJS](https://nodejs.org/en/) 6.11 or greater.

```bash
# Clone the repository then run:
npm install && npm run build
```

Inspired by TrelloScrum <https://github.com/Q42/TrelloScrum>. [Trello](http://trello.com) is a Trademark of Fog Creek Software, Inc. 
