/*
 * TrelloWIPLimits v0.2.1 <https://github.com/NateHark/TrellowWIPLimits>
 * Adds work-in-progress limits to Trello lists supporting a Kanban workflow.
 * Inspired by TrelloScrum <https://github.com/Q42/TrelloScrum> 
 *
 * Original Author:
 * Nathan Harkenrider <https://github.com/NateHark>
 *
 */

$(function(){
    // Watch for list changes	
    $('body').bind('DOMSubtreeModified',function(e){
        if($(e.target).hasClass('list')) {
            updateList($(e.target));
        }
    });

    // Recalculate limits when the list title is changed
    $('.list-title .js-save-edit').live('mouseup', function(e) {
        updateList($(e.target).parents('.list'));        
    });
	
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

	updateList($('.list'));
});

//.list pseudo
function List(el) {
    if(el.list) return;
	el.list=this;

	var $list=$(el),
        $listHeader,
        listMatch = /\[(\d+)\]/,
        cardLimit;   

    $listHeader = $list.find('.list-header h2');

    function calcWipLimit() {
        if(!$listHeader) {
            return;
        }

        $listHeader.contents().each(function() {
            if(this.nodeType === 3) {
                var listName = this.nodeValue;
                var matches = listMatch.exec(listName);
                if(matches && matches.length == 2) {
                    cardLimit = matches[1];
                } else {
                    cardLimit = null;
                }
            }
        });
    }

    this.checkWipLimit = function() {
        $list.removeClass('over-limit');
        $list.removeClass('at-limit');

        calcWipLimit();
        
        if(cardLimit && cardLimit > 0) {
            var cardCount = 0;
            $list.find('.list-card').each(function() {
                if($(this).parent().hasClass('card-composer')) return true;    
                cardCount++;
            });
            
            if(cardCount >= cardLimit) {
                if(cardCount == cardLimit) { 
                    $list.addClass('at-limit');
                } else {
                    $list.addClass('over-limit');
                }
            }
        }
    }
};
