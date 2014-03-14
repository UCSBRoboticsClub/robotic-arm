/* 3/8/2014 11:59:21 AM, 129*/
if (this.ProdPageWebPart) {
	// class already exists
} else {

this.ProdPageWebPart = new function () {

    var SPEC_SRCH_CNTNR_NM = "SpecSrch_Cntnr";
    var SPEC_SRCH_INNER_CNTNR_NM = "SpecSrch_Inner";
    var SPEC_SRCH_TOGGLE_CNTNR_NM = "SpecSrch_Toggle";
    var PROD_PAGE_CONTENT_CNTNR_NM = "ProdPageContent";
    var MAIN_CONTENT_NM = "MainContent";
    var MAIN_CONTENT_PROD_PAGE_LOADED = "ShellLayout_MainContent_ProdPage_Loaded";
    var ABBR_PREFIX_NM = "Abbr_";
    var ABBR_PRSNTTN_HIGHLIGHTED_CLS = "AbbrPrsnttn_PrsnttnNm_Highlighted";
    var ABBR_PRSNTTN_CTRL_GRP_CLS = "AbbrPrsnttn_PrsnttnNm_CtrlGrp";
    var PART_NBR_HIGHLIGHTED_CLS = "PartNbrOrdrdLnk";
    var HIGHLIGHTING_CTRL_GRP_CLS = "PartNbrOrdrdLnk_CtrlGrp";
    var ATTR_VAL_HIGHLIGHTED_CLS = "SpecChoiceOrdrdLnk";
	var CLS_NM = "ProdPageWebPart";

    var mSpecSrchWdthExpanded = null;
    var mSpecSrchWdthCollapsed = null;

	var mNbrSlctns = 0; // The number of user selections we've observed since this web part has been loaded.
	
    // change to this.WebPart_AssocFilesLoad
    this.WebPart_AssocFilesLoad = function (webPartObj) {

        var specSrchSuppressInd = true,
		dynPageObj = null;
		
        // Manipulate HTML in a DOM fragment
        var fragDiv = document.createElement("div");
        fragDiv.innerHTML = webPartObj.MarkupTxt;
		
		// check so if any presentations or part numbers need to be highlighted.
		// do this for the visitor, then the location
        highlightRelevantPrsnttnMarkup(fragDiv, true);
		highlightRelevantPrsnttnMarkup(fragDiv, false);

        // clear out existing stuff
        Cmn.GetObj(webPartObj.CntnrIDTxt).innerHTML = "";

        // append to DOM
        Cmn.GetObj(webPartObj.CntnrIDTxt).appendChild(fragDiv);

        if (webPartObj && webPartObj.LoadChldWebPartsInd) {

            for (var chldIdx = 0; chldIdx < webPartObj.ChldWebParts.length; chldIdx++) {
                if (webPartObj.ChldWebParts[chldIdx].CntnrIDTxt === SPEC_SRCH_INNER_CNTNR_NM) {
                    specSrchSuppressInd = false;
					
					// A good moment to save off a snapshot of group usr inps on initial load of spec search. 
					// If any such grpUsrInps exist, we want to hold them and not roll them back with spec search "Clear all."
					// If there is no grpUsrInp in scope anymore (navigate to another page), allow this code to clear out the session.
					var grpUsrInp = GrpUsrInp.Get();
					if (grpUsrInp) {
						var mGrpUsrInps = grpUsrInp.mGrpUsrInps;
						McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.GrpUsrInpsWhenSpecSrchLoads.KyTxt(), mGrpUsrInps);		
					}
					
					//HACK: if there are no specs selected except a group user input that matches the snapshot group user input, hide the clear all link
					//This hides the link on initial load. The link is hidden when we get back to just the snapshot grp
					var specSrchInp = SpecSrchInp.Get();
					var prsnttnUsrInp = PrsnttnUsrInp.Get();
					var imgUsrInp = ImgUsrInp.Get();
					var currGrpUsrInp = GrpUsrInp.Get();
					if (specSrchInp.GetSelectionCnt() == 0 && prsnttnUsrInp.GetSelectionCnt() == 0 && imgUsrInp.GetSelectionCnt() == 0 && currGrpUsrInp.GetSelectionCnt() == 1) {
						var clearAll = Cmn.GetElementsByClsNm("SpecSrch_ClearAllLnk", "div", fragDiv);														
						if (clearAll) {
							Cmn.SetStyle(clearAll[0], "display", "none");
						}						
					}

                    break;
                };
            };
        };

        //initialize SpecsSrchSuppressInd
        McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.SpecsSrchSuppressInd.KyTxt(), specSrchSuppressInd);

		this.PostWebPartLoad();
		
		var specSrchSuppressInd = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.SpecsSrchSuppressInd.KyTxt());
        SecondaryContentCoordinator.ContentReady("prodpage", specSrchSuppressInd);			
		
        // create and publish a web part loaded message
        var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.PROD_PAGE);
        var msg = new McMaster.MsgMgrMsgs.WebPartLoaded(msgHdr,
                                                 webPartObj.CntnrIDTxt);
        McMaster.MsgMgr.PubMsg(msg);



    };

	this.PostWebPartLoad = function() {
        resizeContentContainers();

        McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.MainContentCntnrResized, resizeContentContainers, McMaster.MsgMgr.PRIORITY.HIGH);
        McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.ChooseSpecsStatChg, resizeContentContainers, McMaster.MsgMgr.PRIORITY.HIGH);
		McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.ProdInfoSlctd, trkSpecSrchOrContentRelevance, McMaster.MsgMgr.PRIORITY.HIGH);
		
	};

    //---------------------------------------------------------------------
    // Summary: Publishes a message indicating that all child webparts
    //			have been loaded
    // Remarks: Will be called once the webpart is finished loading
    // Input: The web part that's done loading.
    //---------------------------------------------------------------------
    this.WebPart_LoadCmpl = function (webPartObj) {
        var trkEvnt;
        //Performance Tracking
		var top = McMasterCom.Nav.GetTopFrame();
        trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.ProdPageLoadCmplBgn, top.PerfTracker.PgCntxtNms.DynCntnt);

        SecondaryContentCoordinator.ContentLoadCmplt("prodpage");

        // update session
        McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.ProdPageReloadingInd.KyTxt(), false);

        //set indicator to let us know that we have specs. We will use this later on to determine whether to
        //show the spec search pane when de-selecting a filtered image.
        if (McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.ChooseSpecsStat.KyTxt()) == "EXPANDED") {
            McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.HasSpecSrchInd.KyTxt(), true);
            McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.SrchRsltIdForSpecSrch.KyTxt(),
	        						  McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.DynamicPageSrchRsltId.KyTxt()));
        } else {
            McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.HasSpecSrchInd.KyTxt(), false);
            McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.SrchRsltIdForSpecSrch.KyTxt(), null);
        }

        //Set the tracking event and spec search complete indicator, and then track the transaction
		var top = McMasterCom.Nav.GetTopFrame();
        trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.ProdPageLoadCmplEnd, top.PerfTracker.PgCntxtNms.DynCntnt);

    };

    // takes care of anything that needs to be done before markup is destroyed
    this.WebPart_PreUnload = function (webPartObj) {
        //Hide the specification search frame
        //Abort any stale AJAX requests
        SpecSrchWebPartLoader.AbortStaleReq();

        SpecSrchWebPart.SpecInfo.Unload();

        SpecSrchWebPartLoader.Hide();
        // HACK: CLEARS LISTENERS FROM SPEC SEARCH CONTAINER

        // when other pages load to replace product page they also subscribe to some ..._slctd message with high priority,
        // because of this unload container might happen before SSWPLoader.UnloadWebPart or PPWPLoader.UnloadWebPart is reached.

        // Also, children web parts unload before parent.
        // Also, spec search has special logic not to reatach its event listeners every time it loads (performance hack)
        // Because of all above, we need to do take care of some stuff before spec search mark up is destroyed in unload container.

        var cntnr = Cmn.GetObj(SPEC_SRCH_INNER_CNTNR_NM);
        Cmn.RemEvntListeners(cntnr, "click");
        Cmn.RemEvntListeners(cntnr, "mouseover");
        Cmn.RemEvntListeners(cntnr, "mouseout");
        Cmn.RemEvntListeners(cntnr, "select");
        Cmn.RemEvntListeners(cntnr, "selectstart");
        Cmn.RemEvntListeners(cntnr, "keyup");
        Cmn.RemEvntListeners(document, "click");

        //unload pinned content
        this.PinnedCollUnload();

        //unload local variable in full presentation web part
        McMasterCom.Nav.GetTopFrame().FullPrsnttnWebPart.ClearPrsnttnIdSeenCntVar();
    };

    // -------------------------------------------------
    // Summary: Performs cleanup when the web part is unloaded.
    //
    // Inputs:
    //	webPartObj - the web part object
    // --------------------------------------------------		
    this.WebPart_Unload = function (webPartObj) {

        McMaster.MsgMgr.RemSubscriber(McMaster.MsgMgrMsgs.MainContentCntnrResized, resizeContentContainers);
        McMaster.MsgMgr.RemSubscriber(McMaster.MsgMgrMsgs.ChooseSpecsStatChg, resizeContentContainers);
		McMaster.MsgMgr.RemSubscriber(McMaster.MsgMgrMsgs.ProdInfoSlctd, trkSpecSrchOrContentRelevance);
		mNbrSlctns = 0; // Reset counter of user selections.

        McMaster.SesnMgr.RemStVal(McMaster.SesnMgr.StValDefs.SpecsSrchSuppressInd.KyTxt());

        // Padding on mainContent is overridden when product page is loaded.
        var mainContentElem = Cmn.GetObj(MAIN_CONTENT_NM);
        if (Cmn.HasCls(mainContentElem, MAIN_CONTENT_PROD_PAGE_LOADED)) {
            Cmn.RemCls(mainContentElem, MAIN_CONTENT_PROD_PAGE_LOADED);
        }

        // publish product page unloaded message
        if (McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.ProdPageReloadingInd.KyTxt()) == false) {

            //publish a message to indicate that it is moving away from dynamic content
            // This is not just a reload of the Dynamic page
            var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.PROD_PAGE);
            var msg = new McMaster.MsgMgrMsgs.ProdPageUnloaded(msgHdr);
            McMaster.MsgMgr.PubMsg(msg);

        }

        // create and publish a web part unloaded message
        var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.PROD_PAGE);
        var msg = new McMaster.MsgMgrMsgs.WebPartUnloaded(msgHdr,
                                                              webPartObj.CntnrIDTxt);
        McMaster.MsgMgr.PubMsg(msg);

    };


    //---------------------------------------------------------------------
    // Summary: Unload pinned contents
    //---------------------------------------------------------------------
    this.PinnedCollUnload = function () {
        //load sticky presentations	
        McMasterCom.Nav.GetTopFrame().PinnedPrsnttns.Unload();
    };

    //---------------------------------------------------------------------
    // Summary: Expand and collapse choose specs
    //---------------------------------------------------------------------
    this.ExpandCollapseSpecSrch = function () {

        var specSrchObj = Cmn.GetObj(SPEC_SRCH_INNER_CNTNR_NM);
        var specSrchStat;

        //ANALYTICS
        var d = new Date();
        var hour = d.getHours() + 1;
        var min = d.getMinutes();
        var sec = d.getSeconds();
        var mTimeOfAction = '' + hour + min + sec;

        if (specSrchObj.style.display == 'none') {
            specSrchObj.style.display = '';
            specSrchStat = 'EXPANDED';
            if (Cmn.DetectBrowser() == "IE 6.0") {
                var specSrchCntnr = Cmn.GetObj(SPEC_SRCH_CNTNR_NM);
                specSrchCntnr.style.width = 214 + "px";
            }
        }
        else {
            specSrchObj.style.display = 'none';
            specSrchStat = 'COLLAPSED';
            if (Cmn.DetectBrowser() == "IE 6.0") {
                var specSrchCntnr = Cmn.GetObj(SPEC_SRCH_CNTNR_NM);
                specSrchCntnr.style.width = 10 + "px";
            }
        }

        //update choose spec state and publish message
        McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.ChooseSpecsStat.KyTxt(), specSrchStat);

        // Publish the MainContent Container Resized message
        var hdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.PROD_PAGE);
        var msg = new McMaster.MsgMgrMsgs.MainContentCntnrResized(hdr);
        McMaster.MsgMgr.PubMsg(msg);

        var specSrchStatMsg = new McMaster.MsgMgrMsgs.ChooseSpecsStatChg(new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.CHOOSE_SPECS), specSrchStat);
        McMaster.MsgMgr.PubMsg(specSrchStatMsg);
    };

    // Determine the width of the Choose Specs container. Remember the value so we minimize DOM traversal.
    this.GetSpecSrchWdth = function () {
        var rtnSpecSrchWdth = 0;
        var SPEC_SRCH_MARGIN = 10;

        // Check choose specs container status
        var specSrchStat = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.ChooseSpecsStat.KyTxt());

        switch (specSrchStat) {
            case null:
            case "HIDDEN":
                rtnSpecSrchWdth = 0;
                break;

            case "COLLAPSED":
                if (mSpecSrchWdthCollapsed == null) {
                    var specSrchElem = Cmn.GetObj(SPEC_SRCH_CNTNR_NM);
                    mSpecSrchWdthCollapsed = Cmn.GetWidth(specSrchElem)
                                        + SPEC_SRCH_MARGIN;
                }
                rtnSpecSrchWdth = mSpecSrchWdthCollapsed;
                break;

            case "EXPANDED":

                mSpecSrchWdthExpanded = 210;
                rtnSpecSrchWdth = mSpecSrchWdthExpanded;
                break;
        }

        return rtnSpecSrchWdth;
    };
	
	// ----------------------------------------------------------------
	// Summary: Track the first click a user makes when presented with
	//			spec search and content. We track what the user clicked
	//			on, visual position of the selection on the page, and
	//			whether that selection was visible when the page loaded.
	// ----------------------------------------------------------------
	var trkSpecSrchOrContentRelevance = function(msgObj) {
	
		if (mNbrSlctns > 0) {
			// Do nothing.
			// We only track the first selection from either spec search or content.
		} else {
			// Track in webreports.
			var trkObj = {};
			trkObj.SlctnCntxt = msgObj.MsgPayload().SlctnCntxt;
			trkObj.SlctnNmTxt = msgObj.MsgPayload().SlctnNmTxt;
			trkObj.SlctnPosNbr = msgObj.MsgPayload().SlctnPosNbr;
			trkObj.SlctnAbvFoldInd = msgObj.MsgPayload().SlctnAbvFoldInd;
			Cmn.TrkAct(trkObj, CLS_NM);
		}
		
		mNbrSlctns = mNbrSlctns + 1;
		
	};

    // -------------------------------------------------------------
    // Summary: Method to resize prod page containers when
    //		when the window is resized by the user or specsearch status changes.
    //      called in response to maincontent resizing.    
    // -------------------------------------------------------------			
    var resizeContentContainers = function () {

        var SPEC_SRCH_HEIGHT_OFFSET = 2;

        // Set the height of the content container
        // Safari requires the appended "px"
        var mainContentPxHeight = Shell.GetMainContentHeight();


        Cmn.SetStyle(SPEC_SRCH_INNER_CNTNR_NM, "height", (mainContentPxHeight - SPEC_SRCH_HEIGHT_OFFSET) + "px");
        Cmn.SetStyle(SPEC_SRCH_TOGGLE_CNTNR_NM, "height", (mainContentPxHeight - SPEC_SRCH_HEIGHT_OFFSET) + "px");
        Cmn.SetStyle(PROD_PAGE_CONTENT_CNTNR_NM, "height", mainContentPxHeight + "px");



        // Set the width of the Product Page Content
        //set product page width.
        // there is an extra 2 px added, to be compatible to maincontent.
        // Why maincontent has extra 2 px added to padding manually? Solves some bug?

        // Determine the width of the Spec Search container
        var chooseSpecsWdth = ProdPageWebPart.GetSpecSrchWdth();
        var mainContentPxWidth = Shell.GetMainContentWidth();
        var prodPageContentWdth = mainContentPxWidth - chooseSpecsWdth
                     - parseInt(Cmn.GetStyle(PROD_PAGE_CONTENT_CNTNR_NM, "padding-right"))
                     - parseInt(Cmn.GetStyle(PROD_PAGE_CONTENT_CNTNR_NM, "padding-left")) - 2;

        Cmn.SetStyle(PROD_PAGE_CONTENT_CNTNR_NM, "width", prodPageContentWdth + "px");

    };
    this.ResizeContentCntnrs = resizeContentContainers;
    // -------------------------------------------------------------------------------
    // Summary: Method to highlight abbreviated presentations 
    //          and part numbers from which customers have 
    //          purchased in the past.
    // Note: The flow for highlighting abbreviated presentations is as follows:
    //       (Assuming there are abbreviated presentations on the page)
    //       1). We have ordered something from a particular presentation in the past.
    //       2). Determine if the ordered part numbers for a particular presentation
    //           also have been tied to a previously ordered "search result id". The
    //           reason for this is because we filter part numbers that ultimately 
    //           displayed on the page. So the logic goes, if we are not displaying any
    //           purple part number links under the displayed presentation, then don't
    //           make the presentation purple.
    // -------------------------------------------------------------------------------	
    var highlightRelevantPrsnttnMarkup = function (rootElem, vstrPrtInd) {

        var len = 0
		   , lenOfArray = 0
		   , srchIDPartsObj = {}
		   , srchIDPartNbrArray = []
		   , prsnttnsToHighlight = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainPrsnttnIdsToHighlight.KyTxt())
		   , orderedSpecIdVals = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainSpecIdValsToParts.KyTxt());
		
		//set prtNbrsToHighlight as either visitor or location part numbers
		if (vstrPrtInd){
			var prtNbrsToHighlight = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainPrtNbrsToHighlight.KyTxt())
		}else{
			var prtNbrsToHighlight = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainLocPrtNbrsToHighlight.KyTxt())
		}

        // check for abbreviated presentations to highlight
        if (Cmn.IsEmpty(prsnttnsToHighlight) == false) {
            var abbr_prefix_nm_lngth = parseInt(ABBR_PREFIX_NM.length);
            var prsnttnElemsOnPage = Cmn.GetElementsByClsNm("AbbrPrsnttn", "div", rootElem);
            len = prsnttnElemsOnPage.length; // performance boost by saving off the length
            if (prsnttnElemsOnPage && len > 0) {
                var srchResultIdsAndPartNbrs = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainSearchIdsToParts.KyTxt());
                var srchRsltID = getSrchId();
                if (Cmn.IsEmpty(srchResultIdsAndPartNbrs) == false &&
 				    srchRsltID != undefined && srchRsltID > 0 &&
					srchResultIdsAndPartNbrs[srchRsltID]) {
                    srchIDPartNbrArray = srchResultIdsAndPartNbrs[srchRsltID].split("|");
                    lenOfArray = srchIDPartNbrArray.length;
                    // Load up our search result ID's to part number array
                    for (var i = 0; i < lenOfArray; i++) {
                        srchIDPartsObj[srchIDPartNbrArray[i]] = '0';
                    }
                    for (var i = 0; i < len; i++) {
                        // Remove the text characters from the ID in order to use just the numeric portion.
                        var currPrsnttnId = prsnttnElemsOnPage[i].id.substring(abbr_prefix_nm_lngth);
                        if (prsnttnsToHighlight[currPrsnttnId]) {
                            // Double check to ensure we have ordered any displayed part numbers under the current presentation
                            // for a given search result. Just b/c we ordered from a given presentation before does not mean
                            // we want to highlight it. Only if there are purple part nbrs under it.
                            var highlightItInd = false;
                            var prsnttnIDPartNbrArray = prsnttnsToHighlight[currPrsnttnId].split("|");
                            lenOfArray = prsnttnIDPartNbrArray.length;
                            for (var ii = 0; ii < lenOfArray; ii++) {
                                if (srchIDPartsObj[prsnttnIDPartNbrArray[ii]]) {
                                    highlightItInd = true;
                                }
                            }
                            if (highlightItInd) {
                                Cmn.AddCls(prsnttnElemsOnPage[i], ABBR_PRSNTTN_HIGHLIGHTED_CLS);
                            }
                        }
                    }
                }
            }
        }

        // Check for part numbers to highlight
        if (Cmn.IsEmpty(prtNbrsToHighlight) == false) {
            var prtNbrElemsOnPage = Cmn.GetElementsByClsNm("PartNbrLnk", "a", rootElem);
            len = prtNbrElemsOnPage.length; // performance boost by saving off the length
            if (prtNbrElemsOnPage && len > 0) {
                for (var i = 0; i < len; i++) {
                    var currPrtNbr = prtNbrElemsOnPage[i].getAttribute("data-mcm-partnbr");
                    if (currPrtNbr.length > 0 && prtNbrsToHighlight[currPrtNbr]) {
                        //set hover text according to whether we are looking at visitor or location part number
						if (vstrPrtInd){
							prtNbrElemsOnPage[i].setAttribute('title', 'You ordered this product previously.');
						}else{
							if (Cmn.HasCls(prtNbrElemsOnPage[i], PART_NBR_HIGHLIGHTED_CLS)){
								//Part was bought by the visitor; do nothing
							}else{
								prtNbrElemsOnPage[i].setAttribute('title', 'Your company ordered this product previously.');
							}
						}
						Cmn.AddCls(prtNbrElemsOnPage[i], PART_NBR_HIGHLIGHTED_CLS);
                    }
                }
            }
        }

        // Check for attribute value links to highlight for ordered part numbers 
        if (Cmn.IsEmpty(orderedSpecIdVals) == false) {

			// Ensure compatibility of code below with IE<9 browsers, support Array.indexOf
			if (!('indexOf' in Array.prototype)) {
				Array.prototype.indexOf= function(find, i /*opt*/) {
					if (i===undefined) i= 0;
					if (i<0) i+= this.length;
					if (i<0) i= 0;
					for (var n= this.length; i<n; i++)
					if (i in this && this[i]===find)
						return i;
					return -1;
				}
			};

			var specChoiceLnksOnPage = Cmn.GetElementsByClsNm("SpecChoiceLnk", "a", rootElem);
            var len = specChoiceLnksOnPage.length; // performance boost by saving this off	
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var partNbrMatchInd = false;
                    var relatedPartNbr = FullPrsnttnWebPart.getClickablePartNbrCell(Cmn.GetAncestorByTagNm(specChoiceLnksOnPage[i], "td"));
                    if (relatedPartNbr != null) {
                        var currPartNbr = relatedPartNbr.getAttribute("data-mcm-partnbr");
                        var attrCompIdsTxt = relatedPartNbr.getAttribute("data-mcm-attr-comp-itm-ids");
                        if (attrCompIdsTxt) {
                            var attrCompIdList = attrCompIdsTxt.split(",");
                        }
                        if (currPartNbr && prtNbrsToHighlight[currPartNbr]) {
                            var currSpecProdId = specChoiceLnksOnPage[i].getAttribute("data-mcm-prod-attr-id");
                            var currSpecProdValId = specChoiceLnksOnPage[i].getAttribute("data-mcm-prod-attrval-id");
                            var prodValIdPair = currSpecProdId + ";" + currSpecProdValId;
                            if (orderedSpecIdVals[prodValIdPair]) {
                                var specPartNbrArray = orderedSpecIdVals[prodValIdPair].split("|");
                                for (var j = 0; j < specPartNbrArray.length; j++) {
                                    if (specPartNbrArray[j] === currPartNbr ||
									(attrCompIdList &&
									 attrCompIdList.indexOf(prtNbrsToHighlight[specPartNbrArray[j]]) >= 0)) {
                                        partNbrMatchInd = true;
                                        break;
                                    }
                                }
                                if (partNbrMatchInd) {
                                    Cmn.AddCls(specChoiceLnksOnPage[i], ATTR_VAL_HIGHLIGHTED_CLS);
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    // -------------------------------------------------------------
    // Returns the search result ID.
    // Remarks: The SlctdSrchRsltId might be null, i.e. if the customer
    // 			has selected a part number causing the search result 
    //			web part to unload.  Accordingly, we check both that
    //			session value and the DynamicPageSrchRsltId, which is
    //			initialized by the DynamicContentCoordinator.
    // -------------------------------------------------------------
    var getSrchId = function () {
        return McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.SlctdSrchRsltId.KyTxt())
			|| McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.DynamicPageSrchRsltId.KyTxt());
    };

    // --------------------------------------------------
    // Summary: Gets the name of the abbreviated presentation
    //			to track.
    // Inputs: An HTML node
    // --------------------------------------------------
    // var getAbbrPrsnttnTrackingTxt = function (node){
    // var prsnttnHdrElems = Cmn.GetElementsByClsNm("AbbrPrsnttn_PrsnttnNm", "h3", node );
    // if (prsnttnHdrElems.length > 0 ){
    // var trackingTxt = Cmn.GetTxtContent(prsnttnHdrElems[0]);
    // }
    // return trackingTxt;
    // }
}             // end definition of ProdPageWebPart

} // end check for ProdPageWebPart

if (this.SpecInteractions){
} else {

SpecInteractions = new function () {

    // Global variable as to whether the cursor is currently a pointer (hand)
    var mCursorIsPointerInd = false;

    // A message header for messages published within the context of specifications
    var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.SPEC);

    // Provide a reference to this object
    var me = this;

    // An attribute id to attribute name lookup object
    var mAttrNmLookupObj = new CmnColls.HashTable();

    // The dropdown menu that's currently open
    var mOpenDropDownMenu = null;

    // Contextual search timeout object
    var mContextualSrchTimeout = null;
    var mLnSeqRegex = new RegExp(/^OrdPadProdsWebPart_LnSeq[0-9]+$/);
    var mNbrRegex = new RegExp(/\d+/);
    // time, in ms, to wait to respond to a [backspace] press in contextual search
    var CONTEXTUAL_SRCH_KEYSTROKE_BACKSPACE_TIMEOUT_MS_NBR = 250;

    // time, in ms, to wait to respond to a keystroke in contextual search
    var CONTEXTUAL_SRCH_KEYSTROKE_DEFLT_TIMEOUT_MS_NBR = 150;

    // Indicator of whether event listeners have been attached to the Spec Search pane in the Shell
    var mEvntsAttachedInd = false;

    var MAIN_CONTENT_CNTNR_NM = "MainContent";
    //ANALYTICS
    this.mTrkAct = null;
    this.mTrkAttr = null;
    this.mTrkVal = null;
    this.mTrkTrip = false;

    //class names
    var SPEC_SRCH_ATTR_CLS_NM = "SpecSrch_Attribute";
    var LANDING_PG_ATTR_CLS_NM = "LandingPage_ValPrsnttn"; 
    
    //Tracking actions
    var ACT = {
        CLICK_VLD: 'Selected spec',
        CLICK_SLCTD: 'Deselected spec',
        EXPAND_ATTRGRP: 'Expanded',
        CLEAR_ALL: 'Cleared all selected specs'
    };
	
	//Context Names
	var CNTXT = {
		LANDING_PAGE: 'LandingPage',
		CHOOSE_SPECS: 'ChooseSpecs',
		IN_LN_ORD: 'InLnOrd'
	};


    var VAL_SPEC_PAR_ELEM_ID_CD = {
        CAPTION: 'T',
        IMG: 'I'
    };
	
	//Sized input box constants
	var ZERO_WIDTH_SPACE = String.fromCharCode(parseInt(0x200B))
	  , UNICODE_CARRIAGE_RETURN = 13
	  , UNICODE_LINE_FEED = 10
	  , UNICODE_BACKSPACE = 8
	  , UNICODE_DELETE = 46
	  , UNICODE_CHARS_GRP1_STRT = 32
	  , UNICODE_CHARS_GRP1_END = 126
	  , UNICODE_CHARS_GRP2_STRT = 160
	  , UNICODE_CHARS_GRP2_END = 65535
	  , LEFT_ARROW_KEYCODE = 37
	  , RIGHT_ARROW_KEYCODE = 39;

    //Session State shortcuts
    var GetStVal = McMaster.SesnMgr.GetStVal;
    var StValDefs = McMaster.SesnMgr.StValDefs;

    //---------------------------------------------------------------------
    // Summary: Attaches event listeners
    // Input: webPartOjb - The web part object from the server that's 
    //           done loading.
    //        cntxtNm - The context in which the interaction occurred.
    //           This is used for web reports tracking.
    //        webPartLoader (optional) - The web part's loader. We use some 
    //           of its methods, such as for determining how to handle  
    //           requests that are already in flight. 
    //        maintainScrollPosnInd - Denotes whether we need to keep
    //           the selected value in the same position when the page
    //           gets re-loaded.
    //---------------------------------------------------------------------
    this.AttachEvntListeners = function (webPartObj, cntxtNm, webPartLoader, maintainScrollPosnInd, inLnCntnr) {

		if (inLnCntnr) {
			cntnr = inLnCntnr;
		} else {
			cntnr = Cmn.GetObj(webPartObj.CntnrIDTxt);
        }
		
        if (cntnr){
            //found
        }else{
            if (McMasterCom.Nav.GetTopFrame().MainIFrame){
                if (McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog){
                    cntnr = McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog.Cmn.GetObj(webPartObj.CntnrIDTxt);
                }
            }
        }

        Cmn.AddEvntListener(cntnr, "click", function (evnt) {
            me.HndlClickEvnt(evnt, cntxtNm, webPartLoader, maintainScrollPosnInd);
        });

        Cmn.AddEvntListener(cntnr, "keyup", function (evnt) {
            me.HndlCntxtSrch(evnt, cntxtNm, webPartLoader);
        });

        Cmn.AddEvntListener(cntnr, "mouseover", function (evnt) {
            hndlMouseOvrEvnt(evnt, cntxtNm, webPartLoader, cntnr);
        });

        Cmn.AddEvntListener(cntnr, "mouseout", function (evnt) {
            hndlMouseOutEvnt(evnt, cntxtNm, webPartLoader, cntnr);
        });

        Cmn.AddEvntListener(cntnr, "select", me.HndlSelectEvnt);
        Cmn.AddEvntListener(cntnr, "selectstart", me.HndlSelectEvnt);
		
		this.AttachDocEvntListeners();
    };
	
	this.AttachDocEvntListeners = function () {
        Cmn.AddEvntListener(document, "click", SpecSrchWebPart.SpecInfo.ClickHandler);
    };

    //---------------------------------------------------------------------
    // Summary: Removes event listenters
    // Input: The web part that's been unloaded.
    //---------------------------------------------------------------------
    this.RemoveEvntListeners = function (webPartObj) {

        var cntnr = Cmn.GetObj(webPartObj.CntnrIDTxt);
        if (cntnr){
            //found
        }else{
            if (McMasterCom.Nav.GetTopFrame().MainIFrame){
                if (McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog){
                    cntnr = McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog.Cmn.GetObj(webPartObj.CntnrIDTxt);
                }
            }
        }
        
        Cmn.RemEvntListeners(cntnr, "click");
        Cmn.RemEvntListeners(cntnr, "keyup");
        Cmn.RemEvntListeners(cntnr, "mouseover");
        Cmn.RemEvntListeners(cntnr, "mouseout");
        Cmn.RemEvntListeners(cntnr, "select");
        Cmn.RemEvntListeners(cntnr, "selectstart");
		
		this.RemoveDocEvntListeners();
	};
	
	this.RemoveDocEvntListeners = function () {
        Cmn.RemEvntListeners(document, "click");
    };

    //---------------------------------------------------------------------
    // Summary: Adds attribute id to attribute name definitions to the
    //          global dictionary.
    // Input: The web part that's been loaded.
    //---------------------------------------------------------------------
    this.AddAttrIdToNmDefs = function (webPartObj) {

        var attrIdToNmDefs = webPartObj.AttrIdToNmDict;
        var attrIds = Cmn.Utilities.Keys(attrIdToNmDefs);

        Cmn.forEach(attrIds, function (attrId) {
            mAttrNmLookupObj.Add(attrId, attrIdToNmDefs[attrId]);
        });
    };

    //------------------------------------------------------------
    // <summary>
    // Creates the tracking request for webreports.
    // </summary>
    //------------------------------------------------------------
    this.Webreports_TrkAct = function (cntxtNm, act, attr, val, trip, prodAttrId, prodValId, inpElem) {

        var loadFrmSesnInd = GetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt());

        //Subsequent clicks on landing pages do not trigger a 204. It's because the 
        //loadFrmSesnInd is true. 
        if (cntxtNm.toUpperCase() == "LANDINGPAGE") {
            loadFrmSesnInd=false;
        }
        
        if (loadFrmSesnInd) {
            //don't track a session change
        } else if (trip) {
            //track with round trip duration so update
            //global tracking variables to hold it
            this.mTrkTrip = true;
            this.mTrkAct = act;
            this.mTrkAttr = (attr) ? attr : null;
            this.mTrkVal = (val) ? val : null;

        } else {
            //track the action performed.
            var actDscObj = {};
            actDscObj.Action = act;
            actDscObj.SrchTxt = GetStVal(StValDefs.SlctdSrchRsltTxt.KyTxt());
            if (attr) { actDscObj.Attribute = attr; }
            if (val) { actDscObj.Value = val; }
            Cmn.TrkAct(actDscObj, cntxtNm);

            // TrkSrch
            trkSrchValSlct(act, attr, val, cntxtNm, prodAttrId, prodValId, inpElem);
        }
    };


    //---------------------------------------------------------------
    // Summary: Creates the tracking request for custom tracking 
    //          messages.
    //
    // Input:   context name, tracking action and the message you
    //          want to track.
    //---------------------------------------------------------------
    this.Webreports_TrkCustomAct = function (cntxtNm, trkAct, trkMsg) {

        var srchTxt = GetStVal(StValDefs.SlctdSrchRsltTxt.KyTxt());
        var str = "Action=" + trkAct + "&SrchTxt=" + srchTxt;
        Cmn.TrkAct(str + trkMsg, cntxtNm);
    };
    
    //------------------------------------------------------------
    // Summary: creates a webreports tracking request for
    //          contextual search events.
    //------------------------------------------------------------
    this.Webreports_TrkContextualSrch = function (cntxtNm, attrId, cntxtSrchArgTxt, usrInpVal, prodAttrId) {

        var srchTxt = GetStVal(StValDefs.SlctdSrchRsltTxt.KyTxt());
        var msg = "Contextual search in " + srchTxt + " for " + me.GetAttrNm(attrId);

        if (cntxtSrchArgTxt.length > 0) {
            msg += ": " + cntxtSrchArgTxt;
        } else {
            msg += " was cleared out";
        }

        var actDscObj = {};
        actDscObj.action = msg;
        Cmn.TrkAct(actDscObj, cntxtNm);
        
        var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.KEY });
        srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.CNTXT_SRCH_BX;
        srchTrkInfo.usr.srcNm = getSrcNmFrmCntxt(cntxtNm);
        srchTrkInfo.usr.entryTxt = decodeURIComponent(usrInpVal);
        srchTrkInfo.usr.srchCntxt = decodeURIComponent(srchTxt);
        srchTrkInfo.usr.spec = { attr: me.GetAttrNm(attrId) };
		srchTrkInfo.usr.specIDs = { attrID: prodAttrId };
        srchTrkInfo.Trk();
    };

    //------------------------------------------------------------
    // <summary>
    // Creates the tracking request for webreports that will include
    // the duration of the web part's action in addition to the 
    // usual data
    // </summary>
    //------------------------------------------------------------
    this.Webreports_TrkTrip = function (cntxtNm) {

        if (this.mTrkTrip) {
            var srchTxt = GetStVal(StValDefs.SlctdSrchRsltTxt.KyTxt());
            var url = 'Action=' + encodeURIComponent(this.mTrkAct) + '&SrchTxt=' + encodeURIComponent(srchTxt);

            if (this.mTrkAttr) {
                url = url + '&Attribute=' + encodeURIComponent(this.mTrkAttr);
            }

            if (this.mTrkVal) {
                url = url + '&Value=' + encodeURIComponent(this.mTrkVal);
            }
            Cmn.TrkAct(url, cntxtNm);
        } else {
            //do nothing
        }

        //reset global tracking variables
        this.mTrkAct = null;
        this.mTrkAttr = null;
        this.mTrkVal = null;
        this.mTrkTrip = false;
    };

    //------------------------------------------------------------
    // <summary>
    // Retrieves the attribute name.
    // </summary>
    //------------------------------------------------------------
    this.GetAttrNm = function (attrId) {
        return mAttrNmLookupObj.table[attrId];
    };

    //------------------------------------------------------------
    // <summary>
    // Retrieves the attribute id from the given element.
    // </summary>
    //------------------------------------------------------------
    this.GetAttrId = function (inpElem) {
        return getPubAttrIdFrmTxt(inpElem.id);
    };

    //------------------------------------------------------------
    // Summary: Returns the attribute containing the given value
    //------------------------------------------------------------
    this.GetAttrByInnerElem = function (inpElem) {
        return getAttrByInnerElem(inpElem,SPEC_SRCH_ATTR_CLS_NM);
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is in a dropdown menu
    //------------------------------------------------------------
    this.GetElemIsInDropDwnMenu = function (inpElem) {
        return getInpElemIsDropDwnVal(inpElem,SPEC_SRCH_ATTR_CLS_NM);
    };

    //------------------------------------------------------------
    // Summary: Returns the element that's visible for the given ID.
    // Input:   An element ID
    // Returns: The element with the given ID, or its complementary
    //          element -- whichever one is visible at the time.
    //------------------------------------------------------------          
    this.GetVisibleElemById = function (idTxt) {
        return getVisibleElemById(idTxt);
    };

    //------------------------------------------------------------
    // Summary: Returns the html element that complements the
    //          display state of the passed-in attribute container.
    // Input:   An element ID
    //------------------------------------------------------------          
    this.GetComplementaryElemById = function (idTxt) {
        return getComplementaryElemById(idTxt);
    };

	//------------------------------------------------------------
    // Summary: Returns the caption for the given image element
    //			or vice versa.
    //------------------------------------------------------------          
	this.GetComplementaryImgTxtElemById = function(inpElem) {
		 return getComplementaryImgTxtElemById(inpElem);
	};
	
    //------------------------------------------------------------
    // Summary: Handles the event "mousedown" and interprets
    //          the element id
    // Input:   The YUI event
    //          cntxtNm - context for the specification (spec search,
    //             landing page, etc). Largely used for web reports.
    //          webPartLoader (optional) - The loader for this web
    //               part. If it exists, call the method on the loader
    //               that determines whether a request is already in 
    //               flight. If so, ignore the current click event.
    //          maintainScrollPosnInd - Denotes whether we need to keep
    //               the selected value in the same position when the page
    //               gets re-loaded.
    //------------------------------------------------------------
    this.HndlClickEvnt = function (e, cntxtNm, webPartLoader, maintainScrollPosnInd) {

        if (webPartLoader && typeof webPartLoader.ReqInFlight === "function" && webPartLoader.ReqInFlight()) {
            // Don't respond to clicks when a request is in flight
        } else if (e) {
            // Check to see if the element OR one of its ancestors is clickable
            var targetElem = Cmn.GetEvntTarget(e);

            if (cntxtNm.toUpperCase() == "LANDINGPAGE") {

                if (targetElem && (targetElem.nodeName.toUpperCase() != "DIV" && targetElem.nodeName.toUpperCase() != "LI")) {

                    while (targetElem.parentNode) {
                        if (targetElem && (targetElem.nodeName.toUpperCase() != "DIV" && targetElem.nodeName.toUpperCase() != "LI")) {
                            targetElem = targetElem.parentNode;
                        } else {
                            break;
                        }
                    }
                }

            }

            var vldInpElem = getVldClickElem(targetElem) || Cmn.GetAncestorBy(targetElem, getVldClickElem);

            // If it's clickable then process the click event
            if (vldInpElem) {
                procssClckEvnt(vldInpElem, cntxtNm, maintainScrollPosnInd);

                if (SpecSrchWebPart.planningtimestamp) {
                    var now = new Date();
                    var delta = now - SpecSrchWebPart.planningtimestamp;
                    Cmn.TrkAct("FirstClick&delta=" + delta + "&type=specsrch");
                    SpecSrchWebPart.planningtimestamp = null
                }
            }

            // Check to see whether the selected element was a dropdown button
            if (vldInpElem && getInpElemIsDropDwnBtn(vldInpElem)) {
                // The dropdown button already took care of updating the dropdown menu
            } else {
                // Close any open dropdown menu
                SpecInteractions.ToggleDropDwnMenu(mOpenDropDownMenu);
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Handles text selection (highlighting) events
    // Input:   The YUI event
    //------------------------------------------------------------
    this.HndlSelectEvnt = function (e) {

        if (e) {
            // Get the element being selected
            var targetElem = Cmn.GetEvntTarget(e);
            var vldInpElem = getVldClickElem(targetElem) || Cmn.GetAncestorBy(targetElem, getVldClickElem);

            // Prevent clickable elements from accidentally being selected.
            if (vldInpElem) {
                Cmn.PreventDeflt(e);
            }
        }
    };

    //------------------------------------------------------------
    // Summary: captures and processes the input for contextual
    //          search input
    // Input:   The keystroke event unique to each input element
    //------------------------------------------------------------
    this.HndlCntxtSrch = function (e, cntxtNm, webPartLoader) {

        if (e) {
            // You can type into contextual search boxes
            var targetElem = Cmn.GetEvntTarget(e);
            var vldInpElem = getVldCntxtSrchBx(targetElem) || Cmn.GetAncestorBy(targetElem, getVldCntxtSrchBx);

            // If it's a contextual search box, then perform the contextual search
            if (vldInpElem) {
                if (cntxtNm == "InLnOrd") {
                    procssInLnCntxtSrch(vldInpElem, e.keyCode, cntxtNm, webPartLoader);
                } else if (cntxtNm == "OrdPad") {
                    procssOrdPadLnCntxtSrch(vldInpElem, e.keyCode, cntxtNm, webPartLoader);
                } else if (cntxtNm == McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN){
					procssItmPrsnttnCntxtSrch(vldInpElem, e.keyCode, cntxtNm, webPartLoader);
				}else {
                    procssCntxtSrch(vldInpElem, e.keyCode, cntxtNm, webPartLoader);
                }
            }
        }
    };

	// <summary>Wrapper for typing but not pasting.</summary>
	// <param name="box">HTML textarea to monitor.</param>
	// <param name="event">DOM Event</param>
	// <returns> void </returns>
	this.SizedInpTyping = function(box,event){
		var txt = box.value;
		var charPerLnLmt = box.getAttribute("data-mcm-cols");
		charPerLnLmt = parseInt(charPerLnLmt) ? parseInt(charPerLnLmt) : 0;
		var lnLmt = box.getAttribute("data-mcm-rows");
		lnLmt = parseInt(lnLmt) ? parseInt(lnLmt) : 0;
		var wrapInd = false;
		// get text that has been highlighted
		var sel = getSelection(box);
		
		// In keydown/keypress character hasn't been entered yet. Do so here.
		if (event.type === "keydown"){
			var key = event.keyCode;
			if (key == UNICODE_BACKSPACE || key == UNICODE_DELETE){
				txt = applyDeletion(key,sel,txt);
				wrapInd = true;
			}
		} else if (event.type === "keypress"){
			var key = getKey(event.keyCode, event.charCode, event.which);
			if (key == UNICODE_CARRIAGE_RETURN || 
				(UNICODE_CHARS_GRP1_STRT <= key && key <= UNICODE_CHARS_GRP1_END) ||
				(UNICODE_CHARS_GRP2_STRT <= key && key <= UNICODE_CHARS_GRP2_END)){
				txt = applyPrintableChar(key,sel,txt);
				wrapInd = true;
			}
		}
		
		if (wrapInd) {
			// Store the number of softbreaks before re-wrapping.
			var crsrOffset = countAllSubstr(ZERO_WIDTH_SPACE + "\n",txt,sel.start);
			// Wrap the text.
			txt = wrapAlgthm(txt,charPerLnLmt);
			// Update number of softbreaks in case cursor must move.
			crsrOffset = countAllSubstr(ZERO_WIDTH_SPACE + "\n", txt, sel.start) - crsrOffset;
			
			// Only use wrapped text if it is within line limit.
			if (verifyDimensions(txt,lnLmt)){
				box.value = txt;
				//update cursor position
				if (event.type === "keydown" && key == UNICODE_DELETE){
					setCursorPosn(box,sel.start);
				} else {
					setCursorPosn(box,sel.start+crsrOffset*2);
				}
			}
			Cmn.PreventDeflt(event);
		}
	}
	
	// <summary>Moves cursor to make soft wrapping invisible.</summary>
	// <param name="box">HTML textarea sized input box </param>
	// <returns> void </returns>
	this.SizedInpArrowKeys = function(box, event){
		var key = event.keyCode;
		var txt = box.value;
		var crsr = box.selectionEnd; // we only need the end=the moving part
		var dir = ""; //direction to shift the cursor
		
		// Helper function for moving cursor by one.
		var shiftCursorOnce = function(box,dir){
			if (dir === "left"){
				box.setSelectionRange(box.selectionStart === box.selectionEnd ? 
										box.selectionStart - 1 : box.selectionStart,
										box.selectionEnd - 1);
			} else if (dir === "right"){
				box.setSelectionRange(box.selectionStart === box.selectionEnd ? 
										box.selectionStart + 1 : box.selectionStart,
										box.selectionEnd + 1);
			}
		}
		
		if(key === LEFT_ARROW_KEYCODE){
			if (crsr >= 1 && txt[crsr] === "\n" && txt[crsr-1] === ZERO_WIDTH_SPACE){
				// if we start inside the softbreak move the cursor left
				shiftCursorOnce(box,"left");
				if (crsr > 1 && txt[crsr-2] === ZERO_WIDTH_SPACE){
					//if there's also a hidden space move the cursor left again
					shiftCursorOnce(box,"left");
				}
			}
			dir = "left";
		} else if(key === RIGHT_ARROW_KEYCODE){
			if (crsr + 1 < txt.length && txt[crsr] === ZERO_WIDTH_SPACE){
				//if we start to the left of a zero width space
				if (txt[crsr+1] === "\n"){
					//if we start to the left of a soft-wrap
					shiftCursorOnce(box,"right");
				} else if(crsr + 2 < txt.length && 
							txt[crsr+1] === ZERO_WIDTH_SPACE && txt[crsr+2] === "\n"){
					//if we start to the left of a zws + softwrap
					shiftCursorOnce(box,"right");
					shiftCursorOnce(box,"right");
				}
			}
			dir = "right";
		}
		if (crsr >= 1 && txt[crsr] === ZERO_WIDTH_SPACE && txt[crsr-1] === ZERO_WIDTH_SPACE
					&& txt.length > crsr+1 && txt[crsr+1] === "\n"){
			// if we start between a hidden space and a softbreak
			shiftCursorOnce(box,dir);
			// (key is arrowLeft or arrowRight) checked inside function
		}
	
	}
	
	// <summary>Wrapper for paste and word wrapping.</summary>
	// <param name="box">HTML textarea to monitor.</param>
	// <returns> void </returns>
	this.SizedInpPaste = function(box){
		// Capture state of the box before paste happens.
		var charPerLnLmt = box.getAttribute("data-mcm-cols");
		charPerLnLmt = parseInt(charPerLnLmt) ? parseInt(charPerLnLmt) : 0;
		var lnLmt = box.getAttribute("data-mcm-rows");
		lnLmt = parseInt(lnLmt) ? parseInt(lnLmt) : 0;
		var prevTxt = box.value;
		var prevLen = box.value.length;
		// get text that has been highlighted
		var sel = getSelection(box);
				
		// Move cursor outside of a soft break to keep it invisible to users.
		// This is not as strict as it could be, but it doens't need to be strict.
		if (sel.start > 0 && prevTxt[sel.start] === "\n" && prevTxt[sel.start-1] === ZERO_WIDTH_SPACE){
			sel.start --;
		}
		if (sel.end > 0 && prevTxt[sel.end] === "\n" && prevTxt[sel.end-1] === ZERO_WIDTH_SPACE){
			sel.end --;
		}	
		box.setSelectionRange(sel.start,sel.end);
		
		var sel = box.value.slice(sel.start,sel.end);
		// Sleep until after the paste has happened so we can read what was pasted.
		// Otherwise we'd have to look into the clipboard which is difficult.
		window.setTimeout(function(){
			var newTxt = box.value;
			var pastedTxt = newTxt.slice(sel.start, newTxt.length - (prevLen - sel.length));
			// Wrap new contents of box
			var txt = wrapAlgthm(newTxt,charPerLnLmt);
			if (verifyDimensions(txt,lnLmt)){
				box.value = txt;
				//update cursor position
				setCursorPosn(box,sel.start + pastedTxt.length);
			} else {
				box.value = prevTxt;
				setCursorPosn(box,sel.start);
			}
		});
	}
	
	//------------------------------------------------------------
    // Summary: trkSrchValSlct
    // Input:   Tracks value clicks for SrchTrkr.
    //------------------------------------------------------------
    var trkSrchValSlct = function (act, attr, val, cntxtNm, prodAttrId, prodValId, inpElem) {
		
		// Determine the customer's action 
		if (act === "Selected spec" || act === "Expanded" || act === "Collapsed") {
            var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.SLCT });
        } else if (act === "Deselected spec") {
            var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.DESLCT });
        } else if (act) {
            var srchTrkInfo = new SrchTrkr.SrchDat({ usr: act });
        }
		
		// Determine the type of element that was acted upon
		if (act === "Expanded") {
			srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.ATTR_SHOW_LNK;
		} else if (act === "Collapsed") {
			srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.ATTR_HIDE_LNK;
		} else {
			srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.SPEC;
		}
		
		// Create the search tracker object
        if (srchTrkInfo) {
			srchTrkInfo.usr.srcNm = getSrcNmFrmCntxt(cntxtNm);
            srchTrkInfo.usr.spec = { attr: attr, val: val };
			if (prodAttrId) {
				srchTrkInfo.usr.specIds = { attrId: prodAttrId, valId: prodValId};
			}
			if (inpElem && srchTrkInfo.usr.elemTyp === SrchTrkr.ElemTyps.SPEC) {
				srchTrkInfo.usr.slctdElemXYPosn = Cmn.GetXOffset(inpElem) + "," + Cmn.GetYOffset(inpElem);
			}
            srchTrkInfo.Trk();
        }
    }


    //------------------------------------------------------------
    // Summary: Returns true if you can type into the given input element.
    // Input:   Markup element
    //------------------------------------------------------------
    var getVldCntxtSrchBx = function (inpElem) {

        if (Cmn.HasCls(inpElem, "SpecSrch_CntxtSrchBx")) {
            return inpElem;
        } else {
            return null;
        }
    };

    //------------------------------------------------------------
    // Summary: Performs the contextual search.
    // Input:   Markup element
    //------------------------------------------------------------
    var procssCntxtSrch = function (inpElem, inpKeyCode, cntxtNm, webPartLoader) {

        var prodAttrId = getProdAttrIdFrmTxt(inpElem.id);
        var pubAttrId = getPubAttrIdFrmTxt(inpElem.id);

        var rootProdAttrId = prodAttrId;
        var rootPubAttrId = pubAttrId;
        var relAttribute = inpElem.getAttribute("rel");
        if (relAttribute) {
            var attrIds = relAttribute.split(":")[1];
            rootProdAttrId = attrIds.split("_")[0];
            rootPubAttrId = attrIds.split("_")[1];
        }

        // When a contextual search is performed, we want the first value selection
        // to collapse the attribute. If the customer expands the attribute and changes 
        // the contextual search, we want to prevent subsequent interactions with the
        // attribute from collapsing it. We will instead collapse when the customer 
        // has moved on to a different attribute.   
        if (Cmn.Utilities.Empty(SpecSrchInp.Get().GetAttrSlctdVals(rootProdAttrId, cntxtNm))) {
            //Do nothing
        } else {
            SpecSrchInp.Get().SetExplicitlyExpandedAttr(rootPubAttrId).UpdateSession();
        }


        //If the escape key was hit then clear out the contextual search box
        if (inpKeyCode == 27) {
            inpElem.value = "";

            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }
        }

        //Get the contextual search argument
        var cntxtSrchArgTxt = inpElem.value;

        //If there's a difference in the argument string, one should trigger a push
        // This is also to filter out keystrokes like the Alt or Ctrl key
        var sesnSpecInp = SpecSrchInp.Get();
        if (sesnSpecInp.GetCntxtSrchChgd(prodAttrId, cntxtSrchArgTxt, cntxtNm)) {
            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }

            //Reset the load indicator because an action has occurred
            McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);

            //Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);

            if (mContextualSrchTimeout) {
                // there's already a request queued up. it's stale.  clear it out.
                clearTimeout(mContextualSrchTimeout);
                mContextualSrchTimeout = null;
            }

            // Immediately update the contextual search information
            // Even though a subsequent keystroke might come quickly and prevent the contextual search
            // for this argument from actually being performed, we'll still save the data off in
            // Session Manager.  It can be useful for "rolling back" from a null result set to a previous
            // search argument.
            //
            // Example:
            //  1. User types "1" - saved to session, not sent to server
            //  2. User quickly types "x" - saved to session.
            //  3. User pauses.  Contextual search for "1x" performed.  No results found.  Server rolls back to "1".
            sesnSpecInp.AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm).UpdateSession();

            var tempFunc = function () {
                //Begin a new set of timers
				var top = McMasterCom.Nav.GetTopFrame();
                var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntCntxtSrch, top.PerfTracker.PgCntxtNms.DynCntnt);
                // Publish the spec selected message
                sesnSpecInp.PubMsg();

                //Track the contextual search
                me.Webreports_TrkContextualSrch(cntxtNm, rootPubAttrId, cntxtSrchArgTxt, inpElem.value, rootProdAttrId);
            };

            if (inpKeyCode == 8) {
                // backspace
                // use longer timeout
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_BACKSPACE_TIMEOUT_MS_NBR);
            } else {
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_DEFLT_TIMEOUT_MS_NBR);
            }

        } else if (inpKeyCode == 9) {
            // Key code for a tab so that we remember where the user was inputting text
            // while they tab around. 
            // Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
        } else {
            // value of contextual search box has not changed
            // ignore
        }
    };
    //------------------------------------------------------------
    // Summary: Performs the contextual search.
    // Input:   Markup element
    //------------------------------------------------------------
    var procssItmPrsnttnCntxtSrch = function (inpElem, inpKeyCode, cntxtNm, webPartLoader) {
        var prodAttrId = getProdAttrIdFrmTxt(inpElem.id);
        var pubAttrId = getPubAttrIdFrmTxt(inpElem.id);
        var rootProdAttrId = prodAttrId;
        var rootPubAttrId = pubAttrId;
        var relAttribute = inpElem.getAttribute("rel");
		if (relAttribute) {
            var attrIds = relAttribute.split(":")[1];
            rootProdAttrId = attrIds.split("_")[0];
            rootPubAttrId = attrIds.split("_")[1];
        }
		
		var partNbrLnks = Cmn.GetElementsByClsNm("PartNbr");	
		var partNbrLnk;
		if (partNbrLnks.length > 0){
			for (var i=0; i<partNbrLnks.length; i++){
				if (!Cmn.HasCls(partNbrLnks[i], "printver")){
					partNbrLnk = partNbrLnks[i];
					break;
				}
			}
		}
		var attrcompitmids = partNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids");
        // When a contextual search is performed, we want the first value selection
        // to collapse the attribute. If the customer expands the attribute and changes 
        // the contextual search, we want to prevent subsequent interactions with the
        // attribute from collapsing it. We will instead collapse when the customer 
        // has moved on to a different attribute.   
        if (Cmn.Utilities.Empty(SpecSrchInp.Get().GetAttrSlctdVals(rootProdAttrId, cntxtNm))) {
            //Do nothing
        } else {
            SpecSrchInp.Get().SetExplicitlyExpandedAttr(rootPubAttrId).UpdateSession();
        }
        //If the escape key was hit then clear out the contextual search box
        if (inpKeyCode == 27) {
            inpElem.value = "";
            //Immediately abort any stale requests
			if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
				webPartLoader.AbortStaleReq();
            }
        }
        //Get the contextual search argument
        var cntxtSrchArgTxt = inpElem.value;
        //If there's a difference in the argument string, one should trigger a push
        // This is also to filter out keystrokes like the Alt or Ctrl key
        var sesnSpecInp = SpecSrchInp.Get();
        if (sesnSpecInp.GetCntxtSrchChgd(prodAttrId, cntxtSrchArgTxt, cntxtNm)) {
            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
				webPartLoader.AbortStaleReq();
            }
            //Reset the load indicator because an action has occurred
            McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);
            //Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
            if (mContextualSrchTimeout) {
                // there's already a request queued up. it's stale.  clear it out.
                clearTimeout(mContextualSrchTimeout);
                mContextualSrchTimeout = null;
            }
            // Immediately update the contextual search information
            // Even though a subsequent keystroke might come quickly and prevent the contextual search
            // for this argument from actually being performed, we'll still save the data off in
            // Session Manager.  It can be useful for "rolling back" from a null result set to a previous
            // search argument.
            //
            // Example:
            //  1. User types "1" - saved to session, not sent to server
            //  2. User quickly types "x" - saved to session.
            //  3. User pauses.  Contextual search for "1x" performed.  No results found.  Server rolls back to "1".
            sesnSpecInp.AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm).UpdateSession();
            var tempFunc = function () {
				var attrNmsTxt = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OldStylAttrNms.KyTxt());
                var attrValsTxt = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OldStylValTxts.KyTxt());
				var qtyInpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", Cmn.GetObj("ItmPrsnttnWebPart"))[0];
                //Begin a new set of timers
				var top = McMasterCom.Nav.GetTopFrame();
                var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntCntxtSrch, top.PerfTracker.PgCntxtNms.DynCntnt);
				//Publish spec selected message
				var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN);
			    McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.ItmPrsnttnSpecSlctd(msgHdr, attrNmsTxt, attrValsTxt, null, qtyInpBx.value, false, attrcompitmids));    
                //Track contextual search
			    me.Webreports_TrkContextualSrch(cntxtNm, rootPubAttrId, cntxtSrchArgTxt, inpElem.value, rootProdAttrId);
            };
            if (inpKeyCode == 8) {
                // backspace
                // use longer timeout
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_BACKSPACE_TIMEOUT_MS_NBR);
            } else {
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_DEFLT_TIMEOUT_MS_NBR);
            }
        } else if (inpKeyCode == 9) {
            // Key code for a tab so that we remember where the user was inputting text
            // while they tab around. 
            // Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
        } else {
            // value of contextual search box has not changed
            // ignore
        }
    };
    //------------------------------------------------------------
    // Summary: Performs the contextual search.
    // Input:   Markup element
    //------------------------------------------------------------
    var procssInLnCntxtSrch = function (inpElem, inpKeyCode, cntxtNm, webPartLoader) {

        var prodAttrId = getProdAttrIdFrmTxt(inpElem.id);
        var pubAttrId = getPubAttrIdFrmTxt(inpElem.id);

        var rootProdAttrId = prodAttrId;
        var rootPubAttrId = pubAttrId;
        var relAttribute = inpElem.getAttribute("rel");
        if (relAttribute) {
            var attrIds = relAttribute.split(":")[1];
            rootProdAttrId = attrIds.split("_")[0];
            rootPubAttrId = attrIds.split("_")[1];
        }
        var inLnSpecId = Cmn.GetAncestorByClsNm(inpElem, "InLnOrdWebPartAttrCntnr").getAttribute("data-InLnSpecId");
        var inLnSpecDict = McMaster.SesnMgr.GetStVal(StValDefs.InLnSpecUsrInps.KyTxt());
        //inLnSpecInp = inLnSpecDict[inLnSpecId];
        // McMaster.SesnMgr.SetStVal(StValDefs.InLnSpecUsrInps.KyTxt(), inLnSpecDict);

        // When a contextual search is performed, we want the first value selection
        // to collapse the attribute. If the customer expands the attribute and changes 
        // the contextual search, we want to prevent subsequent interactions with the
        // attribute from collapsing it. We will instead collapse when the customer 
        // has moved on to a different attribute.   
        if (Cmn.Utilities.Empty(inLnSpecDict[inLnSpecId].GetAttrSlctdVals(rootProdAttrId, cntxtNm))) {
            //Do nothing
        } else {
            inLnSpecDict[inLnSpecId].SetExplicitlyExpandedAttr(rootPubAttrId);
        }


        //If the escape key was hit then clear out the contextual search box
        if (inpKeyCode == 27) {
            inpElem.value = "";

            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }
        }

        //Get the contextual search argument
        var cntxtSrchArgTxt = inpElem.value;

        //If there's a difference in the argument string, one should trigger a push
        // This is also to filter out keystrokes like the Alt or Ctrl key
        //var sesnSpecInp = inLnSpecInp;
        if (inLnSpecDict[inLnSpecId].GetCntxtSrchChgd(prodAttrId, cntxtSrchArgTxt, cntxtNm)) {
            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }

            //Reset the load indicator because an action has occurred
            McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);

            //Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);

            if (mContextualSrchTimeout) {
                // there's already a request queued up. it's stale.  clear it out.
                clearTimeout(mContextualSrchTimeout);
                mContextualSrchTimeout = null;
            }

            // Immediately update the contextual search information
            // Even though a subsequent keystroke might come quickly and prevent the contextual search
            // for this argument from actually being performed, we'll still save the data off in
            // Session Manager.  It can be useful for "rolling back" from a null result set to a previous
            // search argument.
            //
            // Example:
            //  1. User types "1" - saved to session, not sent to server
            //  2. User quickly types "x" - saved to session.
            //  3. User pauses.  Contextual search for "1x" performed.  No results found.  Server rolls back to "1".
            //sesnSpecInp.AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm).UpdateSession();
            inLnSpecDict[inLnSpecId].AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm);
            McMaster.SesnMgr.SetStVal(StValDefs.InLnSpecUsrInps.KyTxt(), inLnSpecDict);
            var tempFunc = function () {
                //Begin a new set of timers
				var top = McMasterCom.Nav.GetTopFrame();
                var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntCntxtSrch, top.PerfTracker.PgCntxtNms.DynCntnt);
				
				var itmBx = Cmn.GetAncestorByClsNm(inpElem, "AddToOrdFlow_ItmBx");
				var partNbrTxt;
				var partNbrRow; 
				if (itmBx){
					partNbrRow = Cmn.GetPrevSibling(Cmn.GetPrevSibling(itmBx));
					var itmBxCell = itmBx.children[0];
					if (itmBxCell){
						var lastIdx = itmBxCell.id.split("_").length - 1;
						partNbrTxt = itmBxCell.id.split("_")[lastIdx];
					}
				}
				
				var partNbrLnk;
				if (partNbrTxt && partNbrRow){
					var testMthd = function(elem) {
						if (Cmn.HasCls(elem, "PartNbrLnk") &&
							elem.innerHTML == partNbrTxt){
								return true;
						}
					}
					partNbrLnk = Cmn.GetElementBy(testMthd, "A", partNbrRow);
				}
    
				InLnOrdWebPart.updtSpecAttr(inLnSpecId, partNbrLnk);

                //Track the contextual search
                me.Webreports_TrkContextualSrch(cntxtNm, rootPubAttrId, cntxtSrchArgTxt, inpElem.value, rootProdAttrId);
            };

            if (inpKeyCode == 8) {
                // backspace
                // use longer timeout
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_BACKSPACE_TIMEOUT_MS_NBR);
            } else {
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_DEFLT_TIMEOUT_MS_NBR);
            }

        } else if (inpKeyCode == 9) {
            // Key code for a tab so that we remember where the user was inputting text
            // while they tab around. 
            // Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
        } 
    };
    //------------------------------------------------------------
    // Summary: Performs the contextual search.
    // Input:   Markup element
    //------------------------------------------------------------
    var procssOrdPadLnCntxtSrch = function (inpElem, inpKeyCode, cntxtNm, webPartLoader) {

        var prodAttrId = getProdAttrIdFrmTxt(inpElem.id);
        var pubAttrId = getPubAttrIdFrmTxt(inpElem.id);

        var rootProdAttrId = prodAttrId;
        var rootPubAttrId = pubAttrId;
        var relAttribute = inpElem.getAttribute("rel");
        if (relAttribute) {
            var attrIds = relAttribute.split(":")[1];
            rootProdAttrId = attrIds.split("_")[0];
            rootPubAttrId = attrIds.split("_")[1];
        }
        var partNbrCol = Cmn.GetPrevSibling(Cmn.GetAncestorByClsNm(inpElem, "OrdPadProdsWebPartLayout_PartDscCell"));
        var partNbrTxt = Cmn.GetFrstChld(Cmn.GetFrstChldByClsNm(partNbrCol, "OrdPadProdsWebPart_ShowOnPending")).value;
        var lnSeqNbr = getLnSeqFrmLnElem(inpElem);
        var ordPadSpecId = partNbrTxt + "_" + lnSeqNbr;
        if (McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OrdLnSpecUsrInps.KyTxt()) == null) {
            var ordLnSpecInpDict = {};
            ordLnSpecInpDict[ordPadSpecId] = SpecSrchInp.RemAll();
            McMaster.SesnMgr.SetStVal(StValDefs.OrdLnSpecUsrInps.KyTxt(), ordLnSpecInpDict);
        }
        var ordLnSpecInpDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OrdLnSpecUsrInps.KyTxt());
        if (ordPadSpecId in ordLnSpecInpDict) {
        } else {
            ordLnSpecInpDict[ordPadSpecId] = SpecSrchInp.RemAll();
        }


        // When a contextual search is performed, we want the first value selection
        // to collapse the attribute. If the customer expands the attribute and changes 
        // the contextual search, we want to prevent subsequent interactions with the
        // attribute from collapsing it. We will instead collapse when the customer 
        // has moved on to a different attribute.   
        if (Cmn.Utilities.Empty(ordLnSpecInpDict[ordPadSpecId].GetAttrSlctdVals(rootProdAttrId, cntxtNm))) {
            //Do nothing
        } else {
            ordLnSpecInpDict[ordPadSpecId].SetExplicitlyExpandedAttr(rootPubAttrId);
        }


        //If the escape key was hit then clear out the contextual search box
        if (inpKeyCode == 27) {
            inpElem.value = "";

            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }
        }

        //Get the contextual search argument
        var cntxtSrchArgTxt = inpElem.value;

        //If there's a difference in the argument string, one should trigger a push
        // This is also to filter out keystrokes like the Alt or Ctrl key
        //var sesnSpecInp = inLnSpecInp;
        if (ordLnSpecInpDict[ordPadSpecId].GetCntxtSrchChgd(prodAttrId, cntxtSrchArgTxt, cntxtNm)) {
            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }

            //Reset the load indicator because an action has occurred
            McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);

            //Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);

            if (mContextualSrchTimeout) {
                // there's already a request queued up. it's stale.  clear it out.
                clearTimeout(mContextualSrchTimeout);
                mContextualSrchTimeout = null;
            }

            // Immediately update the contextual search information
            // Even though a subsequent keystroke might come quickly and prevent the contextual search
            // for this argument from actually being performed, we'll still save the data off in
            // Session Manager.  It can be useful for "rolling back" from a null result set to a previous
            // search argument.
            //
            // Example:
            //  1. User types "1" - saved to session, not sent to server
            //  2. User quickly types "x" - saved to session.
            //  3. User pauses.  Contextual search for "1x" performed.  No results found.  Server rolls back to "1".
            //sesnSpecInp.AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm).UpdateSession();
            ordLnSpecInpDict[ordPadSpecId].AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm);
            McMaster.SesnMgr.SetStVal(StValDefs.OrdLnSpecUsrInps.KyTxt(), ordLnSpecInpDict);
            var tempFunc = function () {
                //Begin a new set of timers
				var top = McMasterCom.Nav.GetTopFrame();
                var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntCntxtSrch, top.PerfTracker.PgCntxtNms.DynCntnt);
                var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.ORD_PAD);
                McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.OrdPadLnSpecSlctd(MSG_HDR, lnSeqNbr, partNbrTxt));

                //Track the contextual search
                me.Webreports_TrkContextualSrch(cntxtNm, rootPubAttrId, cntxtSrchArgTxt, inpElem.value, rootProdAttrId);
            };

            if (inpKeyCode == 8) {
                // backspace
                // use longer timeout
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_BACKSPACE_TIMEOUT_MS_NBR);
            } else {
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_DEFLT_TIMEOUT_MS_NBR);
            }

        } else if (inpKeyCode == 9) {
            // Key code for a tab so that we remember where the user was inputting text
            // while they tab around. 
            // Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
        } else {
            // value of contextual search box has not changed
            // ignore
            McMaster.SesnMgr.SetStVal(StValDefs.OrdLnSpecUsrInps.KyTxt(), ordLnSpecInpDict);
            var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.ORD_PAD);
            McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.OrdPadLnSpecSlctd(MSG_HDR, lnSeqNbr, partNbrTxt));
        }
    };
    //------------------------------------------------------------
    // Summary: Handles the mouseover event
    // Input:   The YUI event
    //          e - the event object
    //          webPartLoader - The loader for this web
    //               part. If it exists, call the method on the loader
    //               that determines whether a request is already in 
    //               flight. If so, ignore the current mouseover event.
    //          cntnr - the container in which the web part is loaded
    //------------------------------------------------------------
    var hndlMouseOvrEvnt = function (e, cntxtNm, webPartLoader, cntnr) {
        if (webPartLoader && typeof webPartLoader.ReqInFlight === "function" && webPartLoader.ReqInFlight()) {
            // Don't listen to mouseover events when a request is in flight
        } else {
            var contInd = true;
            if (cntxtNm.toUpperCase() == "LANDINGPAGE") {
                var targetElem = Cmn.GetEvntTarget(e);
                var relTargetElem = Cmn.GetEvntRelatedTarget(e);

                if ((Cmn.GetAncestorByClsNm(targetElem, "LandingPage_DeepLnksCntnr") || Cmn.HasCls(targetElem, "LandingPage_DeepLnksCntnr")) && !(Cmn.GetAncestorByClsNm(targetElem, "LandingPage_DeepLnkVal") || Cmn.HasCls(targetElem, "LandingPage_DeepLnkVal"))) {
                    contInd = false;
                }
                //                while (relTargetElem && relTargetElem != targetElem && relTargetElem.nodeName.toUpperCase() != 'DIV' && relTargetElem.nodeName.toUpperCase() != 'LI'
                //                && !(Cmn.HasCls("LandingPage_DeepLnksList", relTargetElem))) {
                //                    relTargetElem = relTargetElem.parentNode;
                //                }
                //                if (relTargetElem == targetElem){
                //                    contInd = false;
                //                }
                //                if (relTargetElem && targetElem && Cmn.HasCls("LandingPage_DeepLnksList", relTargetElem) &&
                //                    Cmn.IsAncestor(relTargetElem, targetElem)){
                //                    contInd = false;
                //                }
            }
            if (contInd) {

                // Handler the mouseover
                hndlHoverEvnt(e, cntxtNm, true, cntnr);
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Handles the mouseout event
    // Input:   The YUI event
    //          e - the event object        
    //          webPartLoader - The loader for this web
    //               part. If it exists, call the method on the loader
    //               that determines whether a request is already in 
    //               flight. If so, ignore the current mouseout event.
    //          cntnr - the container in which the web part is loaded       
    //------------------------------------------------------------
    var hndlMouseOutEvnt = function (e, cntxtNm, webPartLoader, cntnr) {

        if (webPartLoader && typeof webPartLoader.ReqInFlight === "function" && webPartLoader.ReqInFlight()) {
            // Don't listen to mouseout events when a request is in flight
        } else {

            var contInd = true;
            if (cntxtNm.toUpperCase() == "LANDINGPAGE") {
                var targetElem = Cmn.GetEvntTarget(e);
                var relTargetElem = Cmn.GetEvntRelatedTarget(e);

                //                if (Cmn.GetAncestorByClsNm(targetElem, "LandingPage_DeepLnksList") && Cmn.GetAncestorByClsNm(targetElem, "LandingPage_DeepLnksList")){
                //                
                //                }
                while (relTargetElem && relTargetElem != targetElem && relTargetElem.nodeName.toUpperCase() != 'DIV' && relTargetElem.nodeName.toUpperCase() != 'LI'
                && !(getVldClickElem(relTargetElem) || Cmn.GetAncestorBy(relTargetElem, getVldClickElem))) {
                    //&& !(Cmn.HasCls("LandingPage_DeepLnksList", relTargetElem))) {
                    relTargetElem = relTargetElem.parentNode;
                }
                if (relTargetElem == targetElem) {
                    contInd = false;
                }
                //                if (relTargetElem && targetElem && Cmn.HasCls("LandingPage_DeepLnksList", relTargetElem) &&
                //                    Cmn.IsAncestor(relTargetElem, targetElem)){
                //                    contInd = false;
                //                }
            }
            if (contInd) {
                // Handler the mousout
                hndlHoverEvnt(e, cntxtNm, false, cntnr);
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Handles the mouseover and mouseout events
    // Input:   The YUI event
    //------------------------------------------------------------
    var hndlHoverEvnt = function (e, cntxtNm, hoverInd, cntnr) {

        if (e) {
            // An element is only "hoverable" if it's "clickable"
            var targetElem = Cmn.GetEvntTarget(e);

            var relTargetElem = Cmn.GetEvntRelatedTarget(e);

            if (cntxtNm.toUpperCase() == "LANDINGPAGE") {

                if (targetElem && (targetElem.nodeName.toUpperCase() != "DIV" && targetElem.nodeName.toUpperCase() != "LI")) {

                    while (targetElem.parentNode) {
                        if (targetElem && (targetElem.nodeName.toUpperCase() != "DIV" && targetElem.nodeName.toUpperCase() != "LI")) {
                            targetElem = targetElem.parentNode;
                        } else {
                            break;
                        }
                    }
                }
            }


            var vldInpElem = getVldClickElem(targetElem) || Cmn.GetAncestorBy(targetElem, getVldClickElem);

            // If it's hoverable then process the hover event
            if (vldInpElem) {
                // Process the event
                procssHoverEvnt(vldInpElem, cntxtNm, hoverInd);

                // Handle cursor behavior.  The cursor should be a pointer because the
                // user has just moused over a valid input element.  If the cursor isn't
                // already a pointer, change it.
                if (hoverInd && mCursorIsPointerInd === false) {
                    Cmn.SetStyle(cntnr, "cursor", "pointer");
                    mCursorIsPointerInd = true;
                }
            } else {
                // If the user has moused over something and it's NOT a valid
                // input element, then we know we need to change the cursor
                // BACK to the default.  Only do this if the cursor hasn't
                // already been changed back.
                if (hoverInd && mCursorIsPointerInd) {
                    Cmn.SetStyle(cntnr, "cursor", "");
                    mCursorIsPointerInd = false;
                }
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Validates a clickable element or retrieves the 
    //          correct relative node.
    // Input:   The event's target element
    // Returns: A valid clickable element
    //------------------------------------------------------------
    var getVldClickElem = function (inpElem) {

        var rtnElem = null;

        if (inpElem) {
            switch (true) {
                case (getInpElemIsVal(inpElem)):
                case (getInpElemIsDropDwnBtn(inpElem)):
                case (getInpElemIsSpecInfoLnk(inpElem)):
                case (getInpElemIsClearAllLnk(inpElem)):
                case (getInpElemIsToggleLnk(inpElem)):
                case (getInpElemIsOptOutLnk(inpElem)):

                    if (getInpElemIsOptOutLnk(inpElem)) {
                        var envrNm = Cmn.GetEnvrNm();
                        if (envrNm == Cmn.APPL_ENVR_NMS.PUBDEV
                            || envrNm == Cmn.APPL_ENVR_NMS.PUBQUAL
                            || envrNm == Cmn.APPL_ENVR_NMS.PUB) {
                            rtnElem = inpElem;
                        } else {
                            //If we're handling the "Product Count" element and the
                            //environment is external, it won't be a clickable element.
                            //The "Opt-out" feature is only available internally.
                        }
                    } else {
                        rtnElem = inpElem;
                    }

                    break;

                case (getInpElemIsDeepLnkAttrInd(inpElem)):
                    //The clickable element (the valSpec's parent) is not
                    //an ancestor to the target element, so we have to 
                    //explicitly get the parent.
                    rtnElem = getParLnkWithDeepLnkAttrElem(inpElem, VAL_SPEC_PAR_ELEM_ID_CD.CAPTION);
                    break;

                default:
                    // no other elements are clickable;
            }
        }

        return rtnElem;
    };

    //------------------------------------------------------------
    // Summary: Processes the click event to update visuals as
    //          needed, send the appropriate values to session,
    //          and publish the needed messages
    // Input:   Validated click(ed) element
    //          maintainScrollPosnInd - Denotes whether we need to keep
    //               the selected value in the same position when the page
    //               gets re-loaded.
    //------------------------------------------------------------
    var procssClckEvnt = function (inpElem, cntxtNm, maintainScrollPosnInd) {

        //Process the click event
        switch (true) {
            case (getInpElemIsVal(inpElem)):
                //Process the val click event
                procssValClckEvnt(inpElem, cntxtNm, maintainScrollPosnInd);
				// Track the attribute that has been chosen
				if (cntxtNm == 'ChooseSpecs') {
					trkSlctdVal(inpElem);
				}
                break;

            case (getInpElemIsDropDwnBtn(inpElem)):
                //Toggle the dropdown
                procssDropDwnBtnClick(inpElem);
                break;

            case (getInpElemIsSpecInfoLnk(inpElem)):
                //The visitor has clicked on a general info link
                SpecSrchWebPart.SpecInfo.Click(inpElem, cntxtNm);
                break;

            case (getInpElemIsClearAllLnk(inpElem)):
                //The visitor has clicked the "Clear All" link
                procssClearAllLnkClick(inpElem, cntxtNm);
                break;

            case (getInpElemIsToggleLnk(inpElem)):
                // Click was on a show/hide link
                toggleAttrDisplSt(inpElem, cntxtNm);
                // Publish a message that the hide/show link has been selected
                var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.SPEC);
                McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.SpecToggleLnkSlctd(MSG_HDR));
                break;

            case (getInpElemIsOptOutLnk(inpElem)):

                var envrNm = Cmn.GetEnvrNm();

                if (envrNm == Cmn.APPL_ENVR_NMS.PUBDEV || envrNm == Cmn.APPL_ENVR_NMS.PUBQUAL
                    || envrNm == Cmn.APPL_ENVR_NMS.PUB) {

                    //Publish a message that the opt out link has been selected
                    var srchTxt = McMaster.SesnMgr.GetStVal(StValDefs.SlctdSrchRsltTxt.KyTxt());
                    var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.LANDING_PAGE);
                    McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.DynamicContentSlctd(MSG_HDR));
                } else {
                    //The "opt-out to catalog pages" feature is only activated for internal
                    //environments.
                }
                break;

            default:
                //Do nothing
                break;
        }
    };


    //------------------------------------------------------------
    // Summary: Toggles the state of the attribute associated with
    //          the clicked element (e.g. swaps to collapsed
    //          values if the current state is expanded).
    // Input:   Validated click(ed) element
    //------------------------------------------------------------      
    var toggleAttrDisplSt = function (inpElem, cntxtNm) {

        var attrCntnr = getAttrByInnerElem(inpElem);
        if (attrCntnr) {
            //If this attribute has an open SpecInfo presentation, get it.
            var openSpecInfo = SpecSrchWebPart.SpecInfo.GetOpenSpecInfoByAttrElem(attrCntnr);

            //Close all SpecInfo presentations.
            SpecSrchWebPart.SpecInfo.CloseAll();

            //Toggle the display of the attributes.
            var complementaryDisplStAttrCntnr = getComplementaryElemById(attrCntnr.id);
            Cmn.ReplaceCls(attrCntnr, "SpecSrch_AttrShow", "SpecSrch_AttrHide");
            Cmn.ReplaceCls(complementaryDisplStAttrCntnr, "SpecSrch_AttrHide", "SpecSrch_AttrShow");

            //If the attribute to display is a scrollable list, 
            //then scroll to the first selected value in the list
            scrollSlctdValsIntoView(complementaryDisplStAttrCntnr);

            //Track when customers manually expand/collapse attributes
            var pubAttrId = getPubAttrIdFrmTxt(attrCntnr.id);
            var prodAttrId = getProdAttrIdFrmTxt(attrCntnr.id);
            var trkAttrGrpNm = me.GetAttrNm(pubAttrId);
            var trkAct = "";
            if (attrCntnr.id.Contains("_C_")) {
                // CURRENT state of attribute container is COLLAPSED
                // The action just taken by the customer will EXPAND the attribute.         
                trkAct = "Expanded";
                // Record that the attribute was explicitly expanded            
                SpecSrchInp.Get().SetExplicitlyExpandedAttr(pubAttrId).UpdateSession();
            } else {
                trkAct = "Collapsed";

                // Note that the attribute was explicitly collapsed         
                SpecSrchInp.Get().RemExplicitlyExpandedAttr(pubAttrId).UpdateSession();
            }

            //If the customer clicked the "Show" link and a specInfo presentation was open at the time,
            //re-open the specInfo presentation such that it includes information for the new set of
            //values that are in scope.
            if (Cmn.GetTxtContent(inpElem) === "Show" && openSpecInfo) {
                SpecSrchWebPart.SpecInfo.LoadSpecInfo(openSpecInfo, null, cntxtNm);
            }

            SpecInteractions.Webreports_TrkAct(cntxtNm, trkAct, trkAttrGrpNm, null, false, prodAttrId, null, inpElem);
        }
    };
	
	
	//------------------------------------------------------------
    // Summary: Called when the user selects a value and publishes
	//			information a message containing information about
	//			that value.
    // Input:   Validated click(ed) element
    //------------------------------------------------------------
	var trkSlctdVal = function (inpElem) {
	
			// The values we want to track.
			var slctdAttrNmTxt = '';
			var slctdAttrPosNbr = 0;
			var slctdAttrAbvFoldInd = true;
		
			// Find the attribute corresponding to the clicked element.
			var slctdAttr = Cmn.GetAncestorByClsNm(inpElem, 'SpecSrch_Attribute');
			
			// Find the name of that attribute.
			var slctdAttrNmElems = Cmn.GetElementsByClsNm('SpecSrch_Lbl', 'th', slctdAttr);
			if (slctdAttrNmElems.length > 0) slctdAttrNmTxt = Cmn.GetTxtContent(slctdAttrNmElems[0]);
			
			// Find the position of the attribute amongst all attributes on the page.
			var allAttrs = Cmn.GetElementsByClsNm('SpecSrch_Attribute', 'div');
			for (i=0;i<allAttrs.length;i++) {
				if(allAttrs[i] == slctdAttr) {
					slctdAttrPosNbr = i + 1;
				}
			}
			
			// Determine whether the attribute was visible when the page loaded.
			
			var topPxNbr = slctdAttr.offsetTop; 
					// pixels from the top of the spec search to the top of the selected attribute
			var visiblePxNbr = 0;
			var specSrchInnerArr = Cmn.GetElementsByClsNm('SpecSrch_Inner');
			if (specSrchInnerArr.length > 0) visiblePxNbr = specSrchInnerArr[0].offsetHeight;
					// pixels from the top of the spec search to the bottom of the page
			if (topPxNbr < visiblePxNbr) {
				slctdAttrAbvFoldInd = true;
			} else {
				slctdAttrAbvFoldInd = false;
			}
			
			// Publish a message.
			var hdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.SPEC);
			var msg = new McMaster.MsgMgrMsgs.ProdInfoSlctd(hdr, 'SpecSrch', slctdAttrNmTxt, slctdAttrPosNbr, slctdAttrAbvFoldInd)
			McMaster.MsgMgr.PubMsg(msg);
			
	};

    //------------------------------------------------------------
    // Summary: Scrolls selected values into view within the given container.
    // Input:   Validated click(ed) element
    //------------------------------------------------------------
    var scrollSlctdValsIntoView = function (cntnrElem) {

        if (cntnrElem) {
            //If the attribute to display is a scrollable list, 
            //then scroll to the first selected value in the list
            var scrollCntnrs = Cmn.GetElementsByClsNm("SpecSrch_ScrollCntnr", "div", cntnrElem);
            for (cntnrIdx = 0; cntnrIdx < scrollCntnrs.length; cntnrIdx++) {
                var currCntnr = scrollCntnrs[cntnrIdx];
                var slctdVals = Cmn.GetElementsByClsNm("SpecSrch_SlctdVal", "td", currCntnr)
                                 || Cmn.GetElementsByClsNm("SpecSrch_SlctdVal", "tr", currCntnr);
                if (slctdVals && slctdVals.length > 0) {
                    Cmn.SetVerticalScrollPosn(currCntnr, (slctdVals[0].offsetTop - (currCntnr.offsetHeight / 3)));
                }
            }
        }
    };

    var getInpElem = function (inpElem, cntxtNm) {
        if (cntxtNm.toUpperCase() == "LANDINGPAGE") {
            while (inpElem) {
                if (inpElem.tagName == "li" || Cmn.HasCls(inpElem, LANDING_PG_ATTR_CLS_NM)) {
                    break;
                }
                inpElem = inpElem.parentNode;
            }
        }
        return inpElem;
    }

    var getLegacyCntntTrm = function (inpElem, cntxtNm) {
        var rtnTrmTxt = "";
        if (cntxtNm.toUpperCase() == "LANDINGPAGE") {
            if (inpElem) {
                var cntntTrm = inpElem.getAttribute("legacyCntntTrm");
                if (cntntTrm) {
                    rtnTrmTxt = cntntTrm;
                }
            }
        }
        return rtnTrmTxt;
    }


    //---------------------------------------------------------------------------
    // Summary: Completes processing of clickable element.
    // Input:   currSpecUsrInp      - spec search user inputs
    //          slctdElem        - The node that encapsulates the clickable element 
    //                             associated with the element selected by the user.
    //          srchTrmTxt       - Search term.
    //          imgCaptionTxt    - Image caption.
    //---------------------------------------------------------------------------
    var procssLegacySrchTrmClick = function (slctdElem, srchTrmTxt) {

        var elemHgt
              , landingPageNm
              , mainContentCntnr
              , McMaster_LoadMgr = McMaster.LoadMgr
              , McMaster_SesnMgr = McMaster.SesnMgr
              , McMaster_SesnMgr_SetStVal = McMaster_SesnMgr.SetStVal
              , McMaster_SesnMgr_StValDefs = McMaster_SesnMgr.StValDefs
              , belowTheFoldInd = false
              ;



        // Determine the height offset of the element that was selected so we can determine if 
        // it was above or below the fold (a.k.a - They had to scroll to find it to click on it).               
        mainContentCntnr = Cmn.GetObj(MAIN_CONTENT_CNTNR_NM);
        elemHgt = (slctdElem.offsetTop + slctdElem.offsetHeight);

        if (elemHgt > mainContentCntnr.offsetHeight) {
            belowTheFoldInd = true;
        }


        // Display the 'wait' indicator
        McMaster_LoadMgr.UnloadCntnr(MAIN_CONTENT_CNTNR_NM);
        McMaster_LoadMgr.ShowCntnr(MAIN_CONTENT_CNTNR_NM);
        McMaster_LoadMgr.DisplWaitIcon(MAIN_CONTENT_CNTNR_NM);

        // Create a message header
        var hdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.INTERMEDIATE_PRSNTTN);

        // Create a Search Submitted Message                
        var msg = new McMaster.MsgMgrMsgs.UsrInpTxtSubmitted(hdr, srchTrmTxt, "slct");

        // Publish the message
        McMaster.MsgMgr.PubMsg(msg);

        var srchTxt = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.SrchTxt.KyTxt());
    }

    //------------------------------------------------------------
    // Summary: Processes the act of selecting a value.
    // Input:   Validated click(ed) element
    //          maintainScrollPosnInd - Denotes whether we need to keep
    //               the selected value in the same position when the page
    //               gets re-loaded.
    //------------------------------------------------------------
    var procssValClckEvnt = function (inpElem, cntxtNm, maintainScrollPosnInd) {
        var prodAttrId = getProdAttrIdFrmTxt(inpElem.id);
        var prodValId = getProdValIdFrmTxt(inpElem.id);

        var pubAttrId = getPubAttrIdFrmTxt(inpElem.id);
        var pubValId = getPubValIdFrmTxt(inpElem.id);

        var legacyCntntTrm = getLegacyCntntTrm(inpElem, cntxtNm);
        if (legacyCntntTrm) {
            procssLegacySrchTrmClick(inpElem, legacyCntntTrm);
        } else {
            //Track the click-action
            var tmpAttrValNm = getCaptionLnkByInpElem(inpElem,cntxtNm).innerHTML.replace("<br>", " " );
            var trkAttrValNm = tmpAttrValNm.replace(/<.*?>/ig,"");
			trkAttrValNm = trkAttrValNm.replace("&nbsp;", "");
                                    
            var trkAttrGrpNm = me.GetAttrNm(pubAttrId);
            var trkAct = (SpecSrchInp.Get().ValExists(prodAttrId, prodValId, cntxtNm)) ? ACT.CLICK_SLCTD : ACT.CLICK_VLD;
            
            //If we clicked on a deep link we want to include it's container's attribute and value
            if ( Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal") ) {
                var trkMsg = crteDeepLnkTrkMsg(inpElem,trkAttrValNm,trkAttrGrpNm);
                SpecInteractions.Webreports_TrkCustomAct(cntxtNm, trkAct, trkMsg);

                // TrkSrch wrapper
                trkSrchValSlct(trkAct, trkAttrGrpNm, trkAttrValNm, cntxtNm, prodAttrId, prodValId, inpElem);

            } else {
				var clsNm = SPEC_SRCH_ATTR_CLS_NM;
                if (cntxtNm == "LandingPage") {
					clsNm = LANDING_PG_ATTR_CLS_NM;
				}
				var ancstr = getAttrByInnerElem(inpElem, clsNm);
				var ancstrTrkAttrGrpNm = getClickedValParGrpNm(inpElem, ancstr);
                if (ancstrTrkAttrGrpNm !== trkAttrGrpNm) {
                	trkAttrGrpNm = ancstrTrkAttrGrpNm + " " + trkAttrGrpNm;
                }
                // TrkSrch is called from here as well
                SpecInteractions.Webreports_TrkAct(cntxtNm, trkAct, trkAttrGrpNm, trkAttrValNm.Trim(), false, prodAttrId, prodValId, inpElem);
            }
            
            //Reset the load indicator because an action has occurred
            McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);

            //Performance timer - Track the start of the click event
			var top = McMasterCom.Nav.GetTopFrame();
            var trkEvntPayload = new top.PerfTracker.EvntPayload();
            trkEvntPayload.Add("attrGrpNm", trkAttrGrpNm);
            trkEvntPayload.Add("attrValNm", trkAttrValNm);
            var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntValClick, top.PerfTracker.PgCntxtNms.DynCntnt, trkEvntPayload);

            //Figure out if the selected value is in a dropdown
            //before deciding what to do next
            if (getInpElemIsDropDwnVal(inpElem)) {
                // Process the dropdown click
                procssDropDwnValClick(prodAttrId, pubAttrId, prodValId, pubValId, inpElem, cntxtNm);
            } else if (prodAttrId && prodValId && cntxtNm != "InLnOrd" & cntxtNm != "OrdPad" & cntxtNm != McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN) {
                // The visitor is interacting with a normal attribute.  
                // Toggle the filter, save it off to session, and publish a message
                SpecSrchInp.Get().ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm).UpdateSession().PubMsg();
            } else if (prodAttrId && prodValId && cntxtNm == McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN){
				var attrNmsTxt = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OldStylAttrNms.KyTxt());
                var attrValsTxt = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OldStylValTxts.KyTxt());
				var qtyInpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", Cmn.GetObj("ItmPrsnttnWebPart"))[0];
				var partNbrLnks = Cmn.GetElementsByClsNm("PartNbr");	
				var partNbrLnk;
				if (partNbrLnks.length > 0){
					for (var i=0; i<partNbrLnks.length; i++){
						if (!Cmn.HasCls(partNbrLnks[i], "printver")){
							partNbrLnk = partNbrLnks[i];
							break;
						}
					}
				}
				// The visitor is interacting with a normal attribute.  
                // Toggle the filter, save it off to session.
				SpecSrchInp.Get().ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm).UpdateSession();
				
				//Publish spec selected message
				var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN);
			    McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.ItmPrsnttnSpecSlctd(msgHdr, attrNmsTxt, attrValsTxt, null, qtyInpBx.value, false, partNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids")));    
				
            } else if (prodAttrId && prodValId && cntxtNm == "InLnOrd") {
                // The visitor is interacting with a normal attribute.  
                // Toggle the filter, save it off to session, and publish a message
                var CmnObjJs = null;
                if (chkCtlgPageInd()){
                    CmnObjJs = McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog.Cmn;
                }else{
                    CmnObjJs = Cmn;
                }
                
                var seqNbr = CmnObjJs.GetAncestorByClsNm(inpElem, "InLnOrdWebPartAttrCntnr").getAttribute("data-mcm-partnbr-seqnbr");
                var inLnSpecId = CmnObjJs.GetAncestorByClsNm(inpElem, "InLnOrdWebPartAttrCntnr").getAttribute("data-inlnspecid");

                var inLnSpecDict = McMaster.SesnMgr.GetStVal(StValDefs.InLnSpecUsrInps.KyTxt());
                inLnSpecDict[inLnSpecId].ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm);
                
                var partNbrTxt = inLnSpecId.split('_')[0];
                var partNbrLnk = fndPartNbrLnkByClsNm(partNbrTxt, "AddToOrdBxCreated", seqNbr)
                var tblRow = CmnObjJs.GetAncestorByTagNm(CmnObjJs.GetAncestorByClsNm(partNbrLnk, "ItmTblCellPartNbr"), 'tr');
                var prdGrp = CmnObjJs.GetAncestorByClsNm(partNbrLnk, "ItmTblCellPartNbr").getAttribute("data-mcm-prodgrps")
                var parentRows = CmnObjJs.GetElementsByClsNm("ItmTblSpecLnk", "td", tblRow);

                for (var parentRowIdx = 0; parentRowIdx < parentRows.length; parentRowIdx++) {
                    var parentRow = parentRows[parentRowIdx];
                    if (parentRow.getAttribute("data-mcm-prodgrps")==prdGrp) {
                        var specChoiceSlctdLnks = CmnObjJs.GetElementsByClsNm("SpecChoiceSlctd", "a", parentRow);
                        var specChoiceLnks = CmnObjJs.GetElementsByClsNm("SpecChoiceLnk", "a", parentRow);
                        if (specChoiceLnks.length > 0) {
                            if (specChoiceLnks[0].getAttribute("data-mcm-prod-attr-id") == prodAttrId) {
                                for (var specChoiceLnkIdx = 0; specChoiceLnkIdx < specChoiceSlctdLnks.length; specChoiceLnkIdx++) {
                                    CmnObjJs.ReplaceCls(specChoiceSlctdLnks[specChoiceLnkIdx], "SpecChoiceSlctd", "SpecChoiceVisitedLnk ");
                                }
                                if (inLnSpecDict[inLnSpecId].ValExists(prodAttrId, prodValId, cntxtNm)) {
                                    for (var specChoiceLnkIdx = 0; specChoiceLnkIdx < specChoiceLnks.length; specChoiceLnkIdx++) {
                                        if (prodValId == specChoiceLnks[specChoiceLnkIdx].getAttribute("data-mcm-prod-attrval-id")) {
                                            CmnObjJs.AddCls(specChoiceLnks[specChoiceLnkIdx], "SpecChoiceSlctd");
                                            CmnObjJs.RemCls(specChoiceLnks[specChoiceLnkIdx], "SpecChoiceVisitedLnk");
                                        }
                                    }
                                } else {
                                    for (var specChoiceLnkIdx = 0; specChoiceLnkIdx < specChoiceLnks.length; specChoiceLnkIdx++) {
                                        if (prodValId == specChoiceLnks[specChoiceLnkIdx].getAttribute("data-mcm-prod-attrval-id")) {
                                            CmnObjJs.RemCls(specChoiceSlctdLnks[specChoiceLnkIdx], "SpecChoiceSlctd");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
				
				parentRows = CmnObjJs.GetElementsByClsNm("ItmTblCellPrce", "td", tblRow);
				
				for (var parentRowIdx = 0; parentRowIdx < parentRows.length; parentRowIdx++) {
                    var parentRow = parentRows[parentRowIdx];
                    if (parentRow.getAttribute("data-mcm-prodgrps") == prdGrp) {
                        var prceSlctdLnk = CmnObjJs.GetElementsByClsNm("PrceLnkSlctd", "a", parentRow)[0];
                        var prceLnk = CmnObjJs.GetElementsByClsNm("PrceLnk", "a", parentRow)[0];
                        if (prceLnk) {
							var prodAttrIds = prceLnk.getAttribute("data-mcm-prod-attr-id").split(",")
							var prodValIds = new Array;
                            CmnObjJs.ReplaceCls(prceSlctdLnk, "PrceLnkSlctd", "PrceLnkVisited ");
                            
							for (var i = 0; i < prodAttrIds.length; i++) {
							    var valId = Cmn.Utilities.Keys(inLnSpecDict[inLnSpecId].GetAttrSlctdVals(prodAttrIds[i], cntxtNm))[0]
							    if (valId){
							        prodValIds[i] = valId;
							    }
							}
                            if (prodValIds.join(",") == prceLnk.getAttribute("data-mcm-prod-attrval-id")) {
                                CmnObjJs.AddCls(prceLnk, "PrceLnkSlctd");
                                CmnObjJs.RemCls(prceLnk, "PrceLnkVisited");
                            } else {
                                CmnObjJs.RemCls(prceSlctdLnk, "PrceLnkSlctd");
                            }
                        }
                    }
                }
				
                McMaster.SesnMgr.SetStVal(StValDefs.InLnSpecUsrInps.KyTxt(), inLnSpecDict);
                InLnOrdWebPart.updtSpecAttr(inLnSpecId, inpElem);

            } else if (prodAttrId && prodValId && cntxtNm == "OrdPad") {
                // The visitor is interacting with a normal attribute.  
                // Toggle the filter, save it off to session, and publish a message

                var partNbrCol = Cmn.GetPrevSibling(Cmn.GetAncestorByClsNm(inpElem, "OrdPadProdsWebPartLayout_PartDscCell"));
                var partNbrTxt = Cmn.GetFrstChld(Cmn.GetFrstChldByClsNm(partNbrCol, "OrdPadProdsWebPart_ShowOnPending")).value;
                var lnSeqNbr = getLnSeqFrmLnElem(inpElem);
                var ordPadSpecId = partNbrTxt + "_" + lnSeqNbr;
                if (McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OrdLnSpecUsrInps.KyTxt()) == null) {
                    var ordLnSpecInpDict = {};
                    ordLnSpecInpDict[ordPadSpecId] = SpecSrchInp.Get().RemAll();
                    McMaster.SesnMgr.SetStVal(StValDefs.OrdLnSpecUsrInps.KyTxt(), ordLnSpecInpDict);
                }
                var ordLnSpecInpDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OrdLnSpecUsrInps.KyTxt());
                if (ordPadSpecId in ordLnSpecInpDict) {
                    ordLnSpecInpDict[ordPadSpecId].ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm);
                } else {
                    //SpecSrchInp.Get().RemAll().UpdateSession();
                    ordLnSpecInpDict[ordPadSpecId] = SpecSrchInp.Get().RemAll();
                    ordLnSpecInpDict[ordPadSpecId].ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm);
                }

                McMaster.SesnMgr.SetStVal(StValDefs.OrdLnSpecUsrInps.KyTxt(), ordLnSpecInpDict);
                var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.ORD_PAD);
                McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.OrdPadLnSpecSlctd(MSG_HDR, lnSeqNbr, partNbrTxt));

            }


            //Update the input element to reflect the selection or deselection
            toggleChkMark(inpElem);

            //Remember the position of the specification that was selected
            if (maintainScrollPosnInd) {
                SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Creates a message that tracks a deep link click
    //          We pass in the deep link attribute and value that's
    //          was clicked on. 
    //          Then we travel up the dom to find it's container
    //          and grab it's attribute and value.
    //          Then format the tracking message
    //------------------------------------------------------------
    var crteDeepLnkTrkMsg = function(inpElem, trkAttrValNm, trkAttrGrpNm) {
		
        var ancstr = getAttrByInnerElem(inpElem, LANDING_PG_ATTR_CLS_NM);
		var ancstrTrkAttrGrpNm = getClickedValParGrpNm(inpElem, ancstr);   
        var elems = Cmn.GetElementsByClsNm("PrsnttnHdrCntnr","div",ancstr);
        var ancstrTrkAttrGrpVal= Cmn.GetTxtContent(getCaptionLnkByInpElem(elems[0],"LandingPage"));  

        var trkMsg = "&Attribute=" + ancstrTrkAttrGrpNm 
                      + "&Value=" + ancstrTrkAttrGrpVal 
                      + "&Attribute=" + trkAttrGrpNm + "&Value=" + trkAttrValNm.Trim();
        
        return trkMsg;
    };
    
    //------------------------------------------------------------
    // Summary: 
    //------------------------------------------------------------
	var getClickedValParGrpNm = function(inpElem, ancstr) {
		
		var grpNm = "";
		if (inpElem && ancstr){
			var ancstrPubAttrId = getPubAttrIdFrmTxt(ancstr.id);
			grpNm = me.GetAttrNm(ancstrPubAttrId);   
		}
	 	
	 	return grpNm
	 };    
	 
    //------------------------------------------------------------
    // Summary: Processes the act of selecting a value in a dropdown.
    //------------------------------------------------------------
    var procssDropDwnValClick = function (prodAttrId, pubAttrId, prodValId, pubValId, inpElem, cntxtNm) {

        //Get a copy of the spec search input
        var sesnSpecInp = SpecSrchInp.Get();

        //Get the value of the option selected
        var newValTxt = inpElem.innerHTML;
        var ANY_VAL_TXT = "(Any)";

        //Figure out what to update
        if (newValTxt === ANY_VAL_TXT) {
            //The "(Any)" value is selected so clear out the attribute
            sesnSpecInp.RemAttr(prodAttrId, cntxtNm);
        } else if (prodAttrId && sesnSpecInp.ValExists(prodAttrId, prodValId, cntxtNm)) {
            //The visitor is deselecting a value that was already selected
            sesnSpecInp.RemAttr(prodAttrId, cntxtNm);
            newValTxt = ANY_VAL_TXT;
        } else if (prodAttrId && prodValId) {
            //The visitor is changing their selection.  First clear out 
            //all other filters in the attribute, since dropdowns are by 
            //nature single-select attributes, then toggle the value
            sesnSpecInp.RemAttr(prodAttrId, cntxtNm);
            sesnSpecInp.ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm);
        } else {
            //Do nothing.
        }

        // Update the value displayed in the dropdown menu
        var dropDownMnu = Cmn.GetAncestorBy(inpElem, getInpElemIsDropDwnMenu);
        var dropDownBtn = Cmn.GetPrevSibling(dropDownMnu, getInpElemIsDropDwnMenu);
        dropDownBtn.innerHTML = newValTxt;

        // Update session and publish the spec selected message
        sesnSpecInp.UpdateSession().PubMsg();
    };

    //------------------------------------------------------------
    // Summary: Handles processing of a "clear all" link click.
    // Input:   Validated click(ed) element
    //------------------------------------------------------------
    var procssClearAllLnkClick = function (inpElem, cntxtNm) {

        //Publish Spec Search Clear All Clicked message
        McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.ChooseSpecsClearAllClick(MSG_HDR));

        //reset the load indicator because an action has occurred
        McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);

        //Performance timer - Track the start of the click event
		var top = McMasterCom.Nav.GetTopFrame();
        var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntClrAll, top.PerfTracker.PgCntxtNms.DynCntnt);

        // Set up a round-trip web reports performance tracker.
        SpecInteractions.Webreports_TrkAct(cntxtNm, ACT.CLEAR_ALL, null, null, true, null, null, inpElem);

        //Immediately hide the "clear all" link to provide instant feedback
        Cmn.SetStyle(inpElem, "display", "none");

        //Scroll to the top of the specification search pane
        var specSrchCntnr = Cmn.GetObj("SpecSrch_Inner");
        Cmn.SetVerticalScrollPosn(specSrchCntnr, 0);

        //Close any open specification information presentations.
        SpecSrchWebPart.SpecInfo.Unload();

        // Commented out prior to product page change.      
        //            var loadFrmSesnInd = GetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt());
        //            if (!loadFrmSesnInd) {
        //clear the filters and update session 
        SpecSrchInp.Get().RemAll().UpdateSession();
        //clear dynamic page presentation stats
        McMaster.SesnMgr.RemStVal(StValDefs.DynamicPagePrsnttnStats.KyTxt());
        //publish a "specification selected" message
        McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.SpecSlctd(MSG_HDR));
        //            }

        //Web reports tracking
        SpecInteractions.Webreports_TrkTrip(cntxtNm);

        var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.SLCT });
        srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.CLR_ALL_SPECS_LNK;
        srchTrkInfo.usr.srcNm = getSrcNmFrmCntxt(cntxtNm);
        srchTrkInfo.Trk();
    };

    //------------------------------------------------------------
    // Summary: Handles clicks for dropdown buttons.
    // Input:   inpElem  - Validated clicked element
    //------------------------------------------------------------
    var procssDropDwnBtnClick = function (inpElem) {

        // Get the corresponding dropdown menu for the button that was selected
        var dropDownMenu = Cmn.GetNxtSiblingBy(inpElem, getInpElemIsDropDwnMenu);

        // If another dropdown menu is already open, close it
        if (mOpenDropDownMenu && dropDownMenu !== mOpenDropDownMenu) {
            SpecInteractions.ToggleDropDwnMenu(mOpenDropDownMenu);
        }

        // Open the dropdown menu
        SpecInteractions.ToggleDropDwnMenu(dropDownMenu);

        // Handle instances where the menu is scrolled off the screen
        procssDropDwnScrolledOffScreen(inpElem, dropDownMenu);

        // Scroll to the first selected value in the list
        scrollSlctdValsIntoView(dropDownMenu.parentNode);
    };

    //------------------------------------------------------------
    // Summary: Handles instances where a dropdown menu is
    //          scrolled off the bottom of the screen
    // Input:   dropDownBtn, dropDownMenu  - Dropdown button and menu
    //------------------------------------------------------------
    var procssDropDwnScrolledOffScreen = function (dropDownBtn, dropDownMenu) {

        // Reset the dropdown menu
        dropDownMenu.style.top = "";

        // Gather information about the spec search pane
        var cntnr = Cmn.GetObj("SpecSrch_Inner");
        var cntnrHeight = (cntnr.offsetHeight);
        var cntnrScrollPosn = Cmn.GetVerticalScrollPosn(cntnr);

        // Gether information about the dropdown button
        var dropDownBtnTop = Cmn.GetYOffset(dropDownBtn) - Cmn.GetYOffset(cntnr);
        var dropDownBtnHeight = dropDownBtn.offsetHeight;
        var dropDownBtnBottom = dropDownBtnTop + dropDownBtnHeight;

        // Gather information about the position of the dropdown menu
        var dropDownMenuTop = dropDownBtnBottom - 1; // remove one pixel so the borders overlap
        var dropDownMenuHeight = dropDownMenu.offsetHeight;
        var dropDownMenuBottom = dropDownMenuTop + dropDownMenuHeight;
        var relativeMenuBottom = dropDownMenuBottom - cntnrScrollPosn;
        var menuIsOffScreenInd = (relativeMenuBottom > cntnrHeight);

        // Determine the position of the dropdown menu based on whether it's off the screen
        if (menuIsOffScreenInd) {
            // If the dropdown menu is hanging off the screen, shift it up
            dropDownMenu.style.top = (dropDownBtnTop - dropDownMenuHeight + 1) + "px"; // remove one pixel so the borders overlap
        } else {
            // If the dropdown menu is not hanging off the screen, position it below the button
            dropDownMenu.style.top = (dropDownMenuTop) + "px";
        }
    };

    //------------------------------------------------------------
    // Summary: Toggles a dropdown menu's visibiility.
    // Input:   inpElem  - Validated clicked element
    //------------------------------------------------------------
    this.ToggleDropDwnMenu = function (dropDownMenu) {

        if (dropDownMenu) {
            var menuHiddenClsNm = 'SpecSrch_DropDownMenuHidden',
                    menuVisibleClsNm = 'SpecSrch_DropDownMenuVisible';

            // Swap the hidden/visibility classes
            swapClsNms(dropDownMenu, menuHiddenClsNm, menuVisibleClsNm);

            // Update the open dropdown menu
            if (Cmn.HasCls(dropDownMenu, menuVisibleClsNm)) {
                mOpenDropDownMenu = dropDownMenu;
            } else {
                mOpenDropDownMenu = null;
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Processes the hover event to let a visitor know
    //          that an element on the page is interactive.
    // Input:   inpElem  - Validated hover(ed) element
    //          hoverInd - True if the mouse is currently hovering over it
    //------------------------------------------------------------
    var procssHoverEvnt = function (inpElem, cntxtNm, hoverInd) {

        var hoverAction = (hoverInd) ? Cmn.AddCls : Cmn.RemCls;
        var pointerClsNm = "SpecSrch_Pointer";

        // Toggle the pointer
        if (inpElem) {
            hoverAction(inpElem, pointerClsNm);
        }

        // Handle other specific mouseover behaviors
        if (Cmn.HasCls(inpElem, "SpecSrch_Value") || Cmn.HasCls(inpElem, LANDING_PG_ATTR_CLS_NM) || Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal")) {
            // Handle values
            var imgLnk = getImgLnkByInpElem(inpElem, cntxtNm);
            var captionLnk = getCaptionLnkByInpElem(inpElem, cntxtNm);
            //            var deepLnkAttr = getDeepLnkAttrByInpElem(inpElem);
            var compositeRowElems = getCompositeRowElems(inpElem);
            //            var parCaptionLnk = getParLnkWithDeepLnkAttrElem(deepLnkAttr, VAL_SPEC_PAR_ELEM_ID_CD.CAPTION);
            //            var parImgLnk = getParLnkWithDeepLnkAttrElem(deepLnkAttr, VAL_SPEC_PAR_ELEM_ID_CD.IMG);
            //            


            // Handle the image, caption, and other elements (i.e. the "Any" dropdown value)
            var hoverClassNm = "SpecSrch_Value_Hover";
            if (compositeRowElems && compositeRowElems.length > 0) {
                // composite table value
                for (var i = 0; i < compositeRowElems.length; i++) {
                    hoverAction(compositeRowElems[i], hoverClassNm);
                }
            } else {
                if (imgLnk) {
                    if (cntxtNm && cntxtNm.toLowerCase() == "landingpage") {
                        //                        switch (true) {
                        ////                            case (Cmn.HasCls(imgLnk, "SpecSrch_SideBySideImgSpacing")):
                        ////                                hoverAction(imgLnk, "LandingPage_SideBySideImg_Hover");
                        ////                                break;
                        ////                            case (Cmn.HasCls(imgLnk, "SpecSrch_StackedImgSpacing")):
                        ////                                hoverAction(imgLnk, "LandingPage_StackedImg_Hover");
                        ////                                break;
                        ////                            case (Cmn.HasCls(imgLnk, "LandingPage_ComplexStackedImg")):
                        ////                                hoverAction(imgLnk, "LandingPage_ComplexStackedImg_Hover");
                        ////                                break;
                        //                            default:
                        //                                hoverAction(imgLnk, hoverClassNm);
                        //                        }
                    } else {
                        hoverAction(imgLnk, hoverClassNm);
                    }
                }


                if (captionLnk) {
                    if (cntxtNm && cntxtNm.toLowerCase() == "landingpage") {
                        switch (true) {
                            //                            case (Cmn.HasCls(captionLnk, "SpecSrch_SideBySideTxtPadding")):                        
                            //                                hoverAction(captionLnk, "LandingPage_SideBySideTxt_Hover");                        
                            //                                break;                        
                            //                            case (Cmn.HasCls(captionLnk, "LandingPage_StackedTxt")):                        
                            //                                hoverAction(captionLnk, "LandingPage_StackedTxt_Hover");                        
                            //                                break;                        
                            //                            case (Cmn.HasCls(captionLnk, "LandingPage_ComplexStackedTop")):                        
                            //                                hoverAction(captionLnk, "LandingPage_ComplexStackedTop_Hover");                        
                            //                                break;                        
                            //                            case (Cmn.HasCls(captionLnk, "LandingPage_DeepLnkVal")):                        
                            //                                hoverAction(captionLnk, "LandingPage_DeepLnkVal_Hover");                        
                            //                                break;                        
                            case (Cmn.HasCls(inpElem, "LandingPage_NoDeepLnks")):
                                break;
                            default:
                                hoverAction(captionLnk, "LandingPage_Val_Hover");
                        }
                    } else {
                        hoverAction(captionLnk, hoverClassNm);
                    }
                }


                //                if (deepLnkAttr) {
                //                    if (cntxtNm && cntxtNm.toLowerCase() == "landingpage") {
                //                        hoverAction(deepLnkAttr, "LandingPage_DeepLnkAttr_Hover");
                //                    }
                //                }
                //                
                //                if (parCaptionLnk) {
                //                    if (Cmn.HasCls(parCaptionLnk, "LandingPage_ComplexStackedTop")) {
                //                        hoverAction(parCaptionLnk, "LandingPage_ComplexStackedTop_Hover_Border");
                //                    }        
                //                }

                //                if (parImgLnk) {
                //                    if (Cmn.HasCls(parImgLnk, "LandingPage_ComplexStackedImg")) {
                //                        hoverAction(parImgLnk, "LandingPage_ComplexStackedImg_Hover");
                //                    }        
                //                }


                if (imgLnk == null && captionLnk == null && compositeRowElems.length === 0 && inpElem && deepLnkAttr == null && parCaptionLnk == null && parImgLnk == null) {
                    hoverAction(inpElem, hoverClassNm);
                }
            }

        } else if (Cmn.HasCls(inpElem, "SpecSrch_ClearAllLnk")) {
            // Handle the "clear all" link
            hoverAction(inpElem, "SpecSrch_ClearAllLnk_Hover");

        } else if (Cmn.HasCls(inpElem, "SpecSrch_MoreLnk")) {
            // Figure out what action should be applied
            var hoverAction = (hoverInd) ? Cmn.AddCls : Cmn.RemCls;
            var hoverClassNm = "SpecSrch_MoreLnk_Hover";
            hoverAction(inpElem, hoverClassNm);

        } else if (Cmn.HasCls(inpElem, "SpecSrch_GenInfoLnk")) {
            // Handle general info links
            if (hoverInd) {
                if (Cmn.HasCls(inpElem, "SpecSrch_GenInfoLnk_Slctd")) {
                    Cmn.ReplaceCls(inpElem, "SpecSrch_GenInfoLnk_Slctd", "SpecSrch_GenInfoLnk_Hover_Slctd");
                } else {
                    Cmn.AddCls(inpElem, "SpecSrch_GenInfoLnk_Hover");
                }
            } else {
                if (Cmn.HasCls(inpElem, "SpecSrch_GenInfoLnk_Hover_Slctd")) {
                    Cmn.ReplaceCls(inpElem, "SpecSrch_GenInfoLnk_Hover_Slctd", "SpecSrch_GenInfoLnk_Slctd");
                } else {
                    Cmn.RemCls(inpElem, "SpecSrch_GenInfoLnk_Hover");
                }
            }
        } else if (Cmn.HasCls(inpElem, "WebToolsetToolWebPart_TxtTool_Cntnr")) {
            hoverAction(inpElem, "WebToolsetToolWebPart_TxtTool_Cntnr_Hover");
        }
    };

    //------------------------------------------------------------
    // Summary: Toggles the checkmark on a specification
    // Input:   Markup element
    //------------------------------------------------------------
    var toggleChkMark = function (inpElem) {

        var chkMarkElem = getCompositeValChkMarkElem(inpElem)
                           || getImgLnkByInpElem(inpElem)
                           || getCaptionLnkByInpElem(inpElem);

        //Assign a special selected value style for touch devices.
        if (Cmn.IsTouchAware() === true && Cmn.HasCls(inpElem, "SpecSrch_Img") === false) {
            toggleClsNm(chkMarkElem, "Touch_SpecSrch_SlctdVal");
        } else {
            toggleClsNm(chkMarkElem, "SpecSrch_SlctdVal");
        }
    };

    //------------------------------------------------------------
    //------------------------------------------------------------
    // Summary: Toggles the class name on a specification
    // Input:   Markup element
    //------------------------------------------------------------
    var toggleClsNm = function (inpElem, aClsNm) {

        if (Cmn.HasCls(inpElem, aClsNm)) {
            Cmn.RemCls(inpElem, aClsNm);
        } else {
            Cmn.AddCls(inpElem, aClsNm);
        }
    };

    //------------------------------------------------------------
    // Summary: Swaps one class name for another.
    // Input:   Markup element and two CSS class names
    //------------------------------------------------------------
    var swapClsNms = function (inpElem, aClsNm, bClsNm) {
        switch (true) {
            case (Cmn.HasCls(inpElem, aClsNm)):
                Cmn.ReplaceCls(inpElem, aClsNm, bClsNm);
                break;
            case (Cmn.HasCls(inpElem, bClsNm)):
                Cmn.ReplaceCls(inpElem, bClsNm, aClsNm);
                break;
            default:
                //do nothing
        }
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a value.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsVal = function (inpElem) {
        var rtnInd = false;
        if (Cmn.HasCls(inpElem, "SpecSrch_Value") || Cmn.HasCls(inpElem, LANDING_PG_ATTR_CLS_NM)
         || Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal")) {
			if (Cmn.HasCls(inpElem, "oldStylSpecVal") == false){
				rtnInd = true;
			}
        }
        return rtnInd;
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a dropdown button.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsDropDwnBtn = function (inpElem) {
        return (Cmn.HasCls(inpElem, "SpecSrch_DropDownBtn"));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a dropdown menu.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsDropDwnMenu = function (inpElem) {
        return (Cmn.HasCls(inpElem, 'SpecSrch_DropDownMenu'));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a value in a dropdown menu.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsDropDwnVal = function (inpElem) {
        return (!!Cmn.GetAncestorBy(inpElem, getInpElemIsDropDwnMenu));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a specification
    //          information link
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsSpecInfoLnk = function (inpElem) {
        return (Cmn.HasCls(inpElem, "SpecSrch_GenInfoLnk"));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is the 
    //          "Clear All" link
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsClearAllLnk = function (inpElem) {
        return (Cmn.HasCls(inpElem, "SpecSrch_ClearAllLnk"));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a toggle link,
    //          i.e. "show/hide" link.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsToggleLnk = function (inpElem) {
        return (Cmn.HasCls(inpElem, "SpecSrch_MoreLnk"));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element or an ancestor
    //          is an opt-out link on a landing page.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsOptOutLnk = function (inpElem) {
        return (Cmn.HasCls(inpElem, "WebToolsetToolWebPart_TxtTool_Cntnr"));
    };


    //------------------------------------------------------------
    // Summary: Returns true if the given element or an ancestor
    //          is a deep link attribute.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsDeepLnkAttrInd = function (inpElem) {
        if (Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal") ||
        Cmn.GetAncestorByClsNm(inpElem, "LandingPage_DeepLnkVal")) {
            return true;
        }
        if (Cmn.HasCls(inpElem, "LandingPage_ComplexStackedDeepLnks")) {
            return true;
        } else if (Cmn.GetAncestorByClsNm(inpElem, "LandingPage_ComplexStackedDeepLnks")) {
            return true;
        } else {
            return false;
        }
    };


    //------------------------------------------------------------
    // Summary: Retreives the deep link attribute element that's identified 
    //          by the given input element.
    // Input:   The input target element
    // Return:  A reference to the link containing that element's deep links.
    //------------------------------------------------------------
    var getDeepLnkAttrByInpElem = function (inpElem) {

        var rtnElem;

        if (Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal")) {
            rtnElem = Cmn.GetAncestorByClsNm(inpElem, "LandingPage_ComplexStackedDeepLnks");
        } else {
            // If a value has deep links, then the input element should have a "rel" attribute that
            // allows us to get the deep link attribute element.
            var relAttribute = inpElem.getAttribute("rel");
            if (relAttribute) {
                var valSpecAttributeTxt = relAttribute.split(":")[1];
                var valSpecProdAttrId = valSpecAttributeTxt.split("_")[0];
                var valSpecPubAttrId = valSpecAttributeTxt.split("_")[1];

                deepLnkAttr = Cmn.GetObj("LP_E_" + valSpecProdAttrId + "_" + valSpecPubAttrId);
                rtnElem = Cmn.GetAncestorByClsNm(deepLnkAttr, "LandingPage_ComplexStackedDeepLnks");
            }
        }

        return rtnElem;
    };


    //------------------------------------------------------------
    // Summary: Retrieves the parent value's caption element 
    // Input:   Markup element
    //------------------------------------------------------------
    var getParLnkWithDeepLnkAttrElem = function (inpElem, parElemIdCode) {

        var rtnElem;

        var deepLnkAttrElem;
        if (Cmn.HasCls(inpElem, "LandingPage_ComplexStackedDeepLnks")) {
            deepLnkAttrElem = inpElem;
        } else {
            deepLnkAttrElem = Cmn.GetAncestorByClsNm(inpElem, "LandingPage_ComplexStackedDeepLnks");
        }

        if (Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal")) {
            deepLnkAttrElem = inpElem;
        } else {
            deepLnkAttrElem = Cmn.GetAncestorByClsNm(inpElem, "LandingPage_DeepLnkVal");
        }


        if (deepLnkAttrElem) {
            // Get the first deep link value. The html for this element will have a rel attribute from which we can
            // get the parent caption link
            var firstDeepLnkValElem = Cmn.GetElementsByClsNm("LandingPage_DeepLnkVal", "div", deepLnkAttrElem)[0];
            if (firstDeepLnkValElem) {
                var relAttribute = firstDeepLnkValElem.getAttribute("rel");

                var parAttributeTxt = relAttribute.split(":")[1];
                var parValTxt = relAttribute.split(":")[3];

                var parProdAttrId = parAttributeTxt.split("_")[0];
                var parPubAttrId = parAttributeTxt.split("_")[1];

                var parProdValId = parValTxt.split("_")[0];
                var parPubValId = parValTxt.split("_")[1];

                parLnk = Cmn.GetObj("LP_E_" + parProdAttrId + "_" + parPubAttrId + "_" + parElemIdCode + "_" + parProdValId + "_" + parPubValId);
                if (parLnk) {
                    rtnElem = getVldClickElem(parLnk) || Cmn.GetAncestorBy(parLnk, getVldClickElem);
                }
            }
        }

        return rtnElem;
    };

    //------------------------------------------------------------  
    // <summary>
    // Get the part number link on which the user clicked based on the 
    // class name passed through. 
    // </summary>
    // <param name="partNbrTxt">The part number text.</param>
    // <param name="clsNm">The class name on the part number link we're seeking.</param>
    // <remarks> The class name indicates whether or not the box has been opened.</remarks>
    //------------------------------------------------------------
    var fndPartNbrLnkByClsNm = function (partNbrTxt, clsNm, seqNbr) {
        var slctdPartNbrIdx;
        
        var CmnObjJs = null;
        if (chkCtlgPageInd()){
            CmnObjJs = McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog.Cmn;
        }else{
            CmnObjJs = Cmn;
        }
        
        var partNbrLnks = CmnObjJs.GetElementsByClsNm(clsNm, "a");

        // Look through part number links and find the one with the 
        // passed in class name and part number text as innerHTML 
        // that is in a table.  We want to ignore 
        // links not in a table, since we can not open our box for them.
        for (var lnkIdx = 0; lnkIdx < partNbrLnks.length; lnkIdx++) {
            if (partNbrLnks[lnkIdx].innerHTML == partNbrTxt &&
                partNbrLnks[lnkIdx].parentNode.tagName == "TD" && 
                seqNbr == partNbrLnks[lnkIdx].getAttribute("data-mcm-partnbr-seqnbr")) {
                slctdPartNbrIdx = lnkIdx;
                break;
            }
        }
        return partNbrLnks[slctdPartNbrIdx];
    }
    //------------------------------------------------------------
    // Summary: Retreives the product version of the attribute id 
    //          from the markup id
    // Input: element's id attribute
    // Return: String of specification's product attribute id
    //------------------------------------------------------------
    var getProdAttrIdFrmTxt = function (elemIdTxt) {
        return elemIdTxt.split('_')[2];
    };

    //------------------------------------------------------------
    // Summary: Retreives the publishing version of the attribute id 
    //          from the markup id
    // Input: element's id attribute
    // Return: String of specification's publishing attribute id
    //------------------------------------------------------------
    var getPubAttrIdFrmTxt = function (elemIdTxt) {
        return elemIdTxt.split('_')[3];
    };

    //------------------------------------------------------------
    // Summary: Retreives the prefix id text from the markup id
    //          of a value in a composite table.
    // Input: element's id attribute
    // Return: Prefix string of specification's attribute id
    //------------------------------------------------------------      
    var getCompositeValIdPrefixTxt = function (elemIdTxt) {
        // Split on delimiter
        var splitTxt = elemIdTxt.split("_");

        // remove the digit suffix
        splitTxt.pop();

        return splitTxt.join("_");
    };

    //------------------------------------------------------------
    // Summary: Retreives the product version of the value id 
    //          from the markup id
    // Input: element's id attribute
    // Return: String of specification's product value id
    //------------------------------------------------------------
    var getProdValIdFrmTxt = function (elemIdTxt) {
        return elemIdTxt.split('_')[5];
    };

    //------------------------------------------------------------
    // Summary: Retreives the publishing version of the value id 
    //          from the markup id
    // Input: element's id attribute
    // Return: String of specification's publishing value id
    //------------------------------------------------------------
    var getPubValIdFrmTxt = function (elemIdTxt) {
        return elemIdTxt.split('_')[6];
    };

    //------------------------------------------------------------
    // Summary: Retreives the type of value from the markup id
    // Input: element's id attribute
    // Return: A short string of the specification's type of data.
    //         This could be things like T(ext), I(mage), or
    //         T(ext)O(nly), etc.
    //------------------------------------------------------------
    var getValTypFrmTxt = function (elemIdTxt) {
        return elemIdTxt.split('_')[4];
    };

    //------------------------------------------------------------
    // Summary: Retreives an attribute given an element inside it.
    // Input:   An element within the attribute
    // Return:  A reference to the attribute containing that element.
    //------------------------------------------------------------
    var getAttrByInnerElem = function (inpElem, clsNm) {
 
        //default to spec search attribute class name   
        if (clsNm == undefined || clsNm.length === 0) {
            clsNm = SPEC_SRCH_ATTR_CLS_NM;   
        }
        
        if (Cmn.HasCls(inpElem, clsNm)) {
            // Return the element itself since it's the attribute
            return inpElem;
        } else {
            // Return the nearest ancestor that's an attribute
            return Cmn.GetAncestorByClsNm(inpElem, clsNm);
        }
    };

    //------------------------------------------------------------
    // Summary: Returns the element that's visible for the given ID.
    // Input:   An element ID
    // Returns: The element with the given ID, or its complementary
    //          element -- whichever one is visible at the time.
    //------------------------------------------------------------          
    getVisibleElemById = function (idTxt) {

        var elemA = Cmn.GetObj(idTxt),
                elemB = getComplementaryElemById(idTxt);

        if (getElemIsVisible(elemA)) {
            return elemA;
        } else if (getElemIsVisible(elemB)) {
            return elemB;
        } else {
            return null;
        }
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is visible.
    // Input:   An HTML element
    //------------------------------------------------------------          
    var getElemIsVisible = function (elem) {

        var attr = (elem) ? getAttrByInnerElem(elem,SPEC_SRCH_ATTR_CLS_NM) : null;
        return (attr && Cmn.HasCls(attr, "SpecSrch_AttrShow") && attr.style.display !== "none");
    };

    //------------------------------------------------------------
    // Summary: Returns the html element that complements the
    //          display state of the passed-in attribute container.
    // Input:   Validated click(ed) element
    //------------------------------------------------------------          
    var getComplementaryElemById = function (idTxt) {

        var complementaryIdTxt = "";

        if (idTxt.indexOf("_C_") >= 0) {
            complementaryIdTxt = idTxt.replace("_C_", "_E_");
        } else {
            complementaryIdTxt = idTxt.replace("_E_", "_C_");
        }

        return Cmn.GetObj(complementaryIdTxt);
    };

    //------------------------------------------------------------
    // Summary: Returns the caption for the given image element, or vice versa.
    // Input:   Validated click(ed) element
    //------------------------------------------------------------          
    var getComplementaryImgTxtElemById = function (inpElem) {

        var complementaryIdTxt = "";

        if (inpElem.id.indexOf("_I_") >= 0) {
            complementaryIdTxt = inpElem.id.replace("_I_", "_T_");
        } else {
            complementaryIdTxt = inpElem.id.replace("_T_", "_I_");
        }

        var idEq = function (elem) {
            return elem.id == complementaryIdTxt
        }

        return Cmn.GetElementBy(idEq, null, Cmn.GetAncestorByTagNm(inpElem, "table"));
    };

    //------------------------------------------------------------
    // Summary: Retreives the image link that's identified 
    //          by the given input element.
    // Input:   The input target element
    // Return:  A reference to the link containing that element's image.
    //------------------------------------------------------------
    var getImgLnkByInpElem = function (inpElem, cntxtNm) {
        var imgElem = null;
        if (cntxtNm && cntxtNm.toUpperCase() == "LANDINGPAGE" && inpElem) {
            var imgElems = Cmn.GetElementsByClsNm("ImgsCntnr", "div", inpElem);
            if (imgElems && imgElems.length > 0) {
                imgElem = imgElems[0];
            }

        } else {
            if (inpElem.id.indexOf("_I_") >= 0) {
                // The given element was the image
                imgElem = inpElem;
            } else {
                // Return the image
                imgElem = getComplementaryImgTxtElemById(inpElem);
            }
        }
        return imgElem;
    };

    //------------------------------------------------------------
    // Summary: Retreives the caption link that's identified 
    //          by the given input element.
    // Input:   The input target element
    // Return:  A reference to the link containing that element's caption.
    //------------------------------------------------------------
    var getCaptionLnkByInpElem = function (inpElem, cntxtNm) {
        var captionElem = null;
        if (cntxtNm && cntxtNm.toUpperCase() == "LANDINGPAGE" && inpElem) {
            if (Cmn.HasCls(inpElem, "PrsnttnHdrCntnr")) {
                captionElem = inpElem;
            } else {
                var captionElems = Cmn.GetElementsByClsNm("PrsnttnHdrCntnr", "div", inpElem);
                if (captionElems && captionElems.length > 0) {
                    captionElem = captionElems[0];
                }
            }

        } else {
            if (inpElem.id.indexOf("_T_") >= 0) {
                // The given element is the caption
                captionElem = inpElem;
            } else {
                // Return the caption
                captionElem = getComplementaryImgTxtElemById(inpElem);
            }
        }
        
        return captionElem;
    };
    
    //------------------------------------------------------------
    // <summary>
    // Given an HTMLelement from an order line, determines the sequence
    // number of the order line.
    // </summary>
    // <param name="elemOrId">
    // An HTML element or the ID of an HTML element found within an order
    // line.
    // </param>
    // <returns>
    // The sequence number of the order line that contains the specified
    // element or -1 if no sequence is found.
    // </returns>
    //------------------------------------------------------------
    var getLnSeqFrmLnElem = function (elemOrId) {
        var rtnLnSeq = -1;
        var ordLnRow;

        ordLnRow = Cmn.GetAncestorByClsNm(elemOrId, "OrdPadProdsWebPart_LnRow")

        // This check is here to avoid errors when the calling code passes
        // an element in that actually isn't in an order line row.
        if (ordLnRow && ordLnRow.className) {
            var clsNms = ordLnRow.className.split(" ");

            for (var clsIdx = 0; clsIdx < clsNms.length; clsIdx++) {
                if (mLnSeqRegex.test(clsNms[clsIdx])) {
                    rtnLnSeq = clsNms[clsIdx].match(mNbrRegex)[0];
                    break;
                }
            }
        }

        return rtnLnSeq;
    };
    //------------------------------------------------------------
    // Summary: Retreives the elements associated with a visual
    //          row of values in a composite table (e.g. Overall Size).
    // Input:   The input target element
    // Return:  An array of associated elements.
    //------------------------------------------------------------
    var getCompositeRowElems = function (inpElem) {
        var rtnVal = [];

        if (isCompositeVal(inpElem)) {
            var prefixTxt = getCompositeValIdPrefixTxt(inpElem.id);

            // HACK
            // There's no way at the moment to know how many implicit
            // sibling composite table values are present.  The code
            // below is arbitrary.
            for (var i = 1; i <= 3; i++) {
                var siblingElem = Cmn.GetObj(prefixTxt + "_" + i);
                if (siblingElem) { rtnVal.push(siblingElem); }
            }
        }

        return rtnVal;
    };

    //------------------------------------------------------------
    // Summary: Returns the html element of the value in a composite
    //          that should have a checkmark.
    //          
    // Input:   The input target element
    // Return:  First element in composite table visual row.  If
    //          passed-in value is not a value in a composite table,
    //          returns null;
    //------------------------------------------------------------      
    var getCompositeValChkMarkElem = function (inpElem) {
        var rtnVal = null;

        if (isCompositeVal(inpElem)) {
            var prefixTxt = getCompositeValIdPrefixTxt(inpElem.id);
            var frstElemInRow = Cmn.GetObj(prefixTxt + "_1");
            if (frstElemInRow) { rtnVal = frstElemInRow; }
        }

        return rtnVal;
    };

    //------------------------------------------------------------
    // Summary: Retreives true if the passed-in value is part of a
    //          composite table.
    // Input:   The input target element
    // Return:  An array of associated elements.
    //------------------------------------------------------------      
    var isCompositeVal = function (inpElem) {
        return (inpElem.id.indexOf("compositevalue") >= 0);
    };

    //-------------------------------------------------------------------------
    // <summary>
    // Check catalog page or dynamic page
    // </summary>
    //-------------------------------------------------------------------------
    var chkCtlgPageInd = function(){
        var ctlgPageInd = false;
        var prodPageObj = Cmn.GetObj("ProdPageContent");
        if (prodPageObj) {
            //we are in dynamic page
        }else{
            ctlgPageInd = true;
        }
        return ctlgPageInd;
    }
	
	//-------------------------------------------------------------------------
    // <summary>
    // Determine the web part that the customer interacted with
    // </summary>
    //-------------------------------------------------------------------------
	var getSrcNmFrmCntxt = function(cntxtNm) {
	
		var srcNm = "";
	
		if (cntxtNm === CNTXT.LANDING_PAGE) {
			srcNm = "LandingPageWebPart";
		} else if (cntxtNm === CNTXT.CHOOSE_SPECS) {
			srcNm = "SpecSrchWebPart";
		} else if (cntxtNm === CNTXT.IN_LN_ORD) {
		    srcNm = "InLnOrdWebPart";
		} else {
			srcNm = "SpecInteractions";
		}
		
		return srcNm;
		
	};
	
	
	// <summary>Sets cursor to specified position within text elem. </summary>
	// <param name="elem">Input e.g. textarea</param>
	// <param name="posn">Zero based index in elem's current value. </param>
	var setCursorPosn = function(elem, posn){
		if(elem.setSelectionRange) {
			elem.focus();
			elem.setSelectionRange(posn,posn);
		} else if (elem.createTextRange) {
			var range = elem.createTextRange();
			range.collapse(true);
			range.moveEnd('character', posn);
			range.moveStart('character', posn);
			range.select();
		}
	}
	
	
	
	// <summary>Counts occurrences of substring.</summary>
	// <param name="find">The substring to search for.</param>
	// <param name="str">The text to be searched through.
	// Does not alter original str.</param>
	// <param name="until"> Non-inclusive char index to stop searching at. </param>
	// <returns>Count.</returns>
	var countAllSubstr = function(find,str,until){
		until = until || str.length;
		var start = 0;
		var count = 0;
		while(str.indexOf(find,start) >= 0){
			start = str.indexOf(find,start) + 1;
			if (start - 1 < until){
				count ++;
			}
		}
		return count;
	}
			
	// <summary>Gets character code from most recent key event.</summary>
	// <param name="keycd">event.keyCode</param>
	// <param name="chcd">event.charCode</param>
	// <param name="wch">event.which</param>
	// <returns>ASCII code for most recent key event.</returns>
	var getKey = function(kycd,chcd,wch){
		if (wch == null){
			return kycd;
		} else if (wch != 0 && chcd != 0){
			return wch;
		} else {
			return 0;
		}
	}
	
	// <summary>Checks that text fits within line restrictions.
	// A line is defined by the newline character only. </summary>
	// <param name="text">Text to verify.</param>
	// <param name="lnLmt">Maximum lines.</param>
	// <returns>True if text conforms to restrictions.</returns>
	var verifyDimensions = function(txt,lnLmt){
		// lnLmt is default to 0 if unlimited.
		return lnLmt ? txt.split("\n").length <= lnLmt : true;
	}
	
	// <summary>Explicitly enters a printable keystroke into a text field.</summary>
	// <param name="key">ASCII code of the key event.</param>
	// <param name="sel"> Object containing left and right indexes of selected text. </param>
	// <param name="txt">Original text to operate on. Does not modify original.</param>
	var applyPrintableChar = function(key,sel,txt){
		//valid for printable unicode characters
		leftCursorPosn = sel.start;
		rightCursorPosn = sel.end;
		var preTxt = txt.substring(0,leftCursorPosn);
		var postTxt = txt.substring(rightCursorPosn);
		if (key == UNICODE_CARRIAGE_RETURN) {
			// change carriage return to newline
			key = UNICODE_LINE_FEED;
		}
		// Move cursor outside of a soft break to keep it invisible to users.
		// This is not as strict as it could be, but it doens't need to be strict.
		if (leftCursorPosn > 0 && txt[leftCursorPosn] === "\n" && txt[leftCursorPosn-1] === ZERO_WIDTH_SPACE){
			preTxt = preTxt.slice(0,-1);
			sel.start --;
		}
		if (rightCursorPosn > 0 && txt[rightCursorPosn] === "\n" && txt[rightCursorPosn-1] === ZERO_WIDTH_SPACE){
			postTxt = ZERO_WIDTH_SPACE + postTxt;
			//for symmetry we should also shift sel.end here but we don't because it's never referenced again
		}
		sel.start ++;
		return preTxt + String.fromCharCode(key) + postTxt;
	}
	
	// <summary>Explicitly enters a printable keystroke into a text field.</summary>
	// <param name="key">ASCII code of the key event.</param>
	// <param name="sel"> Object containing left and right indexes of selected text. </param>
	// <param name="txt">Original text to operate on. Does not modify original.</param>
	// <returns>Text with characters deleted from proper locations.</returns>
	var applyDeletion = function(key, sel, txt){
		var leftCursorPosn = sel.start;
		var rightCursorPosn = sel.end;
		if (key == UNICODE_BACKSPACE){
			// backspace
			if (leftCursorPosn == rightCursorPosn) {
				var preTxt = txt.substring(0,leftCursorPosn-1);
				var postTxt = txt.substring(rightCursorPosn);
				sel.start --;
				// If backspacing a soft wrap, cleans up ZWS as well.
				// Makes our implementation of soft wrapping invisible to users.
				if (leftCursorPosn > 1 &&
					txt[leftCursorPosn-1] === "\n" && txt[leftCursorPosn-2] === ZERO_WIDTH_SPACE){
					preTxt = preTxt.slice(0,-1);
					sel.start --;
					// If deleting a soft wrap between words, deletes space between words.
					if (leftCursorPosn > 2 && 
						(txt[leftCursorPosn-3] === ZERO_WIDTH_SPACE || txt[leftCursorPosn-3] === " ")){
						preTxt = preTxt.slice(0,-1);
						sel.start --;
					}
				// Or if you're backspacing a ZWS inside a softwrap, delete the visible part (the previous char).
				} else if (leftCursorPosn > 1 &&
					txt[leftCursorPosn] === "\n" && txt[leftCursorPosn-1] === ZERO_WIDTH_SPACE){
					preTxt = preTxt.slice(0,-1);
					sel.start --;
					postTxt = postTxt.substring(1);
				}
			} else {
				var preTxt = txt.substring(0,leftCursorPosn);
				var postTxt = txt.substring(rightCursorPosn);
			}
			return preTxt + postTxt;
			
		} else if (key == UNICODE_DELETE){
			// delete 
			if (leftCursorPosn == rightCursorPosn){ 
				var preTxt = txt.substring(0,leftCursorPosn);
				var postTxt = txt.substring(leftCursorPosn+1);
			} else {
				var preTxt = txt.substring(0,leftCursorPosn);
				var postTxt = txt.substring(rightCursorPosn);
			}
			// If ZERO_WIDTH_SPACE<cursor>\n don't delete the ZWS. It effectively adds a space
			// to the end of the line if there's room and then repeated deletes don't do anything. Maybe the
			// expected behavior would be to delete the first char on the next line in addition to the \n but
			// I don't think it's worthwhile to worry about right now.
			return preTxt + postTxt;
		}
	}
	
	// <summary>Splits line into words, treating spaces as words also.</summary>
	// <param name="line">A string of characters containing no linebreaks.</param>
	// <returns>An array of each word and -space- in lines.</returns>
	var splitLineIntoWords = function(line){
		var charIdx = 0;
		var words = [];
		var word = "";
		while (charIdx < line.length){
			if (line[charIdx] != " "){
				//add each char to current word
				word += line[charIdx];
			} else {
				//We've reached a -space-:
				//Push current word onto array, reset
				//current word, push -space- onto array.
				words.push(word);
				word = "";
				words.push(line[charIdx]);
			}
			charIdx ++;
		}
		words.push(word);
		return words;
	}
	
	// <summary>Creates object holding the indexes of the beginning 
	// and end of a text selection. The .start field holds the lower index.
	// The .end field holds the upper index. </summary>
	// <param name="box"> The editable content that the selection was made in. </param>
	var getSelection = function(box){
		var sel = {start: box.selectionStart, end: box.selectionEnd};
		if (sel.start > sel.end) {
			var tmp = sel.start;
			sel.start = sel.end;
			sel.end = tmp;
		}
		return sel;
	}
	
	// <summary>Find and replace all.</summary>
	// <param name="find">The substring to search for.</param>
	// <param name="rplc">The replacement substring.</param>
	// <param name="str">The text to be searched through. 
	// Does not alter original str.</param>
	// <returns>String with all replacements made.</returns>
	var replaceAllSubstr = function(find,rplc,str){
		var rplcd = str.replace(find,rplc);
		while(rplcd != rplcd.replace(find,rplc)){
			rplcd = rplcd.replace(find,rplc);
		}
		return rplcd;
	}
	
	// <summary>Wraps text optimally from top to bottom, honoring user provided whitespace.</summary>
	// <param name="txt">Text to be wrapped. Original text is not modified.</param>
	// <param name="colLmt">Maximum characters per line.</param>
	// <returns>Our implementation of wrapped text.</returns>
	var wrapAlgthm = function(txt, colLmt){
		//If column limit is specified, we do the wrapping. Otherwise let the browser handle it.
		//make 0 constant
		if (colLmt > 0){
			// remove 'soft breaks' 
			var softBreak = ZERO_WIDTH_SPACE + "\n";
			
			txt = replaceAllSubstr(softBreak,"",txt);
			
			// convert hidden real spaces at beginning/end of lines back to visible spaces
			txt = replaceAllSubstr(ZERO_WIDTH_SPACE," ",txt);
			
			// split into lines to honor 'hard breaks'
			var lines = txt.split("\n");
			var newFrmt = [];
			for (var i = 0; i < lines.length; i ++){
				var bldLn = "";
				var spaceRem = colLmt;
				
				// split line into words. treat -space- as a word
				var words = splitLineIntoWords(lines[i]);
				
				// handles the actual wrapping
				for (var j = 0; j < words.length; j ++){
					if(words[j] == " ") {
						// add a space if it's not the first char
						if (spaceRem < colLmt && spaceRem >= 1) {
							bldLn += words[j];
						}
						// if -space- added at end of line, treat as soft break
						if (spaceRem == 0){
							bldLn += ZERO_WIDTH_SPACE;
							// add duplicate zwsp to tag it as a real -space-
							bldLn += ZERO_WIDTH_SPACE;
							newFrmt.push(bldLn);
							bldLn = "";
						}
						
					} else {
						if (words[j].length <= spaceRem){
							//fits on the line
							bldLn += words[j];
						} else if (words[j].length > spaceRem && words[j].length <= colLmt) {
							//wrap whole word to next line
							bldLn += ZERO_WIDTH_SPACE;
							newFrmt.push(bldLn);
							bldLn = words[j];
						} else {
							var reallyBigWord = words[j];
							while (reallyBigWord.length > colLmt){
								//word longer than line. 
								//fit what you can on current line, wrap the rest.
								bldLn += reallyBigWord.substring(0,spaceRem) + ZERO_WIDTH_SPACE;
								newFrmt.push(bldLn);
								reallyBigWord = reallyBigWord.substring(spaceRem);
								bldLn = "";
								spaceRem = colLmt - bldLn.length;
							}
							bldLn = reallyBigWord;
						} 
					}
					spaceRem = colLmt - bldLn.length;
				}
				newFrmt.push(bldLn);
			}
			return newFrmt.join("\n");
		} else {
			return txt;
		}
	}
	
	
};
}

(function(){if(this.SpecSrchInp){}else{var g="ContextualSrch",c="PubAttrId",i="PubValId",j="ArgTxt",d="SlctdVals",e="SelTyp",a="SeqNbr",f="LastExplicitlyExpandedAttrId";var b=McMaster.SesnMgr.GetStVal,h=McMaster.SesnMgr.StValDefs;SpecSrchInp=function(){this.mUsrInps={};this.mUsrInps.SpecSrchFilters={};this.mUsrInps.LandingPageFilters={};this.mUsrInps.ProdFilters={};this.mUsrInps.IntermediatePageFilters={};this.mUsrInps.Sequence=0;this.mUsrInps.LastDeselectedAttr=0;this.mUsrInps.LastDeselectedPubAttr=0;this.mUsrInps.LastDeselectedValId=0;this.mUsrInps.LastExplicitlyExpandedAttr=0;this.mUsrInps.PreSlctdAttrIds=new Array();this.mUsrInps.TopLevelLandingPageProdAttrIds=new Array();};SpecSrchInp.Create=function(l){var k=new SpecSrchInp();if(l==null){}else{k.mUsrInps=l;}return k;};SpecSrchInp.Get=function(){var k=b(h.SpecUsrInps.KyTxt())||null;return SpecSrchInp.Create(k);};SpecSrchInp.prototype.AttrExists=function(l,k){if(this.SpecSrchFilters()[l]&&k==McMaster.MsgMgr.CntxtNms.CHOOSE_SPECS||this.LandingPageFilters()[l]&&k==McMaster.MsgMgr.CntxtNms.LANDING_PAGE||this.SpecSrchFilters()[l]&&k==McMaster.MsgMgr.CntxtNms.INLN_ORD||this.SpecSrchFilters()[l]&&k==McMaster.MsgMgr.CntxtNms.ORD_PAD||this.SpecSrchFilters()[l]&&k==McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN){return true;}else{return false;}};SpecSrchInp.prototype.AttrUsrInpEmptyInd=function(l,k){var m=this.GetAttr(l,k);if(Cmn.Utilities.Empty(m.SlctdVals)&&Cmn.Utilities.Empty(m.ContextualSrch)){return true;}else{return false;}};SpecSrchInp.prototype.ProdAttrExists=function(k){if(this.ProdFilters()[k]){return true;}else{return false;}};SpecSrchInp.prototype.PubAttrExists=function(k){if(this.IntermediatePageFilters()[k]){return true;}else{return false;}};SpecSrchInp.prototype.AddAttr=function(m,k){if(!this.AttrExists(m,k)){var l;if(k==McMaster.MsgMgr.CntxtNms.LANDING_PAGE){l=this.LandingPageFilters();}else{l=this.SpecSrchFilters();}l[m]={};l[m][g]=[];l[m][d]={};}return this;};SpecSrchInp.prototype.AddProdAttr=function(l){if(!this.ProdAttrExists(l)){var k=this.ProdFilters();k[l]={};k[l][g]=[];k[l][d]={};}return this;};SpecSrchInp.prototype.AddPubAttr=function(l){if(!this.PubAttrExists(l)){var k=this.IntermediatePageFilters();k[l]={};k[l][g]=[];k[l][d]={};}return this;};SpecSrchInp.prototype.GetAttr=function(l,k){this.AddAttr(l,k);if(k==McMaster.MsgMgr.CntxtNms.LANDING_PAGE){return this.LandingPageFilters()[l];}else{return this.SpecSrchFilters()[l];}};SpecSrchInp.prototype.GetPubAttr=function(k){this.AddPubAttr(k);return this.IntermediatePageFilters()[k];};SpecSrchInp.prototype.GetAttrSlctdVals=function(l,k){return this.GetAttr(l,k)[d];};SpecSrchInp.prototype.GetPubAttrSlctdVals=function(l,k){return this.GetPubAttr(l)[d];};SpecSrchInp.prototype.RemAttr=function(l,k){if(this.AttrExists(l,k)){if(k==McMaster.MsgMgr.CntxtNms.LANDING_PAGE){delete this.mUsrInps.LandingPageFilters[l];}else{delete this.mUsrInps.SpecSrchFilters[l];}}return this;};SpecSrchInp.prototype.RemProdAttr=function(k){if(this.ProdAttrExists(k)){delete this.mUsrInps.ProdFilters[k];}return this;};SpecSrchInp.prototype.RemPubAttr=function(k){if(this.PubAttrExists(k)){delete this.mUsrInps.IntermediatePageFilters[k];}return this;};SpecSrchInp.prototype.RemAttrs=function(m,l){for(var k in m){if(m.hasOwnProperty(k)){this.RemAttr(m[k],l);}}return this;};SpecSrchInp.prototype.RemPubAttrs=function(l){for(var k in l){if(l.hasOwnProperty(k)){this.RemPubAttr(l[k]);}}return this;};SpecSrchInp.prototype.Clone=function(){var k=new SpecSrchInp;k.mUsrInps=this.mUsrInps;k.mUsrInps.SpecSrchFilters=this.mUsrInps.SpecSrchFilters;k.mUsrInps.LandingPageFilters=this.mUsrInps.LandingPageFilters;k.mUsrInps.ProdFilters=this.mUsrInps.ProdFilters;k.mUsrInps.IntermediatePageFilters=this.mUsrInps.IntermediatePageFilters;k.mUsrInps.Sequence=this.mUsrInps.Sequence;k.mUsrInps.LastDeselectedAttr=this.mUsrInps.LastDeselectedAttr;k.mUsrInps.LastDeselectedPubAttr=this.mUsrInps.LastDeselectedPubAttr;k.mUsrInps.LastDeselectedValId=this.mUsrInps.LastDeselectedValId;k.mUsrInps.LastExplicitlyExpandedAttr=this.mUsrInps.LastExplicitlyExpandedAttr;k.mUsrInps.PreSlctdAttrIds=this.mUsrInps.PreSlctdAttrIds;k.mUsrInps.TopLevelLandingPageProdAttrIds=this.mUsrInps.TopLevelLandingPageProdAttrIds;return k;};SpecSrchInp.prototype.RemAll=function(){var k=this.SpecSrchFilters();for(var l in k){if(k.hasOwnProperty(l)){this.RemAttr(l,McMaster.MsgMgr.CntxtNms.CHOOSE_SPECS);}}k=this.LandingPageFilters();for(var l in k){if(k.hasOwnProperty(l)){this.RemAttr(l,McMaster.MsgMgr.CntxtNms.LANDING_PAGE);}}k=this.ProdFilters();for(var l in k){if(k.hasOwnProperty(l)){this.RemProdAttr(l);}}k=this.IntermediatePageFilters();for(var m in k){if(k.hasOwnProperty(m)){this.RemPubAttr(m);}}this.mUsrInps.Sequence=0;SpecSrchWebPart.MaintainFocus.Reset();this.mUsrInps.LastDeselectedAttr="";this.mUsrInps.LastDeselectedPubAttr="";this.mUsrInps.LastDeselectedValId="";this.mUsrInps.LastExplicitlyExpandedAttr=0;this.mUsrInps.TopLevelLandingPageProdAttrIds=new Array();return this;};SpecSrchInp.prototype.SyncWithServerUsrInp=function(l){this.RemAllSpecSrchFilters();this.RemAllLandingPageFilters();this.RemAllIntermediatePageFilters();this.RemAllProdFilters();this.mUsrInps.Sequence=0;var k=0;this.mUsrInps.TopLevelLandingPageProdAttrIds=new Array();this.SyncAttrInps(l.SpecSrchAttrInps,McMaster.MsgMgr.CntxtNms.CHOOSE_SPECS);this.SyncAttrInps(l.LandingPageAttrInps,McMaster.MsgMgr.CntxtNms.LANDING_PAGE);this.SyncAttrInps(l.IntermediatePageAttrInps,McMaster.MsgMgr.CntxtNms.LANDING_PAGE);this.SyncAttrInps(l.ProdAttrInps,McMaster.MsgMgr.CntxtNms.LANDING_PAGE);this.SetPreSlctdAttrList(l.PreSlctdAttrIds);this.SetTopLvlLandingPageAttrIds(l.TopLevelLandingPageProdAttrIds);return this;};SpecSrchInp.prototype.SyncAttrInps=function(l,k){for(var q in l){if(l.hasOwnProperty(q)){var p=l[q].ProdAttrId;if(l[q].HasSlctdVal||l[q].HasContextualSrch){this.AddAttr(l[q].ProdAttrId,k);for(var n in l[q].SlctdVals){if(l[q].SlctdVals.hasOwnProperty(n)){var m=l[q].SlctdVals[n];this.AddValWithSeqNbr(p,m.PubAttrId,m.ProdValId,m.PubValId,k,"Slctd",m.SeqNbr);if(m.SeqNbr>this.mUsrInps.Sequence){this.mUsrInps.Sequence=m.SeqNbr;}}}for(var o in l[q].ContextualSrchTimeline){if(l[q].ContextualSrchTimeline.hasOwnProperty(o)){var r=l[q].ContextualSrchTimeline[o];this.AddCntxtSrchWithSeqNbr(p,r.PubAttrId,r.ArgTxt,k,r.SeqNbr);if(r.SeqNbr>this.mUsrInps.Sequence){this.mUsrInps.Sequence=r.SeqNbr;}}}}}}return this;};SpecSrchInp.prototype.RemAllSpecSrchFilters=function(){var k=this.SpecSrchFilters();for(var l in k){if(k.hasOwnProperty(l)){this.RemAttr(l,McMaster.MsgMgr.CntxtNms.CHOOSE_SPECS);}}return this;};SpecSrchInp.prototype.RemAllLandingPageFilters=function(){var k=this.LandingPageFilters();for(var l in k){if(k.hasOwnProperty(l)){this.RemAttr(l,McMaster.MsgMgr.CntxtNms.LANDING_PAGE);}}return this;};SpecSrchInp.prototype.RemAllProdFilters=function(){var k=this.ProdFilters();for(var l in k){if(k.hasOwnProperty(l)){this.RemProdAttr(l);}}return this;};SpecSrchInp.prototype.RemAllIntermediatePageFilters=function(){var k=this.IntermediatePageFilters();for(var l in k){if(k.hasOwnProperty(l)){this.RemPubAttr(l);}}return this;};SpecSrchInp.prototype.SetExplicitlyExpandedAttr=function(k){this.mUsrInps.LastExplicitlyExpandedAttr=parseInt(k,10);return this;};SpecSrchInp.prototype.RemExplicitlyExpandedAttr=function(){this.mUsrInps.LastExplicitlyExpandedAttr=0;return this;};SpecSrchInp.prototype.SetPreSlctdAttrList=function(k){this.mUsrInps.PreSlctdAttrIds=k;return this;};SpecSrchInp.prototype.SetTopLvlLandingPageAttrIds=function(k){this.mUsrInps.TopLevelLandingPageProdAttrIds=k;return this;};SpecSrchInp.prototype.AddCntxtSrch=function(n,o,m,k){if(this.GetCntxtSrchChgd(n,m,k)){var l={};l[c]=parseInt(o,10);l[j]=m;l[a]=this.IncrementAndGetSequence();this.GetCntxtSrchArgs(n,k).push(l);this.mUsrInps.LastDeselectedAttr="";this.mUsrInps.LastDeselectedPubAttr="";this.mUsrInps.LastDeselectedValId="";}return this;};SpecSrchInp.prototype.AddCntxtSrchWithSeqNbr=function(o,p,n,l,k){if(this.GetCntxtSrchChgd(o,n,l)){var m={};m[c]=parseInt(p);m[j]=n;m[a]=k;this.GetCntxtSrchArgs(o,l).push(m);this.mUsrInps.LastDeselectedAttr="";this.mUsrInps.LastDeselectedPubAttr="";this.mUsrInps.LastDeselectedValId="";}return this;};SpecSrchInp.prototype.GetCntxtSrchArgs=function(l,k){return this.GetAttr(l,k)[g];};SpecSrchInp.prototype.GetCntxtSrchLastArg=function(m,l){var n=this.GetCntxtSrchArgs(m,l);var k=n.length-1;if(k>=0){return n[k][j];}else{return"";}};SpecSrchInp.prototype.GetCntxtSrchChgd=function(m,l,k){return(this.GetCntxtSrchLastArg(m,k)!=l);};SpecSrchInp.prototype.ValExists=function(n,k,m){var l=false;if(this.AttrExists(n,m)){if(m==McMaster.MsgMgr.CntxtNms.LANDING_PAGE&&this.LandingPageFilters()[n][d][k]){l=true;}else{if(m==McMaster.MsgMgr.CntxtNms.CHOOSE_SPECS&&this.SpecSrchFilters()[n][d][k]){l=true;}else{if(m==McMaster.MsgMgr.CntxtNms.INLN_ORD&&this.SpecSrchFilters()[n][d][k]){l=true;}else{if(m==McMaster.MsgMgr.CntxtNms.ORD_PAD&&this.SpecSrchFilters()[n][d][k]){l=true;}else{if(m==McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN&&this.SpecSrchFilters()[n][d][k]){l=true;}}}}}}return l;};SpecSrchInp.prototype.ProdValExists=function(l,k){if(this.ProdAttrExists(l)&&this.ProdFilters()[l][d][k]){return true;}else{return false;}};SpecSrchInp.prototype.PubValExists=function(l,k){if(this.PubAttrExists(l)&&this.IntermediatePageFilters()[l][d][k]){return true;}else{return false;}};SpecSrchInp.prototype.AddVal=function(o,q,k,p,l,n){if(!this.ValExists(o,k,l)){var m=this.GetAttrSlctdVals(o,l);m[k]={};m[k][e]="Slctd";m[k][a]=this.IncrementAndGetSequence();m[k][c]=parseInt(q,10);m[k][i]=parseInt(p,10);}return this;};SpecSrchInp.prototype.AddProdVal=function(n,k,m){if(!this.ProdValExists(n,k)){var l=this.ProdFilters()[n][d];l[k]={};l[k][e]="Slctd";l[k][a]=0;}return this;};SpecSrchInp.prototype.AddPubVal=function(n,m,l){if(!this.PubValExists(n,m)){var k=this.IntermediatePageFilters()[n][d];k[m]={};k[m][e]="Slctd";k[m][a]=this.IncrementAndGetSequence();}return this;};SpecSrchInp.prototype.AddValWithSeqNbr=function(p,r,l,q,m,o,k){if(!this.ValExists(p,l,m)){var n=this.GetAttrSlctdVals(p,m);n[l]={};n[l][e]="Slctd";n[l][a]=k;n[l][c]=parseInt(r,10);n[l][i]=parseInt(q,10);}return this;};SpecSrchInp.prototype.GetVal=function(m,o,k,n,l){this.AddVal(m,o,k,n,l);return this.GetAttrSlctdVals(m,l)[k];};SpecSrchInp.prototype.RemVal=function(m,k,l){if(this.ValExists(m,k,l)){if(l==McMaster.MsgMgr.CntxtNms.LANDING_PAGE){delete this.LandingPageFilters()[m][d][k];}else{delete this.SpecSrchFilters()[m][d][k];}this.mUsrInps.Sequence+=1;}return this;};SpecSrchInp.prototype.RemProdVal=function(l,k){if(this.ProdValExists(l,k)){delete this.ProdFilters()[l][d][k];this.mUsrInps.Sequence+=1;}return this;};SpecSrchInp.prototype.RemPubVal=function(l,k){if(this.PubValExists(l,k)){delete this.IntermediatePageFilters()[l][d][k];this.mUsrInps.Sequence+=1;}return this;};SpecSrchInp.prototype.ToggleVal=function(m,o,k,n,l){if(m==null||k==null){}else{if(this.ValExists(m,k,l)){this.RemVal(m,k,l);this.mUsrInps.LastDeselectedAttr=m;this.mUsrInps.LastDeselectedPubAttr=parseInt(o,10);this.mUsrInps.LastDeselectedValId=k;if(this.AttrUsrInpEmptyInd(m,l)){this.RemAttr(m,l);}}else{this.AddVal(m,o,k,n,l);this.mUsrInps.LastDeselectedAttr="";this.mUsrInps.LastDeselectedPubAttr="";this.mUsrInps.LastDeselectedValId="";}}return this;};SpecSrchInp.prototype.SetContextualSrch=function(l,k){return this;};SpecSrchInp.prototype.UsrInps=function(){return this.mUsrInps;};SpecSrchInp.prototype.SpecSrchFilters=function(){return this.UsrInps().SpecSrchFilters;};SpecSrchInp.prototype.LandingPageFilters=function(){return this.UsrInps().LandingPageFilters;};SpecSrchInp.prototype.IntermediatePageFilters=function(){return this.UsrInps().IntermediatePageFilters;};SpecSrchInp.prototype.ProdFilters=function(){return this.UsrInps().ProdFilters;};SpecSrchInp.prototype.Sequence=function(){return this.UsrInps().Sequence;};SpecSrchInp.prototype.IncrementAndGetSequence=function(){this.mUsrInps.Sequence+=1;return this.Sequence();};SpecSrchInp.prototype.GetSelectionCnt=function(){var m=0,k=Cmn.Utilities,l=this.mUsrInps;m+=k.Keys(l.SpecSrchFilters).length;m+=k.Keys(l.LandingPageFilters).length;m+=k.Keys(l.ProdFilters).length;m+=k.Keys(l.IntermediatePageFilters).length;return m;};SpecSrchInp.prototype.AddSpecUsrInpQS=function(l){if(l!=null){if(!Cmn.IsEmpty(this.mUsrInps.SpecSrchFilters)){var k=YAHOO.lang.JSON.stringify(this.mUsrInps.SpecSrchFilters).replace(/[^\x00-\x7F]/gi,"");k=k.replace(/&/g,"%26");l=Cmn.AddQSNmVal(l,"SpecSrchAttrInps",k);}if(!Cmn.IsEmpty(this.mUsrInps.LandingPageFilters)){l=Cmn.AddQSNmVal(l,"LandingPageAttrInps",YAHOO.lang.JSON.stringify(this.mUsrInps.LandingPageFilters));}if(!Cmn.IsEmpty(this.mUsrInps.IntermediatePageFilters)){l=Cmn.AddQSNmVal(l,"IntermediatePageAttrInps",YAHOO.lang.JSON.stringify(this.mUsrInps.IntermediatePageFilters));}if(!Cmn.IsEmpty(this.mUsrInps.ProdFilters)){l=Cmn.AddQSNmVal(l,"ProdAttrInps",YAHOO.lang.JSON.stringify(this.mUsrInps.ProdFilters));}if(this.mUsrInps.LastDeselectedAttr){l=Cmn.AddQSNmVal(l,"AttrIdOfLastDeselectedVal",this.mUsrInps.LastDeselectedAttr);}if(this.mUsrInps.LastDeselectedPubAttr){l=Cmn.AddQSNmVal(l,"PubAttrIdOfLastDeselectedVal",this.mUsrInps.LastDeselectedPubAttr);}if(this.mUsrInps.LastDeselectedValId){l=Cmn.AddQSNmVal(l,"LastDeselectedValId",this.mUsrInps.LastDeselectedValId);}if(this.mUsrInps.LastExplicitlyExpandedAttr!==0){l=Cmn.AddQSNmVal(l,f,this.mUsrInps.LastExplicitlyExpandedAttr);}if(!Cmn.IsEmpty(this.mUsrInps.PreSlctdAttrIds)){l=Cmn.AddQSNmVal(l,"PreSlctdAttrIds",this.mUsrInps.PreSlctdAttrIds);}if(!Cmn.IsEmpty(this.mUsrInps.TopLevelLandingPageProdAttrIds)){l=Cmn.AddQSNmVal(l,"TopLevelLandingPageProdAttrIds",this.mUsrInps.TopLevelLandingPageProdAttrIds);}}return l;};SpecSrchInp.prototype.UpdateSession=function(){McMaster.SesnMgr.SetStVal(h.SpecUsrInps.KyTxt(),this.UsrInps());return this;};SpecSrchInp.prototype.PubMsg=function(k){var l=new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.SPEC);McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.SpecSlctd(l,k));return this;};}})();

this.SpecSrchWebPart||(SpecSrchWebPart=new function(){this.FromIntermediateLandingPageInd=!1;var g=McMaster.SesnMgr.GetStVal,r=McMaster.SesnMgr.SetStVal,f=McMaster.SesnMgr.StValDefs,l=McMaster.MsgMgr.CntxtNms.CHOOSE_SPECS;McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.ChooseSpecsStatChg,function(a){SpecSrchWebPart.Stat_Chg(a)});McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.SpecToggleLnkSlctd,function(){m()});this.WebPart_LoadCmpl=function(a){var b=McMasterCom.Nav.GetTopFrame();new b.PerfTracker.Evnt(b.PerfTracker.EvntNms.SpecSrchLdCmplBgn,
b.PerfTracker.PgCntxtNms.DynCntnt);if(0<a.UpdtedSpecUsrInp.PreSlctdAttrIds.length&&a.ParWebPart){var c,b={};for(i=0;i<a.UpdtedSpecUsrInp.SpecSrchAttrInps.length;i++)if(c=a.AttrIdToNmDict[a.UpdtedSpecUsrInp.SpecSrchAttrInps[i].SlctdVals[0].PubAttrId])b[c]=a.UpdtedSpecUsrInp.SpecSrchAttrInps[i].SlctdVals[0].PubValId;c=b=p(a,b);var b="",d;for(d in c)b+="&Attribute="+d+"&Value="+c[d].Trim();d=g(f.PreSlctdSpecCntxtNm.KyTxt());""===d&&(d=McMaster.MsgMgr.CntxtNms.SRCH_ENTRY_WEB_PART);0<b.length&&SpecInteractions.Webreports_TrkCustomAct(d,
"Selected Spec",b);r(f.PreSlctdSpecCntxtNm.KyTxt(),"");d=[];for(var b=[],e=c=0;e<a.UpdtedSpecUsrInp.SpecSrchAttrInps.length;e++){var q=a.UpdtedSpecUsrInp.SpecSrchAttrInps[e].ProdAttrId;if(q)for(var n=a.AttrIdToNmDict[a.UpdtedSpecUsrInp.SpecSrchAttrInps[e].SlctdVals[0].PubAttrId],h={},k=0;k<a.UpdtedSpecUsrInp.SpecSrchAttrInps[e].SlctdVals.length;k++)b[c]={attrID:q,valID:a.UpdtedSpecUsrInp.SpecSrchAttrInps[e].SlctdVals[k].ProdValId},h[n]=a.UpdtedSpecUsrInp.SpecSrchAttrInps[e].SlctdVals[k].PubValId,
h=p(a,h),d[c]={attr:n,val:h[n]},c+=1}c=new SrchTrkr.SrchDat({resp:SrchTrkr.RespTyps.SPEC_MTCH});c.resp.srcNm="SpecSrchWebPart";c.resp.mtchdSpec=d?!1==d?null:d:null;c.resp.mtchdSpecIDs=b?!1==b?null:b:null;c.Trk()}a.DisplInd?Cmn.Utilities.NotEmpty(a.AttrIdToNmDict)&&(SpecSrchWebPartLoader.Show(),g(f.ProdPageReloadingInd.KyTxt())&&(SpecInteractions.AddAttrIdToNmDefs(a),SpecInteractions.AttachEvntListeners(a,l,SpecSrchWebPartLoader,!0)),SpecSrchWebPart.MaintainFocus.UpdtPosn(),m()):SpecSrchWebPartLoader.Hide();
SpecSrchInp.Get().SyncWithServerUsrInp(a.UpdtedSpecUsrInp).UpdateSession();!0===a.InvalidatedLastExplicitlyExpandedAttrInd&&SpecSrchInp.Get().RemExplicitlyExpandedAttr().UpdateSession();SpecSrchInp.Get().RemAllProdFilters().UpdateSession();SpecSrchWebPart.SpecInfo.ApplyOpenSpecInfoLnkHighlighting();g(f.ChooseSpecsLoadFrmSesnInd.KyTxt())||ContentHistMgr.Take_Snapshot(ContentHistMgr.TYP.CHOOSE_SPECS_LOAD);b=McMasterCom.Nav.GetTopFrame();new b.PerfTracker.Evnt(b.PerfTracker.EvntNms.SpecSrchLdCmplEnd,
b.PerfTracker.PgCntxtNms.DynCntnt);McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.ProdPageReloadingInd.KyTxt());this.planningtimestamp=new Date;McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.FetchAheadDatRcvd,SpecSrchWebPartLoader.HndlFetchAheadDatRcvd)};this.WebPart_PreUnload=function(a){McMaster.MsgMgr.RemSubscriber(McMaster.MsgMgrMsgs.FetchAheadDatRcvd,SpecSrchWebPartLoader.HndlFetchAheadDatRcvd);g(f.ProdPageReloadingInd.KyTxt())&&(SpecSrchWebPart.SpecInfo.Unload(),SpecSrchWebPartLoader.Hide(),
SpecInteractions.RemoveEvntListeners(a))};this.WebPart_Unload=function(a){g(f.ProdPageReloadingInd.KyTxt())&&SpecSrchWebPartLoader.AbortStaleReq()};var m=function(a){var b=Cmn.GetElementsByClsNm("SpecSrch_Title","DIV",document.getElementById("SpecSrch_Cntnr"))[0],c=Cmn.GetElementsByClsNm("SpecSrch_AttrSeparator"),d=0,d=1<c.length?Cmn.GetWidth(c[1]):Cmn.GetWidth(Cmn.GetElementsByClsNm("SpecSrch_Pane")[0])-10;Cmn.SetStyle(b,"width",d+"px");a||setTimeout(function(){m(!0)},50)};this.Stat_Chg=function(a){if(!a.MsgPayload().ChooseSpecsAutoStatChgInd){var b=
g(f.SlctdSrchRsltTxt.KyTxt());"EXPANDED"==a.MsgPayload().ChooseSpecsSt?Cmn.TrkAct("Action=Opened&SrchTxt="+b,l):"COLLAPSED"==a.MsgPayload().ChooseSpecsSt&&Cmn.TrkAct("Action=Closed&SrchTxt="+b,l)}};var p=function(a,b){var c=document.createElement("div");c.innerHTML=a.ParWebPart.MarkupTxt;var c=Cmn.GetElementsByClsNm("SpecSrch_SlctdVal","td",c),d;for(d in b)for(i=0;i<c.length;i++)if(0<=c[i].id.indexOf(b[d])){var e="",e=0<=c[i].id.indexOf("_C_")&&0<=c[i].id.indexOf("_I_")?Cmn.GetTxtContent(SpecInteractions.GetComplementaryImgTxtElemById(c[i])):
Cmn.GetTxtContent(c[i]);b[d]=e}return b}});


(function(){if(this.SpecSrchWebPart.MaintainFocus){}else{var h;var i;var a;var f;var e;var b=false;var j;SpecSrchWebPart.MaintainFocus=function(){};SpecSrchWebPart.MaintainFocus.CntxtSrchChgd=function(){var l=false;if(h){var k=SpecInteractions.GetVisibleElemById(h);if(k&&Cmn.HasCls(k,"SpecSrch_CntxtSrchBx")){l=(j!==k.value);}}return l;};SpecSrchWebPart.MaintainFocus.Reset=function(){h=undefined;i=undefined;a=undefined;f=undefined;e=undefined;b=false;j=undefined;};SpecSrchWebPart.MaintainFocus.SavePosn=function(k){try{var k=k,l=SpecInteractions.GetAttrByInnerElem(k);a=c(k);f=c(l);e=g();h=k.id;i=l.id;j=k.value;b=true;}catch(m){}};SpecSrchWebPart.MaintainFocus.UpdtPosn=function(){if(h&&i){var n=SpecInteractions.GetVisibleElemById(h),t=SpecInteractions.GetVisibleElemById(i);}if(b){b=false;if(n&&Cmn.HasCls(n,"SpecSrch_CntxtSrchBx")){if(n.setSelectionRange){n.focus();n.setSelectionRange(n.value.length,n.value.length);if(document.createEvent){try{var l=document.createEvent("KeyboardEvent");l.initKeyEvent("keypress",false,true,null,false,false,false,false,0,32);n.dispatchEvent(l);var u=document.createEvent("KeyboardEvent");u.initKeyEvent("keypress",false,true,null,false,false,false,false,8,0);n.dispatchEvent(u);}catch(q){}}}else{if(n.createTextRange){var o=n.createTextRange();o.collapse(true);o.moveEnd("character",n.value.length);o.moveStart("character",n.value.length);o.select();}else{n.focus();}}}try{var r=c(n),k=c(t),m=(n&&r>0)?(r-a):(k-f),s=(Math.max(e+m,0));Cmn.SetVerticalScrollPosn(d(),s);}catch(p){}}else{Cmn.SetVerticalScrollPosn(d(),0);if(n&&t){h=n.id;i=t.id;j=n.value;}}};var d=function(){return Cmn.GetObj("SpecSrch_Inner");};var g=function(){return Cmn.GetVerticalScrollPosn(d());};var c=function(p){var m=0;if(!p){}else{if(SpecInteractions.GetElemIsInDropDwnMenu(p)){}else{m=Cmn.GetYOffset(p);var q=Cmn.GetAncestorByClsNm(p,"SpecSrch_ScrollCntnr");if(q){var k=(Cmn.GetVerticalScrollPosn(q)),l=(Cmn.GetYOffset(q)),o=(q.offsetHeight);specDistFromScrollTop=(p.offsetTop-k),specScrolledOutOfView=(specDistFromScrollTop>o);if(specScrolledOutOfView){var n=(o/2);Cmn.SetVerticalScrollPosn(q,specDistFromScrollTop-n);m=l+n;}else{m=l+specDistFromScrollTop;}}}}return m;};}})();

(function(){if(!SpecSrchWebPart.SpecInfo){var r=Cmn.Utilities,w=Cmn.forEach,m=r.Values,y=r.Keys,z=Cmn.map,A=Cmn.filter;SpecSrchWebPart.SpecInfo=function(){this.mGenInfoLnkId=this.mPrsnttnId=null;this.mOpen=!1;return this};SpecSrchWebPart.SpecInfo.mInfos={};SpecSrchWebPart.SpecInfo.mInfosByAttr={};SpecSrchWebPart.SpecInfo.mOpenInfos={};SpecSrchWebPart.SpecInfo.Constants={OUTER_PREFIX:"SpecInfoOuter_",ID_PREFIX:"SpecInfoPadding_"};SpecSrchWebPart.SpecInfo.Create=function(a,b){var d=new SpecSrchWebPart.SpecInfo;
d.mOpen=!1;d.mPrsnttnId=a;d.mGenInfoLnkId=b;return d};SpecSrchWebPart.SpecInfo.Get=function(a){var b;b=a.id.split("_");b=b[b.length-1];var d=SpecSrchWebPart.SpecInfo.mInfos[b],c;d?(c=d.RootAttrGrp(),c||(d=SpecSrchWebPart.SpecInfo.Create(b,a.id),SpecSrchWebPart.SpecInfo.mInfos[b]=d,c=d.RootAttrGrp())):(d=SpecSrchWebPart.SpecInfo.Create(b,a.id),SpecSrchWebPart.SpecInfo.mInfos[b]=d,c=d.RootAttrGrp());return SpecSrchWebPart.SpecInfo.mInfosByAttr[c.id]=d};SpecSrchWebPart.SpecInfo.GetOpenInfos=function(){return SpecSrchWebPart.SpecInfo.mOpenInfos};
SpecSrchWebPart.SpecInfo.ApplyOpenSpecInfoLnkHighlighting=function(){var a=SpecSrchWebPart.SpecInfo.GetOpenInfos();w(m(a),function(a){t(a.LinkElem())})};SpecSrchWebPart.SpecInfo.Unload=function(){SpecSrchWebPart.SpecInfo.CloseAll();SpecSrchWebPart.SpecInfo.mInfosByAttr={};SpecSrchWebPart.SpecInfo.mInfos={}};SpecSrchWebPart.SpecInfo.Click=function(a,b){var d=SpecSrchWebPart.SpecInfo.Get(a);if(d.IsOpen())n(d),SpecSrchWebPart.SpecInfo.TrkAct("Closed general information presentation",d,"Clicked GenInfo Link");
else{var c=McMasterCom.Nav.GetTopFrame();new c.PerfTracker.Evnt(c.PerfTracker.EvntNms.SpecInfoPrsnttnClick,c.PerfTracker.PgCntxtNms.DynCntnt);SpecSrchWebPart.SpecInfo.LoadSpecInfo(d,null,b);SpecSrchWebPart.SpecInfo.TrkAct("Opened general information presentation",d,"Clicked GenInfo Link")}};SpecSrchWebPart.SpecInfo.GetOpenSpecInfoByAttrElem=function(a){var b,d=Cmn.GetElementsByClsNm("SpecSrch_GenInfoLnk","a",a)[0];d||(a=SpecInteractions.GetComplementaryElemById(a.id),d=Cmn.GetElementsByClsNm("SpecSrch_GenInfoLnk",
"a",a)[0]);d&&(b=d.id.split("_")[4],b=SpecSrchWebPart.SpecInfo.GetOpenInfos()[b]);return b};SpecSrchWebPart.SpecInfo.LoadSpecInfo=function(a,b,d){var c=a.Id(),e=B(a,d),f=SpecSrchWebPart.SpecInfo.Constants.OUTER_PREFIX+c,g=SpecSrchWebPart.SpecInfo.Constants.ID_PREFIX+c,n="InvisibleShield_"+c,m="TransparentBorder_"+c;Cmn.GetObj(f);var p=Cmn.GetObj(g);p||(p=Cmn.CrteElement("div"),p.innerHTML='<div class="SpecLayout_GenInfo_InvisibleShield" id="'+n+'"></div><div class="SpecLayout_GenInfo_TransparentBorder" id="'+
m+'"></div><div class="SpecLayout_GenInfo" id="'+f+'"><div class="SpecLayout_GenInfo_Padding" id="'+g+'"></div></div>',Cmn.InsrtAfter(p,Cmn.GetObj("ShellLayout_MainContent_Inner")),Cmn.GetObj(f),p=Cmn.GetObj(g));var s=b||C(a),f=a.mGenInfoLnkId.split("_")[2];PrsnttnWebPartLoader.LoadSpecInfo(c,"full",function(){a.mOpen=!1;var c=b||Cmn.GetWidth(a.Elem());if(c<=s){if(a&&a.IsClosed()){SpecSrchWebPart.SpecInfo.mOpenInfos[a.Id()]=a;a.mOpen=!0;t(a.LinkElem());var e=SpecInteractions.GetComplementaryElemById(a.LinkElem().id);
e&&t(e);var q=void 0,l=a.RootAttrGrp(),f=a.Elem(),e=a.Container(),g=a.InvisibleShield(),n=a.TransparentBorder(),k=a.PaddingContainer(),m=Cmn.GetObj("ProdPageContent"),h=Cmn.GetObj("ShellLayout_ChooseSpecs_Toggle");Cmn.GetX(h);Cmn.GetHeight(Cmn.GetObj("ShellLayout_Header_Cntnr"));if(h=a.HeaderElem())Cmn.SetStyle(h,"width",c-10+"px"),h.nextSibling?Cmn.SetStyle(h.nextSibling,"padding-top","30px"):Cmn.SetStyle(h.parentNode,"padding-bottom","30px");Cmn.GetWidth(f)>c&&(Cmn.SetStyle(k,"width",c+"px"),f=
Cmn.GetHeight(e)+18,Cmn.SetStyle(k,"height",f+"px"),Cmn.SetStyle(k,"overflow-x","scroll"));q=q||Cmn.GetHeight(e);f=q+16;q=Cmn.GetHeight(m);h=q-77;Cmn.GetHeight(k);f>h?(f=h,Cmn.SetStyle(k,"height",f-16-2+"px"),Cmn.SetStyle(k,"width",c+18+"px"),Cmn.SetStyle(k,"overflow-y","scroll")):Cmn.SetStyle(k,"overflow-y","hidden");var c=Cmn.GetObj("SpecSrch_Inner"),k=c.scrollTop,p=c.offsetHeight,r=p-19,h=l.offsetTop,l=Cmn.GetNxtSibling(l),u=0,u=l?l.offsetTop-h+3:c.scrollHeight-h;u<=r&&(l=h+u,p=k+p,h<k+19?Cmn.SetVerticalScrollPosn(c,
h-19):l>p&&Cmn.SetVerticalScrollPosn(c,k+(l-p)));l=Cmn.GetX(Cmn.GetObj("ProdPageContent"));c=Cmn.GetY(Cmn.GetObj("ShellLayout_MainContent_Inner"));c=Cmn.GetY(a.LinkElem())+Cmn.GetHeight(a.LinkElem())-c;k=Cmn.GetHeight(a.HeaderElem())+7+1+1;c-=k;q=47>c?47:c+f>q-30?q-f-30:c;Cmn.SetStyle(g,"top","0px");Cmn.SetStyle(g,"left",l+"px");Cmn.SetStyle(g,"width",Cmn.GetWidth(m)-18+"px");Cmn.SetStyle(g,"height",Cmn.GetHeight(m)+"px");Cmn.SetStyle(n,"left",l+"px");Cmn.SetStyle(n,"top",q+"px");g=Cmn.GetHeight(e)+
14;n=Cmn.GetWidth(e)+14;Cmn.SetStyle(a.TransparentBorder(),"height",g+"px");Cmn.SetStyle(a.TransparentBorder(),"width",n+"px");Cmn.SetStyle(e,"left",l+8+"px");Cmn.SetStyle(e,"top",q+8+"px")}}else c<=v()?SpecSrchWebPart.SpecInfo.LoadSpecInfo(a,c,d):SpecSrchWebPart.SpecInfo.LoadSpecInfo(a,v(),d)},e,s,f)};SpecSrchWebPart.SpecInfo.ClickHandler=function(a){var b=Cmn.GetEvntTarget(a),d=g(b,"SpecLayout_GenInfo"),c=g(b,"SpecSrch_Attribute"),e=g(b,"SpecSrch_MoreLnk"),f=g(b,"SpecLayout_GenInfo_InvisibleShield"),
m=s(b,"ShellLayout_ChooseSpecs_Toggle"),r=s(b,"ShellLayout_SecondaryContentToggle_Cntnr"),t=s(b,"ChooseSpecsClearAll");d?(c=g(b,"SecondaryLnk"),e=SpecSrchWebPart.SpecInfo.Get(d),c?(n(e),SpecSrchWebPart.SpecInfo.TrkAct("Closed general information presentation",e,"Clicked Toggle Button")):"A"==b.tagName.toUpperCase()&&FullPrsnttnWebPart.HndlClickEvnt(a,d.id)):e||(c?SpecInteractions.GetAttrId(c)===SpecSrchInp.Get().UsrInps().LastExplicitlyExpandedAttr?SpecSrchWebPart.SpecInfo.CloseAllExcept(c):SpecSrchWebPart.SpecInfo.CloseAll():
(f||m||r||t)&&SpecSrchWebPart.SpecInfo.CloseAll())};SpecSrchWebPart.SpecInfo.CloseAll=function(a){a=a||m(SpecSrchWebPart.SpecInfo.mOpenInfos);w(m(a),function(a){a.IsOpen()&&(n(a),SpecSrchWebPart.SpecInfo.TrkAct("Closed general information presentation",a,"Clicked Outside of the Presentation"))})};SpecSrchWebPart.SpecInfo.CloseAllExcept=function(a){var b=SpecSrchWebPart.SpecInfo.GetOpenSpecInfoByAttrElem(a);a=SpecSrchWebPart.SpecInfo.GetOpenInfos();b&&(a=z(A(y(a),function(a){return a!=b.Id()}),function(a){return openInfos[a]}));
SpecSrchWebPart.SpecInfo.CloseAll(a)};SpecSrchWebPart.SpecInfo.CloseByAttr=function(a){n(SpecSrchWebPart.SpecInfo.mInfosByAttr[a])};SpecSrchWebPart.SpecInfo.TrkAct=function(a,b,d){var c=McMaster.SesnMgr.GetStVal,e=c(McMaster.SesnMgr.StValDefs.SlctdSrchRsltTxt.KyTxt()),c=b.LinkElem().text;b=SpecInteractions.GetAttrNm(b.TopLvlAttrId());a="Action="+encodeURIComponent(a)+"&SrchTxt="+encodeURIComponent(e);a=a+"&Attribute="+encodeURIComponent(b);a=a+"&GenInfoLinkName="+encodeURIComponent(c);a=a+"&Method="+
encodeURIComponent(d);Cmn.TrkAct(a,"ChooseSpec")};SpecSrchWebPart.SpecInfo.prototype.LinkElem=function(){var a=SpecInteractions.GetVisibleElemById(this.GenInfoLnkId());return a?a:Cmn.GetObj(this.GenInfoLnkId())};SpecSrchWebPart.SpecInfo.prototype.AttrIds=function(){return this.LinkElem().rel.split("|")[0].split(",")};SpecSrchWebPart.SpecInfo.prototype.ProdAttrIds=function(){return this.LinkElem().rel.split("|")[1].split(",")};SpecSrchWebPart.SpecInfo.prototype.TopLvlAttrId=function(){var a=this.AttrIds();
return a&&0<a.length?a[0]:null};SpecSrchWebPart.SpecInfo.prototype.TopLvlProdAttrId=function(){var a=this.ProdAttrIds();return a&&0<a.length?a[0]:null};SpecSrchWebPart.SpecInfo.prototype.HeaderElem=function(){return this.Elem()?this.Elem().firstChild.firstChild:null};SpecSrchWebPart.SpecInfo.prototype.Elem=function(){return Cmn.GetObj(this.ElemId())};SpecSrchWebPart.SpecInfo.prototype.ElemId=function(){return"Full_"+this.Id()};SpecSrchWebPart.SpecInfo.prototype.Container=function(){return Cmn.GetObj(SpecSrchWebPart.SpecInfo.Constants.OUTER_PREFIX+
this.Id())};SpecSrchWebPart.SpecInfo.prototype.InvisibleShield=function(){return Cmn.GetObj("InvisibleShield_"+this.Id())};SpecSrchWebPart.SpecInfo.prototype.TransparentBorder=function(){return Cmn.GetObj("TransparentBorder_"+this.Id())};SpecSrchWebPart.SpecInfo.prototype.PaddingContainer=function(){return Cmn.GetObj(SpecSrchWebPart.SpecInfo.Constants.ID_PREFIX+this.Id())};SpecSrchWebPart.SpecInfo.prototype.Id=function(){return this.mPrsnttnId};SpecSrchWebPart.SpecInfo.prototype.GenInfoLnkId=function(){return this.mGenInfoLnkId};
SpecSrchWebPart.SpecInfo.prototype.RootAttrGrp=function(){var a=Cmn.GetAncestorByClsNm(this.LinkElem(),"SpecSrch_Attribute");return Cmn.GetAncestorByClsNm(a,"SpecSrch_Attribute")||a};SpecSrchWebPart.SpecInfo.prototype.IsOpen=function(){return this.mOpen};SpecSrchWebPart.SpecInfo.prototype.IsClosed=function(){return!this.IsOpen()};var t=function(a){Cmn.HasCls(a,"SpecSrch_GenInfoLnk_Hover")?Cmn.ReplaceCls(a,"SpecSrch_GenInfoLnk_Hover","SpecSrch_GenInfoLnk_Hover_Slctd"):Cmn.AddCls(a,"SpecSrch_GenInfoLnk_Slctd")},
x=function(a){Cmn.HasCls(a,"SpecSrch_GenInfoLnk_Hover_Slctd")?Cmn.ReplaceCls(a,"SpecSrch_GenInfoLnk_Hover_Slctd","SpecSrch_GenInfoLnk_Hover"):Cmn.RemCls(a,"SpecSrch_GenInfoLnk_Slctd")},n=function(a){if(a&&a.IsOpen()){a.mOpen=!1;x(a.LinkElem());var b=SpecInteractions.GetComplementaryElemById(a.LinkElem().id);b&&x(b);SpecSrchWebPart.SpecInfo.mOpenInfos[a.Id()]&&delete SpecSrchWebPart.SpecInfo.mOpenInfos[a.Id()];a=Cmn.GetObj(SpecSrchWebPart.SpecInfo.Constants.OUTER_PREFIX+a.Id());Cmn.RemElem(a.parentNode)}},
g=function(a,b){if(a&&a!==document)for(;a&&a!==document.body;){if(Cmn.HasCls(a,b))return a;a=a.parentNode}return null},s=function(a,b){if(a&&a!==document)for(;a&&a!==document.body;){if(a.id===b)return a;a=a.parentNode}return null},B=function(a,b){var d=SpecSrchInp.Get(),c=a.ProdAttrIds();if(1!=c.length&&1<c.length){var e=a.TopLvlAttrId(),f=a.TopLvlProdAttrId();d.UsrInps().LastExplicitlyExpandedAttr===e||Cmn.Utilities.Empty(d.GetAttrSlctdVals(f,b))||(c=c.slice(1))}d.RemAttrs(c,b);return d},C=function(a){a=
v();var b=Cmn.GetObj("ProdPageContent"),b=Cmn.GetWidth(b);return Math.min(Math.max(b/2,400),a)},v=function(){var a=Cmn.GetObj("ProdPageContent");return Cmn.GetWidth(a)-60}}})();


if(this.ContentWebPart){}else{this.ContentWebPart=new function(){var g="Abbr_",d="AbbrPrsnttn_PrsnttnNm_Highlighted",j="AbbrPrsnttn_PrsnttnNm_CtrlGrp",a="PartNbrOrdrdLnk",c="PartNbrOrdrdLnk_CtrlGrp",h="SpecChoiceOrdrdLnk";this.WebPart_AssocFilesLoad=function(k){var l=document.createElement("div");l.innerHTML=k.MarkupTxt;b(l,true);b(l,false);Cmn.GetObj(k.CntnrIDTxt).innerHTML="";Cmn.GetObj(k.CntnrIDTxt).appendChild(l);};this.WebPart_PreUnload=function(k){McMaster.MsgMgr.RemSubscriber(McMaster.MsgMgrMsgs.FetchAheadDatRcvd,ContentWebPartLoader.HndlFetchAheadDat);};this.WebPart_LoadCmpl=function(k){McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.FetchAheadDatRcvd,ContentWebPartLoader.HndlFetchAheadDat);};var b=function(l,p){var H=0,A=0,L={},I=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.SpecUsrInps.KyTxt()),w=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainPrsnttnIdsToHighlight.KyTxt()),N=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainSpecIdValsToParts.KyTxt()),K={},x=[];if(p){var J=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainPrtNbrsToHighlight.KyTxt());}else{var J=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainLocPrtNbrsToHighlight.KyTxt());}if(Cmn.IsEmpty(w)==false){var m=parseInt(g.length);var n=Cmn.GetElementsByClsNm("AbbrPrsnttn","div",l);H=n.length;if(n&&H>0){var O=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainSearchIdsToParts.KyTxt());var B=i();if(Cmn.IsEmpty(O)==false&&B!=undefined&&B>0&&O[B]){x=O[B].split("|");A=x.length;for(var F=0;F<A;F++){L[x[F]]="0";}for(var F=0;F<H;F++){var y=n[F].id.substring(m);if(w[y]){var s=false;var D=w[y].split("|");var v=e(L,D);if(v==true){if(Cmn.IsEmpty(I)==true||Cmn.IsEmpty(N)==true){s=true;}else{s=f(I,N,D);}}if(s){Cmn.AddCls(n[F],d);}}}}}}if(!("indexOf" in Array.prototype)){Array.prototype.indexOf=function(S,R){if(R===undefined){R=0;}if(R<0){R+=this.length;}if(R<0){R=0;}for(var T=this.length;R<T;R++){if(R in this&&this[R]===S){return R;}}return -1;};}if(Cmn.IsEmpty(J)==false){var o=Cmn.GetElementsByClsNm("PartNbrLnk","a",l);H=o.length;if(o&&H>0){for(var F=0;F<H;F++){var r=o[F].getAttribute("data-mcm-partnbr");if(r.length>0&&J[r]){if(p){o[F].setAttribute("title","You ordered this product previously.");}else{if(Cmn.HasCls(o[F],a)){}else{o[F].setAttribute("title","Your company ordered this product previously.");}}Cmn.AddCls(o[F],a);}}}if(Cmn.IsEmpty(N)==false){var Q=Cmn.GetElementsByClsNm("SpecChoiceLnk","a",l);var H=Q.length;if(H>0){for(var F=0;F<H;F++){var q=false;var E=FullPrsnttnWebPart.getClickablePartNbrCell(Cmn.GetAncestorByTagNm(Q[F],"td"));if(E!=null){var z=E.getAttribute("data-mcm-partnbr");var M=E.getAttribute("data-mcm-attr-comp-itm-ids");if(M){var k=M.split(",");}if(z&&J[z]){var G=Q[F].getAttribute("data-mcm-prod-attr-id");var P=Q[F].getAttribute("data-mcm-prod-attrval-id");var u=G+";"+P;if(N[u]){var t=N[u].split("|");for(var C=0;C<t.length;C++){if(t[C]===z||(k&&k.indexOf(J[t[C]])>=0)){q=true;break;}}if(q){Cmn.AddCls(Q[F],h);}}}}}}}}};var i=function(){return McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.SlctdSrchRsltId.KyTxt())||McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.DynamicPageSrchRsltId.KyTxt());};var e=function(k,o){var m=false;var n=o.length;for(var l=0;l<n;l++){if(k[o[l]]){m=true;break;}}return m;};var f=function(u,q,y){var r=true;for(var z in u.SpecSrchFilters){if(u.SpecSrchFilters.hasOwnProperty(z)){var p=u.SpecSrchFilters[z];for(var l in p){if(p.hasOwnProperty(l)){if(l=="SlctdVals"){var w=p[l];var k=0;for(var s in w){if(w.hasOwnProperty(s)){++k;}}if(k>0){if(k==1){for(var m in w){if(w.hasOwnProperty(m)){var v=z+";"+m;if(q[v]){var t=q[v].split("|");var x={};for(var o=0;o<t.length;o++){if(x[t[o]]){}else{x[t[o]]="0";}}var n=false;for(var o=0;o<y.length;o++){if(x[y[o]]){n=true;}}if(n==false){return false;}}else{return false;}}}}else{var n=false;for(var m in w){if(w.hasOwnProperty(m)){var v=z+";"+m;if(q[v]){var t=q[v].split("|");var x={};for(var o=0;o<t.length;o++){if(x[t[o]]){}else{x[t[o]]="0";}}for(var o=0;o<y.length;o++){if(x[y[o]]){n=true;}}}}}if(n==false){return false;}}}}}}}}return r;};};}

