/**
* Tabs
*
* Automatically group given elements into a tab group.
* Requires jQuery.
*
* @version 1.0
* @author Daniel Farrelly <daniel@jellystyle.com>
* @link <https://github.com/jellybeansoup/jquery-tabs>
*/

(function( $ ){

	/**
	* The JSMTabs widget.
	* A container that can have panes with a linked "tab" added to it. Clicking the tab will cause the pane to be selected.
	* No CSS is applied directly to elements: to hide and show tabs, rules myst be applied within a stylesheet.
	* @param obj The jQuery object to use as the tab group container.
	* @param options An object containing options for the widget.
	* @returns JSMTabs object.
	*/

	var JSMTabs = function( obj, options ) {
		// Set up the DOM
		this._dom.container = obj.addClass('ui-tab-container');
		this._dom.tabContainer = jQuery('<ul></ul>').addClass('ui-tabs').appendTo( this._dom.container );
		// Display a tab
		this._dom.tabContainer.on( 'click', 'li .ui-tab-select', this, function(e) {
			e.data.select( $(this).parent() );
		});
		// Remove a tab
		this._dom.tabContainer.on( 'click', 'li .ui-tab-remove', this, function(e) {
			e.data.remove( $(this).parent() );
		});
	};

	JSMTabs.prototype = {

		/**
		* The DOM structure for this widget
		* @return
		*/

		_dom: {
			container: null,
			tabContainer: null,
			tabs: null,
			panes: null
		},

		/**
		* Find the tab for the given input
		* @param tab Either a tab identifier, a tab or a content pane.
		* @return The tab object matching the provided input.
		*/

		find: function( tab ) {
			// Tab identifier
			if( typeof tab === 'string' ) {
				return this._dom.tabs.filter('[data-tab="'+tab+'"]');
			}
			// Tab object
			else if( this._dom.tabs.filter( tab ).length > 0 ) {
				return tab;
			}
			// Pane object
			else if( this._dom.panes.filter( tab ).length > 0 ) {
				return this._tabForPane( tab );
			}
			// Default
			return null;
		},

		/**
		* Add a new tab
		* @param content The content to display in the tab.
		* @param title The tab's title. If not provided, a title will be extracted from the given content (if possible).
		* @return void
		*/

		add: function( content, title ) {
			// Detect the title if we're not given one
			if( typeof title !== 'string' || title.length <= 0 ) {
				content = $('<div></div>').html(content);
				title = content.find('h1,h2,h3,h4,h5').first().addClass('ui-tab-title').text();
				content = content.html();
			}
			// Set up the DOM
			var id = 'ui-tabs-'+( ( new Date().getTime() ) + Math.round( Math.random() * 1000000 ) );
			var tab = $('<li></li>').attr('data-tab',id).appendTo( this._dom.tabContainer );
			var link = $('<a></a>').addClass('ui-tab-select').attr('href','#').html(title).appendTo( tab );
			var remove = $('<a></a>').addClass('ui-tab-remove').attr('href','#').html('Remove').appendTo( tab );
			var pane = $('<div/>').addClass('ui-tab-content').attr('data-pane',id).html(content).appendTo( this._dom.container );
			// If this is the first tab, we're going to select it
			if( this._dom.tabs === null || this._dom.tabs.length <= 0 ) {
				tab.add(pane).addClass('selected');
			}
			// Collect
			this._dom.tabs = this._dom.tabContainer.children().has( '.ui-tab-select' );
			this._dom.panes = this._dom.container.children().filter( '.ui-tab-content' ).not( this._dom.tabContainer );
			// Return the created tab
			return tab;
		},

		/**
		* Remove the given tab
		* @param tab The tab to remove (can also be a tab identifier or content pane)
		* @return void
		*/

		remove: function( tab ) {
			// Find the tab and it's matching pane
			if( ! ( tab = this.find( tab ) ) ) {
				return;
			}
			// Make sure we select another tab
			if( tab.hasClass('selected') ) {
				this.select( ( ! tab.is(':last-child') ) ? tab.next() : tab.prev() );
			}
			// Remove the tabs
			tab.remove();
			this._paneForTab( tab ).remove();
		},

		/**
		* Display the pane for the given tab
		* @param tab The tab to display the pane for (can also be a tab identifier or content pane)
		* @return A rotator widget.
		*/

		select: function( tab ) {
			// Find the tab and it's matching pane
			if( ! ( tab = this.find( tab ) ) ) {
				return;
			}
			// The tab is already selected
			if( tab.hasClass('selected') ) {
				return;
			}
			// Get the pane and set it as selected
			var pane = this._paneForTab( tab );
			this._dom.tabs.not(tab).add(this._dom.panes.not(pane)).removeClass('selected');
			tab.add(pane).addClass('selected');
		},

		/**
		* Get the tab for a given pane.
		* @param pane The pane to find the tab for
		* @return The tab matching the given pane
		*/

		_tabForPane: function( pane ) {
			var id = pane.attr('data-pane');
			return this._dom.tabs.filter('[data-tab="'+id+'"]');
		},

		/**
		* Get the pane for a given tab.
		* @param tab The tab to find the pane for
		* @return The pane matching the given tab
		*/

		_paneForTab: function( tab ) {
			var id = tab.attr('data-tab');
			return this._dom.panes.filter('[data-pane="'+id+'"]');
		},

		/**
		* The version number of this widget
		* @var string
		*/

		_version: '1.0'

	};

	/**
	* The tabs function.
	* Works with a jQuery object array.
	* @var function
	*/

	$.fn.tabs = function() {
		// Create widgets for each element
		var l = this.length;
		for( var i=0; i<l; i++ ) {
			var obj = $(this[i]);
			// Use the existing widget
			var widget = obj.data('JSMTabs');
			if( typeof widget === 'object' && typeof arguments[0] === 'string' && arguments[0].substr(0,1) !== '_' ) {
				var method = arguments[0];
				var args = Array.prototype.slice.call( arguments, 1 );
				return JSMTabs.prototype[method].apply( widget, args );
			}
			// Set up the widget
			widget = new JSMTabs( obj, arguments[0] );
			// Keep the widget safe
			obj.data('JSMTabs',widget);
		}
		// Return the container for chaining
		return this;
	};

	/**
	* The tabs function.
	* Works with a jQuery object array.
	* @var function
	*/

	$.tabs = function( groupingAttr ) {
		// Auto-initialising
		var initTabGroups = function( groupingAttr ) {
			// Get all the panes
			var allPanes = $('['+groupingAttr+']');
			// If we don't have any, return
			if( allPanes.length <= 0 ) {
				return;
			}
			// Find all the group names
			var groups = {};
			for( var i=0; i<allPanes.length; i++ ) {
				var name, panes;
				// Fetch the group's name
				if( ! ( name = $(allPanes[i]).attr(groupingAttr) ) ) {
					continue;
				}
				// Fetch the group's panes
				if( ! ( panes = allPanes.filter('['+groupingAttr+'="'+name+'"]') ) ) {
					continue;
				}
				// Filter out the matched panes, so we don't do this over again
				allPanes = allPanes.not( panes );
				// Insert a marker at the position of the first pane
				var marker = jQuery('<span></span>').insertBefore(panes.first());
				// Remove the panes
				panes.remove();
				// Create the tab group
				var group = $('<div/>').tabs().attr('id','ui-tabs-'+name);
				// Iterate through and add the panes
				var l = panes.length;
				for( var x=0; x<l; x++ ) {
					var pane = $(panes[x]);
					var title = pane.find('h1,h2,h3,h4,h5').first().addClass('ui-tab-title').text();
					var tab = group.tabs( 'add', pane.html(), title );
					// Display this tab
					if( pane.hasClass('selected') ) {
						group.tabs( 'select', tab );
					}
				}
				// Write to the DOM
				group.insertBefore(marker);
				// Remove the marker
				marker.remove();
			}
		};
		// Initialise when an ajax call is completed
		$(document).ajaxSuccess(function( e, xhr, settings ) {
			for( var i in settings.dataTypes ) {
				if( settings.dataTypes[i] === 'html' ) {
					initTabGroups( groupingAttr );
					return;
				}
			}
		});
		// Initialise now
		initTabGroups( groupingAttr );
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