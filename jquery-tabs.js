/**
* Tabs
*
* Automatically group given elements into a tab group.
* Requires jQuery.
*
* @version 1.0
* @author Daniel Farrelly <daniel@jellystyle.com>
* @link <https://github.com/jellybeansoup/jquery-textfit>
*/

(function( $ ){

	/**
	* The textfit function (an alias for $.textfit._init).
	* Works with a jQuery object array.
	* @var function
	*/

	$.tabs = function( group_by ) {
		// Loop through each object
		$('['+group_by+']').each(function(){
			// Set up the widget
			var tabs = {

				/**
				* The DOM elements that make up the widget
				* @var object
				*/

				dom: {
					container: null,
					tabs: null,
					panes: null
				},

				/**
				* Initialise a popover widget
				* @param object
				* @param items
				* @return A rotator widget.
				*/

				init: function( group_name, panes ) {
					var widget = this;
					// Set up the DOM
					widget.dom.container = jQuery('<div></div>').addClass('ui-tab-container').attr('id','tabs-'+group_name);
					widget.dom.tabs = jQuery('<ul></ul>').addClass('ui-tabs');
					widget.dom.panes = panes;
					// Insert a marker
					var marker = jQuery('<a></a>').insertBefore(panes.first());
					// Remove the panes
					widget.dom.panes.remove();
					// Go through the available panes and move them into the tab container
					var tabs_li = [];
					var l = widget.dom.panes.length;
					for( var i=0; i<l; i++ ) {
						// Add to the container
						var id = 'ui-tabs-'+( ( new Date().getTime() ) + Math.round( Math.random() * 1000000 ) );
						var pane = jQuery(widget.dom.panes[i]).addClass('ui-tab-content').attr('data-pane',id);
						var title = pane.attr('title') || pane.find('h1,h2,h3,h4,h5').first().addClass('ui-tab-title').text();
						// Add the tab
						tabs_li[i] = '<li data-tab="'+id+'"><a href="javascript:null">'+title+'</a></li>';
					}
					widget.dom.tabs.html( tabs_li.join('') );
					// React to state change
					widget.dom.tabs.on('click','li a',widget,function(e){
						e.data._click_tab( $(this).parent() );
					});
					// Show the first tab
					if( panes.filter('.selected').length ) {
						widget._tabForPane( widget.dom.panes.filter('.selected').first() ).find('a').click();
					}
					else {
						widget.dom.tabs.find('li a').first().click();
					}
					// Write to the DOM
					widget.dom.container.append(widget.dom.tabs).append(widget.dom.panes).insertBefore(marker);
					// Remove the marker
					marker.remove();
				},

				/**
				* Initialise a popover widget
				* @param object
				* @param items
				* @return A rotator widget.
				*/

				_click_tab: function( tab ) {
					var pane = this._paneForTab( tab );
					if( ! tab.hasClass('selected') ) {
						// Mark the correct tab as selected
						this.dom.tabs.find('li').not(tab).removeClass('selected');
						tab.addClass('selected');
						// Show the correct tab
						this.dom.panes.not(pane).removeClass('selected');
						pane.addClass('selected');
					}
				},

				/**
				* Get the tab for a given pane.
				* @param pane
				* @return The tab matching the given pane
				*/

				_tabForPane: function( pane ) {
					var id = pane.attr('data-pane');
					return this.dom.tabs.find('[data-tab="'+id+'"]');
				},

				/**
				* Get the pane for a given tab.
				* @param pane
				* @return The pane matching the given tab
				*/

				_paneForTab: function( tab ) {
					var id = tab.attr('data-tab');
					return this.dom.panes.filter('[data-pane="'+id+'"]');
				},

				/**
				* The version number of this plugin
				* @var string
				*/

				_version: '1.0'

			};
			// Initialising function
			var initTabs = function( group_by ) {
				var widget = this;
				// First we find all the groups
				var groups = {};
				var panes = jQuery('['+group_by+']');
				var l = panes.length;
				for( var i=0; i<l; i++ ) {
					// The group name
					var group = $(panes[i]).attr(group_by);
					// Fetch this group
					if( typeof group !== 'undefined' && typeof groups[group] !== 'object' ) {
						groups[group] = jQuery('['+group_by+'="'+group+'"]');
					}
				}
				// Remove the grouping attribute from the panes
				panes.removeAttr(group_by);
				// Now we deal with each group individually
				for( var group_name in groups ) {
					tabs.init( group_name, groups[group_name] );
				}
			};
			// Do it when an ajax page is loaded
			$(document).ajaxSuccess(function( e, xhr, settings ) {
				for( var i in settings.dataTypes ) {
					if( settings.dataTypes[i] === 'html' ) {
						initTabs( group_by );
						return;
					}
				}
			});
			// Instantiate the widget
			if( jQuery('['+group_by+']').length ) {
				return initTabs( group_by );
			}
		});
	};

})( jQuery );

/**
* Apply automatically to selected elements on load.
*/

(function() {

	var $ = jQuery, s = document.getElementsByTagName('script');
	if (s[s.length - 1].src.indexOf('?auto') > -1 ) {
		$().ready(function () {
			$.tabs('data-tab-group');
		});
	}

})();