/*
 * TrelloWIPLimits v0.3.1 <https://github.com/NateHark/TrellowWIPLimits>
 * Adds work-in-progress limits to Trello lists supporting a Kanban workflow.
 * Inspired by TrelloScrum <https://github.com/Q42/TrelloScrum> 
 *
 * Original Author:
 * Nathan Harkenrider <https://github.com/NateHark>
 *
 */

$(function() {
    function updateList($c) {
        $c.each(function() {
            if(!this.list) { 
                new List(this);
            } else { 
                if(this.list.checkWipLimit) { 
                    this.list.checkWipLimit();
                }
            }
        });
    };
    
    // Watches lists for changes 
    var listObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            setTimeout(function() { 
                updateList($(mutation.target).closest('.list')); 
            });
        });
    });

    // Watches the content div for changes. This ensures the board observers
    // are properly wired when you switch from the board list to a particular board 
    var contentObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var lists = $(mutation.target).find('#board .list');
            observeLists(lists);
            lists.each(function(index, list) {
                setTimeout(function() { 
                    updateList($(list)); 
                });
            });          
        });
    });

    function observeLists(lists) {
        for(var i = 0, len = lists.length; i < len; i++) {
            listObserver.observe(lists[i], { childList: true, subtree: true });
        }
    }; 

    var content = $.find('#content');
    var lists = $.find('#board .list');

    contentObserver.observe(content[0], { childList: true });
    observeLists(lists);

    // Recalculate limits when the list title is changed
    $('.list-title .js-save-edit').live('mouseup', function(e) {
        setTimeout(function() { updateList($(e.target).parents('.list')); });       
    });
	
    updateList($('.list'));
});

//.list pseudo
function List(el) {
    if(el.list) return;
	el.list=this;

	var $list=$(el),
        $listHeader,
        listMatch = /\[(\d+)(?:-(\d+))?\]/,
        cardMinLimit,
				cardMaxLimit;   

    $listHeader = $list.find('.list-header h2');

    function calcWipLimit() {
        if(!$listHeader) {
            return;
        }

        $listHeader.contents().each(function() {
            if(this.nodeType === 3) {
                var listName = this.nodeValue;
                var matches = listMatch.exec(listName);
		cardMinLimit = cardMaxLimit = null;
		if(!matches || matches.length != 3) {	return; }
		if(typeof matches[2] === 'undefined') {
                    cardMaxLimit = matches[1];
                } else {
                    cardMinLimit = matches[1];
                    cardMaxLimit = matches[2];
                }
            }
        });
    }

    this.checkWipLimit = function() {
        $list.removeClass('over-limit');
        $list.removeClass('at-limit');

        calcWipLimit();
        
        if(cardMaxLimit != null) {
            var cardCount = 0;
            $list.find('.list-card').each(function() {
                if($(this).parent().hasClass('card-composer')) return true;    
                cardCount++;
            });
            
            if(cardCount > cardMaxLimit || (cardMinLimit != null && cardCount < cardMinLimit)) {
                $list.addClass('over-limit');
            } else if (cardCount == cardMaxLimit || (cardMinLimit != null && cardCount == cardMinLimit)) {
                $list.addClass('at-limit');
            }
        }
    }

    this.checkWipLimit();
};