if(this.PageCntnrWebPart){}else{PageCntnrWebPart=new function(){var a=McMaster.MsgMgr.CntxtNms.DYNAMIC_PAGE,b=Cmn.DetectBrowser();this.ContentCntnrWdth=null;this.WebPart_Load=function(c){this.ContentCntnrWdth=c.ContentCntnrWdth;var d=new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.DYNAMIC_PAGE);var e=new McMaster.MsgMgrMsgs.WebPartLoaded(d,c.CntnrIDTxt);McMaster.MsgMgr.PubMsg(e);};this.WebPart_Unload=function(c){var d=new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.DYNAMIC_PAGE);var e=new McMaster.MsgMgrMsgs.WebPartUnloaded(d,c.CntnrIDTxt);McMaster.MsgMgr.PubMsg(e);};this.WebPart_PreUnload=function(c){this.PinnedCollUnload();};this.WebPart_LoadCmpl=function(c){this.PinnedCollSetup(c.PinnedContentColl);};this.PinnedCollSetup=function(c){PinnedPrsnttns.Load(c);McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.ProdPageReflow,McMasterCom.Nav.GetTopFrame().PinnedPrsnttns.Reposition);};this.PinnedCollUnload=function(){PinnedPrsnttns.Unload();};};}

this.PrsnttnWebPart||(PrsnttnWebPart=new function(){this.DoNothing=function(b){Cmn.StopEvnt(b)};this.WebPart_AssocFilesLoad=function(b){"Abbr"===e(b.CntnrIDTxt)?AbbrPrsnttnWebPart.WebPart_AssocFilesLoad(b):FullPrsnttnWebPart.WebPart_AssocFilesLoad(b)};this.WebPart_LoadCmpl=function(b){"Abbr"!==e(b.CntnrIDTxt)&&FullPrsnttnWebPart.WebPart_LoadCmpl(b)};this.WebPart_PreUnload=function(b){"Full"===e(b.CntnrIDTxt)&&FullPrsnttnWebPart.WebPart_PreUnload(b)};this.CrteImgEvntHndlrs=function(b){e(b.CntnrIDTxt);
FullPrsnttnWebPart.CrteImgEvntHndlrs(b)};this.UnloadImgEvntHndlrs=function(b){e(b.CntnrIDTxt);FullPrsnttnWebPart.UnloadImgEvntHndlrs(b)};this.SlctPartNbrs=function(b,c){var a=[];"Full"===e(b)&&0<c.length&&(a=FullPrsnttnWebPart.SlctPartNbrs(b,c));return a};this.Highlight=function(b){Cmn.AddCls(Cmn.GetObj(b),"aboutBoxHighlighted")};this.UnHighlight=function(b){Cmn.RemCls(Cmn.GetObj(b),"aboutBoxHighlighted")};this.TriggerMoreInd=function(b){"over"==b?Cmn.ReplaceCls(Cmn.GetObj("pullTab"),"moreInd","moreIndTriggered"):
Cmn.ReplaceCls(Cmn.GetObj("pullTab"),"moreIndTriggered","moreInd")};this.TriggerLessInd=function(b){"over"==b?Cmn.ReplaceCls(Cmn.GetObj("pushTab"),"lessInd","lessIndTriggered"):Cmn.ReplaceCls(Cmn.GetObj("pushTab"),"lessIndTriggered","lessInd")};this.HndlClickEvnt=function(b,c){var a=null;if(b)for(a=YAHOO.util.Event.getTarget(b);a.id!==c;)if(Cmn.HasCls(a,"AbbrPrsnttn")||Cmn.HasCls(a,"AbbrGenInfo")||Cmn.HasCls(a,"GroupPrsnttn_PrsnttnNm")){if(Cmn.HasCls(a,"AbbrGenInfo"))a=McMasterCom.Nav.GetTopFrame(),
new a.PerfTracker.Evnt(a.PerfTracker.EvntNms.GenInfoAbbrPrsnttnClick,a.PerfTracker.PgCntxtNms.DynCntnt);else{var f=a,a="",e=0,d=!0;if(Cmn.HasCls(f,"AbbrPrsnttn")){d=Cmn.GetElementsByClsNm("AbbrPrsnttn_PrsnttnNm","h3",f);0<d.length&&(a=Cmn.GetTxtContent(d[0]));d=Cmn.GetElementsByClsNm("AbbrPrsnttn","div");for(i=0;i<d.length;i++)d[i]==f&&(e=i+1);f=f.offsetTop;d=Cmn.GetElementsByClsNm("ProdPageContent","div")[0].offsetHeight;d=f<d?!0:!1;f=new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.CONTENT);a=new McMaster.MsgMgrMsgs.ProdInfoSlctd(f,
"AbbrPrsnttn",a,e,d);McMaster.MsgMgr.PubMsg(a)}}AbbrPrsnttnWebPart.HndlMouseEvnt(b,c,"click");"CtlgPageShell_CtlgPage_Cntnr"!=c&&DynamicPageWebPart.planningtimestamp&&(a=new Date,a-=DynamicPageWebPart.planningtimestamp,Cmn.TrkAct("FirstClick&delta="+a+"&type=abbrprsnttn"),DynamicPageWebPart.planningtimestamp=null);break}else if(Cmn.HasCls(a,"FullPrsnttn")||Cmn.HasCls(a,"FullGenInfo")||Cmn.HasCls(a,"OverlayImg")){FullPrsnttnWebPart.HndlClickEvnt(b,c);"CtlgPageShell_CtlgPage_Cntnr"!=c&&DynamicPageWebPart.planningtimestamp&&
(a=new Date,a-=DynamicPageWebPart.planningtimestamp,Cmn.TrkAct("FirstClick&delta="+a+"&type=fullprsnttn"),DynamicPageWebPart.planningtimestamp=null);break}else if(Cmn.HasCls(a,"InLnOrdWebPart_CloseLnk"))break;else a=a.parentNode};this.HndlMouseoverEvnt=function(b,c){var a=null;if(b&&(a=YAHOO.util.Event.getTarget(b)))for(;a.id!==c;)if(Cmn.HasCls(a,"AbbrPrsnttn")||Cmn.HasCls(a,"AbbrGenInfo")||Cmn.HasCls(a,"GroupPrsnttn_PrsnttnNm")){AbbrPrsnttnWebPart.HndlMouseEvnt(b,c,"mouseover");break}else if(Cmn.HasCls(a,
"FullPrsnttn")||Cmn.HasCls(a,"FullGenInfo")){FullPrsnttnWebPart.HndlMouseOverEvnt(b,c);break}else if(a=a.parentNode,!a)break};this.HndlMouseoutEvnt=function(b,c){var a=null;if(b&&(a=YAHOO.util.Event.getTarget(b)))for(;a.id!==c;)if(Cmn.HasCls(a,"AbbrPrsnttn")||Cmn.HasCls(a,"AbbrGenInfo")||Cmn.HasCls(a,"GroupPrsnttn_PrsnttnNm")){AbbrPrsnttnWebPart.HndlMouseEvnt(b,c,"mouseout");break}else if(Cmn.HasCls(a,"FullPrsnttn")||Cmn.HasCls(a,"FullGenInfo")){FullPrsnttnWebPart.HndlMouseOutEvnt(b,c);break}else if(a=
a.parentNode,!a)break};var e=function(b){return b.substr(0,b.indexOf("_"))}});


