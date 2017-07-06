/** Represents an individual list in Trello. Observes the list for changes. */
class TrelloList {
    public readonly listNode: Element;
    private listContentNode: Element;
    private listObserver: MutationObserver;
    private listHeaderNode: Element;
    private listHeaderObserver: MutationObserver;
    private minCards: number = -1;
    private maxCards: number = Number.POSITIVE_INFINITY;
    private wipLimitPattern: RegExp = /\[(\d+)(?:-(\d+))?\]/;

    constructor(listNode: Element) {
        this.listNode = listNode;
        this.listObserver = new MutationObserver(this.observeListChanges);
        this.listObserver.observe(this.listNode, { childList: true, subtree: true });

        this.listHeaderNode = this.listNode.querySelector("h2.list-header-name-assist");
        this.listHeaderObserver = new MutationObserver(this.observeListHeaderChanges);
        this.listHeaderObserver.observe(this.listHeaderNode, { childList: true });

        this.listContentNode = this.listNode.querySelector(".js-list-content");

        this.processListTitle();
    }

    /** Applies the card limit via CSS */
    public applyCardLimit() {
        const classList = this.listContentNode.classList;

        classList.remove("over-limit");
        classList.remove("at-limit");

        const cardCount = this.listContentNode.querySelectorAll(".list-card").length;
        if (cardCount > this.maxCards || cardCount < this.minCards) {
            classList.add("over-limit");
        }

        if (cardCount === this.maxCards || cardCount === this.minCards) {
            classList.add("at-limit");
        }
    }

    /** Determines whether the provided element represents a Trello Card */
    private isListCard(element: Element): boolean {
        return element.classList.contains("list-card") && !element.classList.contains("js-member-droppable");
    }

    /** MutationObserver callback for changes to the list title */
    private observeListHeaderChanges = (mutations: MutationRecord[]) => {
        this.processListTitle();
        this.applyCardLimit();
    }

    /** MutationObserver callback for changes to the list */
    private observeListChanges = (mutations: MutationRecord[]) => {
        let cardAddedOrRemoved = false;

        for (const mutation of mutations) {
            for (const entry of [].slice.call(mutation.addedNodes)) {
                if (entry instanceof Element && this.isListCard(entry)) {
                    cardAddedOrRemoved = true;
                    break;
                }
            }

            for (const entry of [].slice.call(mutation.removedNodes)) {
                if (entry instanceof Element && this.isListCard(entry)) {
                    cardAddedOrRemoved = true;
                    break;
                }
            }
        }

        if (cardAddedOrRemoved) {
            this.applyCardLimit();
        }
    }

    /** Parse the list title text and attempts to extract the min/max card count */
    private parseListTitle(listTitle: string): [number, number] {
        const matches = this.wipLimitPattern.exec(listTitle);
        if (!matches || matches.length !== 3) {
            return [-1, Number.POSITIVE_INFINITY];
        }

        if (matches[2]) {
            return [Number(matches[1]), Number(matches[2])];
        } else {
            return [-1, Number(matches[1])];
        }
    }

    private processListTitle() {
        const listTitle = this.listHeaderNode.textContent;
        const limits = this.parseListTitle(listTitle);
        this.minCards = limits[0];
        this.maxCards = limits[1];
    }
}
