/**
 * The primary class for the extension. Manages the set of TrelloList objects representing lists
 * on a board. Observes the board for changes and add/removes lists as needed
 */
class TrelloWipExtension {
    private contentNode: Element;
    private contentObserver: MutationObserver;
    private boardNode: Element;
    private boardObserver: MutationObserver;
    private trelloLists: TrelloList[] = [];

    constructor() {
        this.contentNode = document.querySelector("#content");
        if (!this.contentNode) {
            return;
        }

        this.contentObserver = new MutationObserver(this.observeContent);
        this.contentObserver.observe(this.contentNode, { childList: true });

        this.initializeBoard();
    }

    /** Initializes WIP limits for the board */
    private initializeBoard() {
        this.boardNode = document.querySelector("#board");
        if (!this.boardNode) {
            return;
        }

        this.boardObserver = new MutationObserver(this.observeBoard);
        this.boardObserver.observe(this.boardNode, { childList: true });

        const listNodes = document.querySelectorAll("#board .js-list");
        for (const listNode of [].slice.call(listNodes)) {
            const trelloList = new TrelloList(listNode);
            this.trelloLists.push(trelloList);

            trelloList.applyCardLimit();
        }
    }

    /** Determines whether the provided element represents a Trello List */
    private isListNode(element: Element): boolean {
        return element.classList.contains("js-list");
    }

    private isBoardWrapper(element: Element): boolean {
        return element.classList.contains("board-wrapper");
    }

    /** MutationObserver callback for the #board element */
    private observeBoard = (mutations: MutationRecord[]) => {
        for (const mutation of mutations) {
            for (const entry of [].slice.call(mutation.addedNodes)) {
                if (entry instanceof Element && this.isListNode(entry)) {
                    const trelloList = new TrelloList(entry);
                    this.trelloLists.push(trelloList);
                }
            }

            for (const entry of [].slice.call(mutation.removedNodes)) {
                if (entry instanceof Element && this.isListNode(entry)) {
                    for (let i = this.trelloLists.length - 1; i >= 0; i--) {
                        if (this.trelloLists[i].listNode === entry) {
                            this.trelloLists.splice(i, 1);
                        }
                    }
                }
            }
        }
    }

    private observeContent = (mutations: MutationRecord[]) => {
        for (const mutation of mutations) {
            for (const entry of [].slice.call(mutation.addedNodes)) {
                if (entry instanceof Element && this.isBoardWrapper(entry)) {
                    this.initializeBoard();
                    return;
                }
            }
        }
    }
}

// Create an instance of the extension
const extension = new TrelloWipExtension();