this.WebToolsetWebPart||(this.WebToolsetWebPart=new function(){var y=McMasterCom.Nav.GetTopFrame(),v=new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.WEB_TOOLSET_WEB_PART),z="",n=[],w=new Boolean,r=new CmnColls.HashTable,C=[{Cd:0,SuccessfulSubmissionInd:!0,MsgTxt:{SND_FDBK:"Thanks.  We appreciate your comments.",FRW_LNK:"Your email has been sent.",DEL_ORD:"Your order has been deleted.",SAVE_ORD:"Your order has been saved.",FWD_ORD:"Requisition forwarded to "}},{Cd:-1,SuccessfulSubmissionInd:!1,Typ:"General Failure",
MsgTxt:{SND_FDBK:"There was a problem sending your feedback.  Please try again.",FRW_LNK:"There was a problem forwarding your link.  Please try again.",DEL_ORD:"There was a problem deleting your order.  Please try again.",SAVE_ORD:"There was a problem saving your order.  Please try again.",FWD_ORD:"There was a problem forwarding your order.  Please try again."}},{Cd:-2,SuccessfulSubmissionInd:!1,Typ:"Invalid 'To' Email Address",MsgTxt:{FRW_LNK:"Please enter a valid 'To' e-mail address in the space provided.",
FWD_ORD:"Please enter a valid 'To' e-mail address in the space provided."}},{Cd:-3,SuccessfulSubmissionInd:!1,Typ:"Invalid 'From' Email Address",MsgTxt:{SND_FDBK:"Please enter your e-mail address in the space provided.",FRW_LNK:"Please enter your e-mail address in the space provided.",FWD_ORD:"Please enter your e-mail address in the space provided."}},{Cd:-4,SuccessfulSubmissionInd:!1,Typ:"No order lines",MsgTxt:{FWD_ORD:"Please add items to your order before forwarding."}}],p={CtlgOptOut:function(a){return"opted out to "+
a+" pages"},Snd:function(){return"submitted information"},Toggle:function(){return"expanded/collapsed form"}};this.WebPart_Load=function(a){z="";n=[];r.Add(a.CntnrIDTxt,null);for(i=0;i<a.Tools.length;i++)"ctlgPageFlipperTool"==a.Tools[i]?z=a.ChldWebParts[i].currentPage:"rltdCtlgPgsTool"==a.Tools[i]&&(n=a.ChldWebParts[i].PageNbrLst);F(a.CntnrIDTxt);1===r.Cnt()&&(McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.MainContentCntnrResized,A,McMaster.MsgMgr.PRIORITY.LOW),McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.ChooseSpecsStatChg,
A,McMaster.MsgMgr.PRIORITY.LOW));n instanceof Array&&0<n.length&&function(){for(var a=document.getElementById("MultiPageNav").getElementsByTagName("li"),b=0;b<a.length;b++)a[b].onmouseover=function(){this.className+=" sfhover"},a[b].onmouseout=function(){this.className=this.className.replace(/ sfhover\b/,"")}}();a=Cmn.GetApplEnvrPrfx()+Cmn.GetApplEnvrSfx();var b=Cmn.GetElementsByClsNm("WebToolsetWebPart_Icon_CtlgOptOut","a");if(0<b.length){var c=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.CurrRelatedCtlgPgsTxt.KyTxt()),
d;if(c&&(rltdPagesSesnValTxtStr=c.toString(),c=rltdPagesSesnValTxtStr.split(",").length,d=rltdPagesSesnValTxtStr.split(","),0<c))switch(a){case "wwwdev":b[0].setAttribute("href","http://wwwdev.mcmaster.com/#"+d[0]);break;case "wwwqual":b[0].setAttribute("href","http://wwwqual.mcmaster.com/#"+d[0]);break;case "pubdev":b[0].setAttribute("href","http://pubdev.mcmaster.com/#"+d[0]);break;case "pubqual":b[0].setAttribute("href","http://pubqual.mcmaster.com/#"+d[0]);break;case "pub":b[0].setAttribute("href",
"http://pub.mcmaster.com/#"+d[0]);break;default:b[0].setAttribute("href","http://www.mcmaster.com/#"+d[0])}}McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.MastheadLoginSlctd,function(a){a=r.Keys(r.Keys().length);a=Cmn.Get(a);toolsetToolWebPartCntnr=s(a);a=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_FormCntnr","div",toolsetToolWebPartCntnr);for(var b=0;b<a.length;b++){var c=a[b];c.style.display="none";(c=c.previousElementSibling)&&Cmn.HasCls(c,"WebToolsetToolWebPart_ActvCntnr")&&Cmn.RemCls(c,
"WebToolsetToolWebPart_ActvCntnr")}},McMaster.MsgMgr.PRIORITY.HIGH);a=new McMaster.MsgMgrMsgs.WebPartLoaded(v);McMaster.MsgMgr.PubMsg(a)};this.WebPart_AssocFilesLoad=function(a){this.WebPart_Load(a)};this.WebPart_Unload=function(a){r.Rem(a.CntnrIDTxt,null);n=z=null;0===r.Cnt()&&(McMaster.MsgMgr.RemSubscriber(McMaster.MsgMgrMsgs.MainContentCntnrResized,A),McMaster.MsgMgr.RemSubscriber(McMaster.MsgMgrMsgs.ChooseSpecsStatChg,A))};this.ClearAll_Click=function(a){SpecSrchInp.Get().RemAll().UpdateSession().PubMsg();
return!1};this.PrintTool_Click=function(a){y.print();(a=a.getAttribute("itmPrsnttnWebPartToolsetInd"))&&"True"==a?Cmn.TrkAct("ItmPrsnttnWebToolsetPrintToolClick","ItmPrsnttn"):(new h("Print","click")).Trk();return!1};this.FeedbackTool_Click=function(a){var b=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.CurrVstrCntctEmailAddrTxt.KyTxt());if(b&&0<b.length){var c=Cmn.GetNxtSibling(Cmn.GetAncestorByTagNm(a,"div"));Cmn.GetElementsByClsNm("WebToolsetToolWebPart_FrmEmailInp","input",c)[0].value=
b}f(a);a=new h("Feedback","click");a.ActDtl(p.Toggle());a.Trk();return!1};this.FeedbackTool_Submit=function(a){var b=k(a),c=x(b),d=l(b);m(d);var e=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_FrmEmailInp","input",b)[0].value,b=encodeURIComponent(Cmn.GetElementsByClsNm("WebToolsetToolWebPart_MsgInp","textarea",b)[0].value);0==b.length?this.FeedbackTool_Cancel(a):(a=G(),Cmn.GetObj("IntermediatePageWebPart_Page")&&(a="the "+a+" landing page"),e="frmEmailAddr="+e+("&custMsgTxt="+b),e+="&actvWebsiteCntxt="+
a,McMaster.CnxnMgr.PerformAjaxCnxn("/WebParts/WebToolsetWebPart/WebToolsetWebPart.aspx?toolReq=SND_FDBK",{httpMthd:"POST",postDat:e,success:function(a,b){var e=a.RC;0==e?t(e,"SND_FDBK",c):-2!=e&&q(e,q,d)},cnxnParm:{respTyp:"JSON"}}),e=new h("Feedback","submit"),e.ActDtl(p.Snd()),e.Trk());return!1};this.FeedbackTool_Cancel=function(a){a=k(a);var b=u(a).childNodes[0],c=l(a);f(b);setTimeout(function(){m(c)},300);return!1};this.HelpfulFeedbackTool_Click=function(a){var b=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.CurrVstrCntctEmailAddrTxt.KyTxt());
if(b&&0<b.length){var c=Cmn.GetNxtSibling(Cmn.GetAncestorByTagNm(a,"div"));Cmn.GetElementsByClsNm("WebToolsetToolWebPart_FrmEmailInp","input",c)[0].value=b}J(a);return w=!1};this.HelpfulFeedbackTool_onLoad=function(){var a=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_is-this-page-helpful","div")[0];Cmn.GetNxtSibling(a);J(a.children[0]);return w=!1};this.HelpfulFeedbackTool_Open=function(a){!1==w&&(a=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_is-this-page-helpful","div")[0],Cmn.GetNxtSibling(a),
P(a.children[0]));return!1};this.HelpfulFeedbackTool_Submit=function(a){var b=k(a),c=x(b),d=l(b);m(d);var e=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_FrmEmailInp","input",b)[0].value;a=function(a){for(var b=0;b<a.length;b++)for(var c=a[b].nextSibling.form.HelpfulnessReply,b=0;b<c.length;b++){var d=c[b];if(d.checked)return d.nextSibling.data}}(Cmn.GetElementsByClsNm("WebToolsetToolWebPart_HelpfulnessVal"));var g=encodeURIComponent(Cmn.GetElementsByClsNm("WebToolsetToolWebPart_MsgInp","textarea",
b)[0].value),b=G();Cmn.GetObj("IntermediatePageWebPart_Page")&&(b="the "+b+" landing page");e="frmEmailAddr="+e+("&custMsgTxt="+g);e+="&helpfulness="+a;e+="&actvWebsiteCntxt="+b;McMaster.CnxnMgr.PerformAjaxCnxn("/WebParts/WebToolsetWebPart/WebToolsetWebPart.aspx?toolReq=HELPFUL_FDBK",{httpMthd:"POST",postDat:e,success:function(a,b){var e=a.RC;0==e?(H(),t(e,"SND_FDBK",c)):-2!=e&&q(e,q,d)},cnxnParm:{respTyp:"JSON"}});w=!0;McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.ItmPrsnttnFeedbackFormOpened.KyTxt(),
!1);return!1};this.HelpfulFeedbackTool_CloseBtn=function(a){a=k(a);var b=u(a).childNodes[0],c=l(a);f(b);setTimeout(function(){m(c)},300);H();w=!0;McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.ItmPrsnttnFeedbackFormOpened.KyTxt(),!1);Q("FDBKOPEN",!0);return!1};var Q=function(a,b){McMaster.CnxnMgr.PerformAjaxCnxn("/WebParts/WebToolsetWebPart/WebToolsetWebPart.aspx?toolReq=UPDT_VSTR_PREF&prefNm="+a+"&prefValTxt="+b,{httpMthd:"GET",success:function(a){},cnxnParm:{respTyp:"JSON"}})};this.HelpfulFeedbackTool_Cancel=
function(a){a=k(a);var b=u(a).childNodes[0],c=l(a);f(b);setTimeout(function(){m(c)},300);H();w=!0;McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.ItmPrsnttnFeedbackFormOpened.KyTxt(),!1);return!1};this.CtlgPageOptOutTool_Click=function(a){a=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.CurrRelatedCtlgPgsTxt.KyTxt());var b=new McMaster.MsgMgrMsgs.CtlgPageSlctd(v);McMaster.MsgMgr.PubMsg(b);b=McMasterCom.Nav.GetTopFrame();new b.PerfTracker.Evnt(b.PerfTracker.EvntNms.CtlgPgOptOutLnkClick,
b.PerfTracker.PgCntxtNms.DynCntnt);var b=new h("Catalog Page Opt-out","click"),c=1;a&&(c=a.split(",").length);b.ActDtl(p.CtlgOptOut(c));b.Trk();return!1};this.ctlgPageFlipperTool_Click=function(a){return!1};this.ctlgPageFlipperToolPrevPage_Click=function(a){CtlgPageWebPart.CtlgPageLnk_Click(z-1,n);return!1};this.ctlgPageFlipperToolNextPage_Click=function(a){CtlgPageWebPart.CtlgPageLnk_Click(z+1,n);return!1};this.rltdCtlgPgsTool_Click=function(a){a=a.innerHTML.toString();McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.CurrCtlgPgNbr.KyTxt(),
a);n instanceof Array&&0<n.length&&McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.CurrRelatedCtlgPgsTxt.KyTxt(),n.toString());a=new McMaster.MsgMgrMsgs.CtlgPageSlctd(v);McMaster.MsgMgr.PubMsg(a);return!1};this.FwdLnkTool_Click=function(a){f(a);(a=a.getAttribute("itmPrsnttnWebPartToolsetInd"))&&"True"==a?Cmn.TrkAct("ItmPrsnttnWebToolsetForwardLnkClick","ItmPrsnttn"):(a=new h("Forward Link","click"),a.ActDtl(p.Toggle()),a.Trk());return!1};this.FwdLnkTool_Submit=function(a){var b=k(a),c=x(b),d=
l(b);m(d);a=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_FrmEmailInp","input",b)[0].value;var e=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_ToEmailInp","input",b)[0].value,b=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_MsgInp","textarea",b)[0].value;a="frmEmailAddr="+a+("&toEmailAddr="+e);a+="&custMsgTxt="+b;a+="&actvWebsiteCntxt="+G();a+="&urlTxt="+R();McMaster.CnxnMgr.PerformAjaxCnxn("/WebParts/WebToolsetWebPart/WebToolsetWebPart.aspx?toolReq=FRW_LNK",{httpMthd:"POST",postDat:a,success:function(a){a=
a.RC;0==a?t(a,"FRW_LNK",c):q(a,"FRW_LNK",d)},cnxnParm:{respTyp:"JSON"}});a=new h("Forward Link","submit");a.ActDtl(p.Snd());a.Trk();return!1};this.FwdLnkTool_Cancel=function(a){a=k(a);var b=u(a).childNodes[0],c=l(a);f(b);setTimeout(function(){m(c)},300);return!1};this.DelOrdTool_Click=function(a){f(a);a=new h("Delete Order","click");a.ActDtl(p.Toggle());a.Trk();return!1};this.DelOrdTool_Submit=function(a){a=k(a);var b=x(a),c=l(a);m(c);a="acttxt=delord&currts="+encodeURIComponent(OrdPadWebPart.OrdUpdtTsTxt);
McMaster.CnxnMgr.PerformAjaxCnxn("/HTTPHandlers/WebOrdMaintainer.aspx?"+a,{httpMthd:"GET",success:function(a){var e="",e="None"==a.ErrTxt?0:-1;0==e?(t(e,"DEL_ORD",b),a=new McMaster.MsgMgrMsgs.OrdDeleted(v),McMaster.MsgMgr.PubMsg(a)):-1==e&&q(e,"DEL_ORD",c)},cnxnParm:{respTyp:McMaster.CnxnMgr.JSON_RESP_TYP_TXT}});a=new h("Delete Order","submit");a.ActDtl(p.Snd());a.Trk();return!1};this.DelOrdTool_Cancel=function(a){a=k(a);var b=u(a).childNodes[0],c=l(a);f(b);setTimeout(function(){m(c)},300);return!1};
this.SaveOrdTool_Click=function(a){var b=Cmn.GetObj("OrdPadProdsWebPart_PoTxtBx").value,c="";0<b.length&&(c=b);Cmn.GetElementsByClsNm("WebToolsetToolWebPart_SaveOrdInp")[0].value=c;f(a);a=new h("Save Order","click");a.ActDtl(p.Toggle());a.Trk();return!1};this.SaveOrdTool_Submit=function(a){var b=function(){var b=k(a),d=x(b),e=l(b);m(e);var b=OrdPadWebPart.OrdUpdtTsTxt,g=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_SaveOrdInp","input")[0].value,b="acttxt=SAVEORD&currts="+encodeURIComponent(b)+"&potxt="+
encodeURIComponent(g);McMaster.CnxnMgr.PerformAjaxCnxn("/HTTPHandlers/WebOrdMaintainer.aspx?"+b,{httpMthd:"GET",success:function(a){var b="",b="None"==a.ErrTxt?0:-1;0==b?(t(b,"SAVE_ORD",d),a=new McMaster.MsgMgrMsgs.OrdSaved(v),McMaster.MsgMgr.PubMsg(a)):-1==b&&q(b,"SAVE_ORD",e)},cnxnParm:{respTyp:McMaster.CnxnMgr.JSON_RESP_TYP_TXT}});b=new h("Save Order","submit");b.ActDtl(p.Snd());b.Trk()};OrdPadWebPart.VldtOrdPad(!1,!1,b,b);return!1};this.DispConfMsg=function(a,b,c){a=Cmn.GetObj(a);a=Cmn.GetElementBy(function(a){return Cmn.HasCls(a,
b)},"div",a);var d=Cmn.GetNxtSibling(a);a=Cmn.GetPrevSibling(a);"FWD_ORD"==c&&(d.style.padding="10px 10px 20px 15px");K(a);t(0,c,d);"FWD_ORD"==c&&setTimeout(function(){d.style.height="Auto"},1700);return!1};this.SaveOrdTool_Cancel=function(a){a=k(a);var b=u(a).childNodes[0],c=l(a);f(b);setTimeout(function(){m(c)},300);return!1};this.SavedOrdsKyPress=function(a,b){if(13==(window.event?window.event.keyCode:b.which)){a.focus();var c=Cmn.GetAncestorByClsNm(a,"WebToolsetToolWebPart_Lbl"),c=Cmn.GetNxtSibling(c),
c=Cmn.GetFrstChld(c);this.SaveOrdTool_Submit(c)}return!1};this.FwdOrdTool_Click=function(a){var b=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.CurrVstrCntctEmailAddrTxt.KyTxt());0<b.length&&(Cmn.GetObj("FwdOrdTool_FrmEmailInp").value=b);f(a);a=new h("Forward Order","click");a.ActDtl(p.Toggle());a.Trk();return!1};this.FwdOrdTool_Submit=function(a){var b=function(){var b=k(a),d=x(b),e=l(b);m(e);var b=Cmn.Trim(Cmn.GetObj("FwdOrdTool_ToEmailInp").value),g=Cmn.GetObj("FwdOrdTool_MsgInp").value,
D=Cmn.GetObj("FwdOrdTool_CpyToChckBx").checked,f=Cmn.Trim(Cmn.GetObj("FwdOrdTool_FrmEmailInp").value),n=null!=Cmn.GetObj("OrdPadShpBillWebPart_CntctInfoNmInp")?Cmn.GetObj("OrdPadShpBillWebPart_CntctInfoNmCntnr").value:f;if(!Cmn.VldtEmailAddr(b))return q(-2,"FWD_ORD",e),!1;if(!Cmn.VldtEmailAddr(f))return q(-3,"FWD_ORD",e),!1;if(!OrdPadProdsWebPart.HaveOrdLn())return q(-4,"FWD_ORD",e),!1;C[0].MsgTxt.FWD_ORD="Requisition forwarded to:<br />"+b;b="acttxt=FWDORD&receiver="+encodeURIComponent(b)+"&sender_message="+
encodeURIComponent(g)+"&sendcopy="+encodeURIComponent(D)+"&emailcopytotxt="+encodeURIComponent(f)+"&sender="+encodeURIComponent(f)+"&fullname="+encodeURIComponent(n)+"&ordid="+McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.CurrOrdId.KyTxt())+"&cntxt=AJAX";g={httpMthd:"GET",success:function(a){0==a?(t(a,"FWD_ORD",d),d.style.height="Auto",a=new McMaster.MsgMgrMsgs.OrdForwarded(v),McMaster.MsgMgr.PubMsg(a)):-1==a&&q(a,"FWD_ORD",e)},cnxnParm:{respTyp:McMaster.CnxnMgr.JSON_RESP_TYP_TXT}};fwdOrdForm=
Cmn.Get("WebToolsetToolWebPart_FwdOrdTool_Form");fwdOrdForm.HiddenSubmitButton.click()?fwdOrdForm.HiddenSubmitButton.click():fwdOrdForm.submit();D=new h("Forward Order","submit");D.ActDtl(p.Toggle());D.Trk();McMaster.CnxnMgr.PerformAjaxCnxn("/order/ProcssRteOrd.aspx?"+b,g)};OrdPadWebPart.VldtOrdPad(!1,!1,b,b);return!1};this.FwdOrdTool_Cancel=function(a){a=k(a);var b=u(a),c=l(a);f(b.childNodes[0]);setTimeout(function(){m(c)},300);return!1};this.PrintOrd_Click=function(){var a=new h("Print Order","click");
a.ActDtl(p.Toggle());a.Trk();OrdPadWebPart.PrintOrdPad();return!1};this.PrtMdl_Click=function(a,b){var c=Cmn.GetObj("MainContent");Cmn.GetFrstChld(c);var d=Cmn.GetNxtSibling(c),d=Cmn.GetFrstChld(d);d.src=b;Cmn.SetStyle(d,"display","block");Cmn.SetStyle(c,"display","none");c=new h("Print CAD","click");c.ActDtl(b);c.Trk()};this.HideAllTxtTools=function(a){a=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_TxtTool_Cntnr","div",a);for(var b=0;b<a.length;b++)a[b].style.display="none";return!1};this.ShowAllTxtTools=
function(a){a=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_TxtTool_Cntnr","div",a);for(var b=0;b<a.length;b++)a[b].style.display="block";return!1};this.CloseCnfrmMsg=function(a){B(a);return!1};var F=function(a){if(!Cmn.IsAppMode()){var b=Cmn.GetObj(a);if(b){var c=Cmn.GetElementsByClsNm("WebToolsetWebPart_Cntnr","div",b)[0],d=b.parentNode;Cmn.GetAncestorBy(b,function(a){return"absolute"==Cmn.GetStyle(a,"position")});var e=Shell.GetMainContentTopPosn();"IE 7.0"==Cmn.DetectBrowser()&&(e-=2);var g=0;
"SpecSrch_Inner"===d.id?(setTimeout(function(){F(a)},0),d=Cmn.GetNxtSibling(b),g=Cmn.Utilities.Empty(d)?177:Cmn.GetWidth(d)-10,Shell.GetSecondaryContentWdth(),e+=1):Cmn.HasCls(d,"DynamicPage")||"ProdPageContent_Inner"===d.id?(Cmn.HasCls(d.parentElement.parentElement.firstChild,"SpecSrch_Cntnr")||Cmn.HasCls(d.parentElement.parentElement.parentElement.firstChild,"SpecSrch_Cntnr"),g=Shell.GetMainContentWidth()-ProdPageWebPart.GetSpecSrchWdth()-parseInt(Cmn.GetStyle("ProdPageContent","padding-right"))-
parseInt(Cmn.GetStyle("ProdPageContent","padding-left"))-19,Shell.GetSecondaryContentWdth(),ProdPageWebPart.GetSpecSrchWdth(),parseInt(Cmn.GetStyle("ProdPageContent","padding-left"))):(g=Shell.GetMainContentWidth()-19,Shell.GetSecondaryContentWdth());"IE 6.0"==Cmn.DetectBrowser()||Cmn.IsTouchAware()||Cmn.SetStyle(c,"top",e+"px");Cmn.SetStyle(c,"width",g+"px");e=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_ConfirmationMsg","div",b);for(c=0;c<e.length;c++)Cmn.SetStyle(e[c],"top","21px");e=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_FormCntnr",
"div",b);for(c=0;c<e.length;c++)Cmn.SetStyle(e[c],"top","21px"),Cmn.AddDropShadow(e[c]);if(d=Cmn.GetNxtSibling(b))null==r.Itm(a)&&(c=parseFloat(Cmn.GetStyle(d,"padding-top")),r.Replace(a,c)),c=r.Itm(a),null!=c&&Cmn.SetStyle(d,"padding-top",c+"px"),Cmn.SetStyle(b,"padding-bottom","22px");b=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_Aligned_RIGHT","div",b);Cmn.AddCls(b[0],"WebToolsetToolWebPart_RightmostTool_Cntnr")}}},E=function(a){var b=a.cloneNode(!0);b.style.position="absolute";b.style.left=
"-9999px";b.style.display="block";b.style.height="auto";Cmn.InsrtAfter(b,a);a=Cmn.GetWidth(b);Cmn.RemElem(b);return a},L=function(a){var b=a.cloneNode(!0);b.style.position="absolute";b.style.left="-9999px";b.style.display="block";b.style.height="auto";Cmn.InsrtAfter(b,a);a=Cmn.GetHeight(b)-14;Cmn.RemElem(b);return a},A=function(){for(var a=r.Keys(),b=0;b<a.length;b++)F(a[b])};this.ResizeActive=A;var U=function(a){if("block"===Cmn.GetStyle(a,"display")){var b=Cmn.Animation.CrteTransitionStyle(Cmn.Animation.PropertyNms.HGT_NM,
"0px"),b=Cmn.Animation.CrteAnimation(a,b,0.3);b.OnCmpl=function(){Cmn.SetStyle(a,"display","none");Cmn.SetStyle(a,"overflow","visible")}}else{S(a);Cmn.SetStyle(a,"display","block");Cmn.SetStyle(a,"height",0);var c=L(a),b=Cmn.Animation.CrteTransitionStyle(Cmn.Animation.PropertyNms.HGT_NM,c+"px"),b=Cmn.Animation.CrteAnimation(a,b,0.3);b.OnCmpl=function(){Cmn.SetStyle(a,"height","auto");Cmn.SetStyle(Cmn.GetFrstChld(a),"height",c+10);Cmn.SetStyle(a,"overflow","visible");T(a)}}Cmn.SetStyle(a,"overflow",
"hidden");Cmn.Animation.PerformAnimation(b)},W=function(a){if("block"===Cmn.GetStyle(a,"display")){var b=Cmn.Animation.CrteTransitionStyle(Cmn.Animation.PropertyNms.HGT_NM,"0px"),b=Cmn.Animation.CrteAnimation(a,b,0.3);b.OnCmpl=function(){Cmn.SetStyle(a,"display","none");Cmn.SetStyle(a,"overflow","visible")}}else{V(a);Cmn.SetStyle(a,"display","block");Cmn.SetStyle(a,"height",0);var c=L(a),b=Cmn.Animation.CrteTransitionStyle(Cmn.Animation.PropertyNms.HGT_NM,c+"px"),b=Cmn.Animation.CrteAnimation(a,b,
0.3);b.OnCmpl=function(){Cmn.SetStyle(a,"height","auto");Cmn.SetStyle(Cmn.GetFrstChld(a),"height",c+10);Cmn.SetStyle(a,"overflow","visible")}}Cmn.SetStyle(a,"overflow","hidden");Cmn.Animation.PerformAnimation(b)},S=function(a){var b=Cmn.GetPrevSiblingBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_Cntnr"))return!0}),b=Cmn.GetX(b),c=E(a),d=s(a),e=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_RightmostTool_Cntnr","div",d)[0],d=0,b=Cmn.GetRegion(e).right-(b+c);0<b&&(d=b);Cmn.SetStyle(a,"right",
d+"px")},V=function(a){var b=Cmn.GetPrevSiblingBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_Cntnr"))return!0});Cmn.GetX(b);E(a);var c=s(a),b=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_RightmostTool_Cntnr","div",c)[0],b=Cmn.GetRegion(b).right,c=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_is-this-page-helpful","div",c)[0],c=Cmn.GetRegion(c).left;Cmn.IsIE()?(Cmn.SetStyle(a,"width",b-c+-25+"px"),Cmn.SetStyle(a,"right","-4px")):(b=Cmn.IsGecko()?b-c+-28:b-c+-29,Cmn.SetStyle(a,"width",b+
"px"),Cmn.SetStyle(a,"right","0px"))},X=function(a){var b=Cmn.GetPrevSiblingBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_Cntnr"))return!0});Cmn.GetX(b);E(a);var c=s(a),b=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_Aligned_RIGHT","div",c)[0],b=Cmn.GetRegion(b).right;E(c);c=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_is-this-page-helpful","div",c)[0];c=Cmn.GetRegion(c).left;Cmn.IsIE()?(Cmn.SetStyle(a,"width",b-c+-25+"px"),Cmn.SetStyle(a,"right","-4px")):(b=Cmn.IsGecko()?b-c+-28:b-c+-29,
Cmn.SetStyle(a,"width",b+"px"),Cmn.SetStyle(a,"right","0px"))},T=function(a){a=Cmn.GetElementsBy(function(a){if("text"==a.type||"textarea"==a.type)return!0},null,a);if(0<a.length){a=a[0];try{a.focus()}catch(b){}}},P=function(a){B(a);a=Cmn.GetAncestorBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_Cntnr"))return!0});M(a);a=Cmn.GetNxtSiblingBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_FormCntnr"))return!0});X(a);Cmn.SetStyle(a,"display","block")},f=function(a){B(a);a=Cmn.GetAncestorBy(a,
function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_Cntnr"))return!0});K(a);var b=Cmn.GetNxtSiblingBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_FormCntnr"))return!0});I(b);setTimeout(function(){U(b)},100)},J=function(a){B(a);a=Cmn.GetAncestorBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_Cntnr"))return!0});M(a);var b=Cmn.GetNxtSiblingBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_FormCntnr"))return!0});I(b);setTimeout(function(){W(b)},100)},s=function(a){return Cmn.GetAncestorBy(a,
function(a){if(Cmn.HasCls(a,"WebToolsetWebPart_Cntnr"))return!0})},u=function(a){return Cmn.GetPrevSiblingBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_Cntnr"))return!0})},k=function(a){return Cmn.GetAncestorBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_FormCntnr"))return!0})},x=function(a){return Cmn.GetNxtSiblingBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetToolWebPart_ConfirmationMsg"))return!0})},l=function(a){return Cmn.GetElementsByClsNm("WebToolsetToolWebPart_ErrMsgCntnr",
"div",a)[0]},I=function(a){toolsetToolWebPartCntnr=s(a);for(var b=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_FormCntnr","div",toolsetToolWebPartCntnr),c=0;c<b.length;c++){var d=b[c];a&&d==a||(d.style.display="none")}},B=function(a,b){for(var c=Cmn.GetAncestorBy(a,function(a){if(Cmn.HasCls(a,"WebToolsetWebPart_Cntnr"))return!0}),c=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_ConfirmationMsg","div",c),d=0;d<c.length;d++){var e=c[d];b&&e==b||(e.style.display="none")}},M=function(a){for(var b=s(a),
b=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_Cntnr","div",b),c,d=0;d<b.length;d++){var e=b[d];Cmn.RemCls(e,"WebToolsetToolWebPart_AdjacentInactvCntnr");e==a?Cmn.HasCls(e,"WebToolsetToolWebPart_ActvCntnr")?(Cmn.RemCls(e,"WebToolsetToolWebPart_ActvCntnr"),McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.ItmPrsnttnFeedbackFormOpened.KyTxt(),!1)):(Cmn.AddCls(e,"WebToolsetToolWebPart_ActvCntnr"),McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.ItmPrsnttnFeedbackFormOpened.KyTxt(),!0),c=d+1):
Cmn.RemCls(e,"WebToolsetToolWebPart_ActvCntnr")}b[c]&&Cmn.AddCls(b[c],"WebToolsetToolWebPart_AdjacentInactvCntnr")},K=function(a){for(var b=s(a),b=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_Cntnr","div",b),c,d=0;d<b.length;d++){var e=b[d];Cmn.RemCls(e,"WebToolsetToolWebPart_AdjacentInactvCntnr");e==a?Cmn.HasCls(e,"WebToolsetToolWebPart_ActvCntnr")?Cmn.RemCls(e,"WebToolsetToolWebPart_ActvCntnr"):(Cmn.AddCls(e,"WebToolsetToolWebPart_ActvCntnr"),c=d+1):Cmn.RemCls(e,"WebToolsetToolWebPart_ActvCntnr")}b[c]&&
Cmn.AddCls(b[c],"WebToolsetToolWebPart_AdjacentInactvCntnr")},t=function(a,b,c){a=N(a,b);b=s(c);b=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_Cntnr","div",b);for(var d=0;d<b.length;d++){var e=b[d];Cmn.RemCls(e,"WebToolsetToolWebPart_AdjacentInactvCntnr");Cmn.RemCls(e,"WebToolsetToolWebPart_ActvCntnr")}I(c);B(c,c);d=s(c);e=d.getElementsByTagName("input");for(b=0;b<e.length;b++){var g=e[b];Cmn.HasCls(g,"WebToolsetToolWebPart_FrmEmailInp")||(g.value="")}d=d.getElementsByTagName("textarea");for(b=0;b<
d.length;b++)d[b].value="";c.style.display="block";Cmn.GetElementsByClsNm("WebToolsetToolWebPart_ConfirmationMsgTxt","div",c)[0].innerHTML=a;Y(c)},q=function(a,b,c){a=N(a,b);c.innerHTML=a},m=function(a){a.innerHTML=""},N=function(a,b){for(var c="",d=0;d<C.length;d++)if(C[d].Cd==a){c=C[d].MsgTxt[b];break}return c},Y=function(a){var b=Cmn.Animation.CrteTransitionStyle(Cmn.Animation.PropertyNms.OPACITY_NM,"0"),c=Cmn.Animation.CrteAnimation(a,b,0.5);c.OnCmpl=function(){Cmn.SetStyle(a,"display","none");
Cmn.SetStyle(a,"opacity",1)};setTimeout(function(){Cmn.Animation.PerformAnimation(c)},1500)},H=function(){for(var a=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_HelpfulnessVal"),b=s(a[0]),c=b.getElementsByTagName("input"),a=0;a<c.length;a++)c[a].value="";b=b.getElementsByTagName("textarea");for(a=0;a<b.length;a++)b[a].value="";b=Cmn.GetElementsByClsNm("WebToolsetToolWebPart_HelpfulnessVal");for(a=0;a<b.length;a++){c=b[a].nextSibling.form.HelpfulnessReply;for(a=0;a<c.length;a++){var d=c[a];d.checked&&
(d.checked=!1)}}},G=function(){var a="the home page",b=O();0<b.length&&(a=b.replace(/\-/g," "));return a},R=function(){var a=Cmn.BldNonSecureURL(y.location.pathname,y.location.search,y.location.hostname),a=a+("#"+O());return encodeURIComponent(a)},O=function(){var a="",a=y.location.hash,b=McMaster.UrlMgr.SesnStKyPrfxTxt(),a=a.split(b,2)[0];return a=a.replace(/[#\/]/g,"")},h=function(a,b){var c="",d="",e="",c=a,e=b;this.Trk=function(){var a=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.SlctdSrchRsltTxt.KyTxt()),
a=encodeURIComponent(a),b;b="reqtyp="+c;b+="&acttyp="+e;b+="&actdtl="+d;Cmn.TrkAct(b+("&srchtrm="+a),"WebToolset")};this.ActDtl=function(a){d=a}}});


(function(){window.mPageEmbeddedFiles=window.mPageEmbeddedFiles||{};var f=window.mPageEmbeddedFiles;f['prodpagewebpart.js']=1;f['specinteractions.js']=1;f['specsrchinp.js']=1;f['specsrchwebpart.js']=1;f['specsrchwebpart.maintainfocus.js']=1;f['specsrchwebpart.specinfo.js']=1;f['contentwebpart.js']=1;f['pagecntnrwebpart.js']=1;f['prsnttnwebpart.js']=1;f['webtoolsetwebpart.js']=1;})();