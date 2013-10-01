#jQuery Tabs

Tabs is a jQuery plugin that groups specially marked elements together as a tab group.

##Requirements

* [jQuery](http://jquery.com)

##Installation

Copy the Tabs file (either the uncompressed or the minified one) to your resources directory and then simply link to the file in your HTML document.

```html
<script src="jquery-tabs.js" type="text/javascript"></script>
```

To get up and running quickly, you can set Tabs to automatically match all elements within the document with the "data-tab-group" attribute set by adding "?auto" to the end of the `script` element's `src` attribute.

```html
<script src="jquery-tabs.js?auto" type="text/javascript"></script>
```

##Using Tabs

To run Tabs, simply run the function, providing the name of an attribute as a parameter:

```javascript
$.tabs( 'data-tab-group' );
```

Elements with the same value will be grouped together as part of a tab group. See the `example.html` file for an example of how it works.

##Released under the BSD License

Copyright © 2012-2013 Daniel Farrelly

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

*	Redistributions of source code must retain the above copyright notice, this list
	of conditions and the following disclaimer.
*	Redistributions in binary form must reproduce the above copyright notice, this
	list of conditions and the following disclaimer in the documentation and/or
	other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.