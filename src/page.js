// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var CIPA = 6667;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "title"){
		var title= $('title');
		title = title.text();
		sendResponse({title: title});
	}
	
  });